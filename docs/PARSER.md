Parser overview
===============

Location: `src/utils/parser.js`

Purpose
- Convert Telegram HTML export message nodes into structured message objects used by the React UI.

Message object shape
- `id` (string): DOM id for the message (e.g., `message12345`).
- `type` (string): `message` | `service`.
- `from` (string): sender name.
- `time` (string): message timestamp text.
- `text` (string): plain-text content.
- `formattedHTML` (string): innerHTML of the message text element after converting spoilers and other inline markup.
- `replyTo` (object|null): information about a reply/quote. Possible fields:
  - `text` (string): raw reply preview text (default fallback).
  - `isAnotherChat` (boolean): true when the reply references another chat.
  - `messageId` (number|null): referenced message id (if link points to a message in the same export).
  - `quotedMessage` (object|null): full message object (when available) — populated post-parse by the app to enable preview rendering of quoted messages.
- `media` (array): array of media objects parsed from the message. Each media item has a `type` and type-specific fields:
  - `photo`: `{ type: 'photo', url, thumb }`
  - `video`: `{ type: 'video', url, thumb, duration }`
  - `round_video`: `{ type: 'round_video', url, thumb, duration }` (plays inline in chat)
  - `gif`: `{ type: 'gif', url, thumb }`
  - `animation`: `{ type: 'animation', url }`
  - `sticker` / `animated_sticker` — sticker variants
  - `voice`: `{ type: 'voice', url, duration }` — voice notes
  - `file`: `{ type: 'file', url, title, size }`
  - `location`, `contact`, `call` — other metadata types

File resolution
- The parser uses `src/utils/fileHandler.js` (helper) to find actual files in the selected folder by converting relative paths from the export into file lookups.

Quoted messages
- After parsing all messages the app performs a post-processing step to link replies with the actual quoted message when `messageId` is present and the referenced message exists in the parsed list. The full quoted message is attached under `replyTo.quotedMessage` for rendering in the UI.

Extending the parser
- To add additional media types, update the detection logic near the top of `parseMessage` to query the message node for the relevant selectors and normalize the returned object shape.

Debugging tips
- When files are missing check the browser console for 404 or missing-file logs originating from `fileHandler` lookups.
- For parsing issues, open `messages.html` in the browser and inspect the DOM structure to align selectors used by the parser.
