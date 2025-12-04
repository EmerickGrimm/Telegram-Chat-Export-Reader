import { findFileInFolder, getRelativePath } from './fileHandler';

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
      // Look for thumbnail
      const tgsPath = getRelativePath(href, basePath);
      const thumbPath = tgsPath.replace('.tgs', '.tgs_thumb');
      const thumbUrl = await findFileInFolder(allFiles, thumbPath);
      
      // Only add if we have a thumbnail or emoji
      if (thumbUrl || emoji) {
        media.push({ 
          type: 'animated_sticker', 
          thumb: thumbUrl,
          emoji: emoji || '🎨' 
        });
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