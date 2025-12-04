USAGE
=====

Overview

This app is designed to open and display Telegram HTML exports locally. It reads the exported HTML and resolves local media files (images, videos, voice notes, stickers, files).

Supported inputs
- Telegram HTML export folder containing `messages.html` (or `messages1.html`) and media files.

Loading a chat
1. Start the dev server (`npm run dev`) and open the app in the browser.
2. Use the folder chooser in the app to select the exported Telegram folder (or drag the `messages.html`).
3. The app parses messages and media and populates the chat view.

Key interactions
- Media viewer: click a photo/video/GIF/animation to open the global viewer. Use the on-screen Prev/Next buttons or left/right arrow keys to navigate.
- Close viewer: `Esc` or the close button.
- Voice messages: play inline using the play/pause button; waveform indicates progress and remaining time.
- Spoilers: click to reveal (animated pop effect).
- Code blocks: syntax highlighting and a copy button appear on hover.
- Quotes/replies: the app attempts to show a preview of the quoted message (sender + formatted content) when available in the export.

Notes & troubleshooting
- If media files aren't showing, confirm the export folder structure is intact and that the app can access the media files (check console for missing file errors).
- For large chats the parser batches parsing to keep the UI responsive.

Keyboard shortcuts
- Left / Right: previous / next in global media viewer
- Esc: close global viewer
- Space: play/pause video in viewer (where applicable)

File locations of interest
- `src/utils/parser.js` — HTML parsing and media/file resolution
- `src/components/MessageList.jsx` — virtualized message list
- `src/components/MediaViewer.jsx` — full-screen media viewer
- `src/components/FormattedText.jsx` — rendering of formatted HTML
- `src/components/AudioMessage.jsx` — audio waveform player UI
