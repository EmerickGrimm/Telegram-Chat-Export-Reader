# Telegram Chat Viewer

A lightweight React app to view Telegram HTML exports locally, with rich formatting, media browsing, and a Telegram-like UI.

Features
- Renders Telegram message exports (`messages.html` / `messages1.html`) with formatting (bold, italic, code blocks, spoilers, blockquotes).
- Media handling: photos, videos, GIFs, stickers, animations, files, locations, contacts and voice messages.
- Global media viewer with keyboard navigation and a counter (X / Y).
- Inline round-video playback and Telegram-style audio waveform for voice messages.
- Quote (reply) preview: shows the actual quoted message content when available.

Quick start

1. Install dependencies

```powershell
npm install
```

2. Start dev server

```powershell
npm run dev
```

Open the local server URL printed by Vite (usually http://localhost:3000) in your browser.

How to use
- Export a chat from Telegram (HTML export). Place the exported folder somewhere accessible.
- In the app: choose the exported folder (the app reads `messages.html` or `messages1.html` and associated media files).
- Click media thumbnails to open the global viewer. Use left/right arrow keys or on-screen chevrons to navigate.
- Play voice messages inline (Telegram-style waveform UI).

Developer notes
- Built with React + Vite, Tailwind CSS, and highlight.js for syntax highlighting.
- Parser logic is in `src/utils/parser.js` and returns message objects used by the renderer.
- If you run into dev-server errors, try removing `node_modules` and re-running `npm install`.

Contributing
- PRs are welcome. Please follow existing code style and run the dev server locally to test changes.

License
- MIT
