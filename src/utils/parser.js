import { findFileInFolder, getRelativePath } from './fileHandler';

const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

const renderJsonText = value => {
  if (typeof value === 'string' || typeof value === 'number') return escapeHTML(value);
  if (!Array.isArray(value)) return '';
  return value.map(part => {
    if (typeof part === 'string') return escapeHTML(part);
    if (!part || typeof part !== 'object') return '';
    const content = renderJsonText(part.text);
    const tags = { bold: 'strong', italic: 'em', underline: 'u', strikethrough: 's', spoiler: 'span', code: 'code' };
    if (part.type === 'pre') return `<pre><code>${content}</code></pre>`;
    if (part.type === 'blockquote') return `<blockquote>${content}</blockquote>`;
    if (part.type === 'text_link' || part.type === 'link') {
      const href = part.href || part.text;
      const safeHref = /^(https?:|mailto:|tg:)/i.test(href || '') ? href : '#';
      return `<a href="${escapeHTML(safeHref)}" target="_blank" rel="noreferrer">${content}</a>`;
    }
    const tag = tags[part.type];
    if (tag === 'span') return `<span class="formatted-spoiler" data-hidden="${escapeHTML(part.text)}">${content}</span>`;
    return tag ? `<${tag}>${content}</${tag}>` : content;
  }).join('');
};

export const parseJsonExport = async (data, files) => {
  const basePath = files.find(file => file.webkitRelativePath)?.webkitRelativePath?.split('/')[0] || '';
  const resolvePath = path => path ? findFileInFolder(files, basePath ? `${basePath}/${path}` : path) : null;
  const messages = await Promise.all((data.messages || []).map(async (source, index) => {
    const text = Array.isArray(source.text)
      ? source.text.map(part => typeof part === 'string' ? part : part?.text || '').join('')
      : String(source.text || '');
    const sender = source.from || source.actor || '';
    const time = source.date ? new Date(source.date).toLocaleString() : '';
    if (source.type === 'service') {
      const actionText = source.action ? source.action.replace(/_/g, ' ') : '';
      return { id: `message${source.id ?? index}`, type: 'service', text: [sender, actionText].filter(Boolean).join(' ') || text };
    }

    const media = [];
    const mainFile = source.file || source.photo;
    const thumb = await resolvePath(source.thumbnail);
    const url = await resolvePath(mainFile);
    const duration = source.duration_seconds ? `${source.duration_seconds}s` : '';
    if (source.location_information) {
      const { latitude, longitude } = source.location_information;
      media.push({ type: 'location', url: `https://maps.google.com/?q=${latitude},${longitude}`, coords: `${latitude}, ${longitude}` });
    }
    if (source.contact_information) {
      const contact = source.contact_information;
      media.push({ type: 'contact', name: [contact.first_name, contact.last_name].filter(Boolean).join(' '), phone: contact.phone_number || '' });
    }
    if (url) {
      switch (source.media_type) {
        case 'sticker':
          if (source.mime_type === 'application/x-tgsticker') {
            media.push({ type: 'animated_sticker', url, thumb, emoji: source.sticker_emoji || '🎨', isTgs: true });
          } else if (/\.webm$/i.test(mainFile)) {
            media.push({ type: 'sticker', url, thumb, emoji: source.sticker_emoji || '', isVideo: true });
          } else {
            media.push({ type: 'sticker', url, thumb, emoji: source.sticker_emoji });
          }
          break;
        case 'animation': media.push({ type: 'gif', url, thumb }); break;
        case 'video_message': media.push({ type: 'round_video', url, thumb, duration }); break;
        case 'video_file': media.push({ type: 'video', url, thumb, duration }); break;
        case 'voice_message': media.push({ type: 'voice', url, duration }); break;
        default:
          if (source.photo) media.push({ type: 'photo', url, thumb: thumb || url });
          else if (source.file) media.push({ type: 'file', url, title: source.file_name || source.file.split('/').pop(), size: source.file_size ? `${Math.round(source.file_size / 1024)} KB` : '' });
      }
    }

    const replyTo = source.reply_to_message_id ? {
      text: `Reply to message ${source.reply_to_message_id}`,
      isAnotherChat: Boolean(source.reply_to_peer_id),
      messageId: Number(source.reply_to_message_id)
    } : null;
    return {
      id: `message${source.id ?? index}`, type: 'message', from: sender, time,
      text, formattedHTML: renderJsonText(source.text), replyTo, media,
      initials: sender.split(/\s+/).map(word => word[0] || '').slice(0, 2).join('').toUpperCase(), userpicClass: 'userpic1',
      forwardedFrom: source.forwarded_from || ''
    };
  }));
  const byId = new Map(messages.map(message => [message.id.replace('message', ''), message]));
  return {
    title: data.name || 'Chat',
    messages: messages.map(message => message.replyTo && !message.replyTo.isAnotherChat && byId.has(String(message.replyTo.messageId))
      ? { ...message, replyTo: { ...message.replyTo, quotedMessage: byId.get(String(message.replyTo.messageId)) } }
      : message)
  };
};

export const parseMessage = async (messageDiv, allFiles, basePath) => {
  const id = messageDiv.id;
  const isService = messageDiv.classList.contains('service');
  
  if (isService) {
    const body = messageDiv.querySelector('.body');
    return {
      id,
      type: 'service',
      text: body?.textContent.trim() || ''
    };
  }

  const fromName = messageDiv.querySelector('.from_name')?.textContent.trim() || '';
  const dateEl = messageDiv.querySelector('.date');
  const time = dateEl?.textContent.trim() || '';
  const textEl = messageDiv.querySelector('.text');
  const text = textEl?.textContent.trim() || '';
  
  // Extract reply_to (quote) information
  const replyToEl = messageDiv.querySelector('.reply_to');
  let replyTo = null;
  if (replyToEl) {
    const text = replyToEl.textContent.trim();
    const link = replyToEl.querySelector('a');
    const isAnotherChat = text.includes('another chat');
    const messageId = link ? link.getAttribute('href')?.match(/\d+/)?.[0] : null;
    
    replyTo = {
      text: text,
      isAnotherChat: isAnotherChat,
      messageId: messageId ? parseInt(messageId) : null
    };
  }
  
  // Extract formatted HTML from text element, handling special cases
  let formattedHTML = '';
  if (textEl) {
    // Clone the element to manipulate without affecting the DOM
    const clone = textEl.cloneNode(true);
    
    // Convert spoilers from hidden span to data attribute for client-side handling
    const spoilers = clone.querySelectorAll('.spoiler');
    spoilers.forEach(sp => {
      const hidden = sp.querySelector('[aria-hidden="true"]')?.textContent || '●●●';
      sp.className = 'formatted-spoiler';
      sp.setAttribute('data-hidden', hidden);
      sp.innerHTML = hidden;
      sp.onclick = null;
    });

    // Get inner HTML and clean it up
    formattedHTML = clone.innerHTML.trim();
  }
  
  const media = [];
  
  // Photos
  const photos = messageDiv.querySelectorAll('.photo_wrap');
  for (const photo of photos) {
    const href = photo.getAttribute('href');
    const img = photo.querySelector('img');
    if (href) {
      const url = await findFileInFolder(allFiles, getRelativePath(href, basePath));
      const thumbUrl = img ? await findFileInFolder(allFiles, getRelativePath(img.src, basePath)) : null;
      if (url || thumbUrl) {
        media.push({ type: 'photo', url: url || thumbUrl, thumb: thumbUrl });
      }
    }
  }
  
  // Animated Stickers (.tgs with thumbnail)
  const animatedStickers = messageDiv.querySelectorAll('.media_photo');
  for (const sticker of animatedStickers) {
    const title = sticker.querySelector('.title')?.textContent.trim();
    const emoji = sticker.querySelector('.status')?.textContent.trim();
    const href = sticker.getAttribute('href');
    
    if (title === 'Sticker' && href) {
      const stickerPath = getRelativePath(href, basePath);
      const thumbPath = `${stickerPath}_thumb.jpg`;
      const thumbUrl = await findFileInFolder(allFiles, thumbPath);
      const stickerUrl = await findFileInFolder(allFiles, stickerPath);

      if (/\.webm$/i.test(href)) {
        if (stickerUrl || thumbUrl) {
          media.push({ type: 'sticker', url: stickerUrl, thumb: thumbUrl, emoji: emoji || '', isVideo: true });
        }
      } else if (/\.tgs$/i.test(href)) {
        if (thumbUrl || emoji || stickerUrl) {
          media.push({
            type: 'animated_sticker',
            thumb: thumbUrl,
            url: stickerUrl,
            emoji: emoji || '🎨',
            isTgs: true
          });
        }
      }
    }
  }
  
  // Static Stickers (.webp)
  const staticStickers = messageDiv.querySelectorAll('.sticker_wrap');
  for (const sticker of staticStickers) {
    const href = sticker.getAttribute('href');
    const img = sticker.querySelector('img');
    if (href) {
      const url = await findFileInFolder(allFiles, getRelativePath(href, basePath));
      const thumbUrl = img ? await findFileInFolder(allFiles, getRelativePath(img.src, basePath)) : null;
      if (url || thumbUrl) {
        media.push({ type: 'sticker', url: url || thumbUrl });
      }
    } else if (img && img.src) {
      // Fallback: use the image src directly if no href
      const thumbUrl = await findFileInFolder(allFiles, getRelativePath(img.src, basePath));
      if (thumbUrl) {
        media.push({ type: 'sticker', url: thumbUrl });
      }
    }
  }
  
  // GIF animations (animated_wrap)
  const gifs = messageDiv.querySelectorAll('.animated_wrap');
  for (const gif of gifs) {
    const href = gif.getAttribute('href');
    const thumb = gif.querySelector('img');
    if (href) {
      const url = await findFileInFolder(allFiles, getRelativePath(href, basePath));
      const thumbUrl = thumb ? await findFileInFolder(allFiles, getRelativePath(thumb.src, basePath)) : null;
      if (url) {
        media.push({ type: 'gif', url, thumb: thumbUrl });
      }
    }
  }
  
  // Videos
  const videos = messageDiv.querySelectorAll('.video_file_wrap');
  for (const video of videos) {
    const href = video.getAttribute('href');
    const thumb = video.querySelector('img');
    const duration = video.querySelector('.video_duration')?.textContent || '';
    if (href) {
      const url = await findFileInFolder(allFiles, getRelativePath(href, basePath));
      const thumbUrl = thumb ? await findFileInFolder(allFiles, getRelativePath(thumb.src, basePath)) : null;
      if (url) {
        media.push({ type: 'video', url, thumb: thumbUrl, duration });
      }
    }
  }
  
  // Round video messages
  const roundVideos = messageDiv.querySelectorAll('.media_video');
  for (const rv of roundVideos) {
    const href = rv.getAttribute('href');
    const thumb = rv.querySelector('img');
    const duration = rv.querySelector('.status')?.textContent || '';
    if (href && href.includes('round_video')) {
      const url = await findFileInFolder(allFiles, getRelativePath(href, basePath));
      const thumbUrl = thumb ? await findFileInFolder(allFiles, getRelativePath(thumb.src, basePath)) : null;
      if (url) {
        media.push({ type: 'round_video', url, thumb: thumbUrl, duration });
      }
    }
  }
  
  // Voice messages
  const voiceMessages = messageDiv.querySelectorAll('.media_voice_message');
  for (const vm of voiceMessages) {
    const href = vm.getAttribute('href');
    const duration = vm.querySelector('.status')?.textContent || '';
    if (href) {
      const url = await findFileInFolder(allFiles, getRelativePath(href, basePath));
      if (url) {
        media.push({ type: 'voice', url, duration });
      }
    }
  }
  
  // Location
  const locations = messageDiv.querySelectorAll('.media_location');
  for (const loc of locations) {
    const href = loc.getAttribute('href');
    const coords = loc.querySelector('.status')?.textContent.trim() || '';
    if (href) {
      media.push({ type: 'location', url: href, coords });
    }
  }
  
  // Contact
  const contacts = messageDiv.querySelectorAll('.media_contact');
  for (const contact of contacts) {
    const name = contact.querySelector('.title')?.textContent.trim() || '';
    const phone = contact.querySelector('.status')?.textContent.trim() || '';
    if (name || phone) {
      media.push({ type: 'contact', name, phone });
    }
  }
  
  // Phone/Video Calls
  const calls = messageDiv.querySelectorAll('.media_call');
  for (const call of calls) {
    const name = call.querySelector('.title')?.textContent.trim() || '';
    const status = call.querySelector('.status')?.textContent.trim() || '';
    if (name || status) {
      media.push({ type: 'call', name, status });
    }
  }
  
  // Files
  const files = messageDiv.querySelectorAll('.media_file');
  for (const file of files) {
    const href = file.getAttribute('href');
    const title = file.querySelector('.title')?.textContent || '';
    const size = file.querySelector('.status')?.textContent || '';
    if (href) {
      const url = await findFileInFolder(allFiles, getRelativePath(href, basePath));
      if (url) {
        media.push({ type: 'file', url, title, size });
      }
    }
  }
  
  // Animations (also in .media_video but different)
  const animations = messageDiv.querySelectorAll('.media_video');
  for (const anim of animations) {
    const href = anim.getAttribute('href');
    const title = anim.querySelector('.title')?.textContent || '';
    if (href && !href.includes('round_video') && title === 'Animation') {
      const url = await findFileInFolder(allFiles, getRelativePath(href, basePath));
      if (url) {
        media.push({ type: 'animation', url });
      }
    }
  }

  const userpic = messageDiv.querySelector('.userpic');
  const initials = userpic?.querySelector('.initials')?.textContent.trim() || '';
  const userpicClass = userpic?.className.match(/userpic\d+/)?.[0] || 'userpic1';

  // Filter out any undefined or invalid media items before returning
  const validMedia = media.filter(item => item && typeof item === 'object' && item.type);

  return {
    id,
    type: 'message',
    joined: messageDiv.classList.contains('joined'),
    from: fromName,
    time,
    text,
    formattedHTML,
    replyTo,
    media: validMedia,
    initials,
    userpicClass
  };
};
