# 🔊 Funny Error Sounds — VS Code Extension

> **When your terminal command fails, a hilarious sound plays!**

Tired of boring error messages? This extension spices up your VS Code terminal by playing random funny sounds every time a command fails (non-zero exit code).

## Features

- 🎵 **22+ funny sound clips** included (desi memes, CID, and more!)
- 🖥️ **Terminal error detection** — automatically detects when a command fails via shell integration
- 🔊 **Cross-platform audio** — works on Windows, macOS, and Linux
- ⚙️ **Configurable** — toggle on/off, adjust duration, control notifications
- 🎛️ **Status bar control** — quickly toggle sounds from the status bar

## How It Works

1. You run a command in the VS Code integrated terminal
2. The command fails (returns a non-zero exit code)
3. A random funny sound plays! 🔊😂

## Commands

| Command | Description |
|---------|-------------|
| `Funny Sounds: Play Test Sound 🔊` | Play a random sound to test |
| `Funny Sounds: Toggle On/Off` | Enable or disable sounds |

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `funnyErrorSounds.enabled` | `true` | Enable or disable funny error sounds |
| `funnyErrorSounds.soundDuration` | `5` | How many seconds to play each sound clip |
| `funnyErrorSounds.showNotification` | `true` | Show a notification with the sound name |

## Requirements

- **VS Code 1.93+** (for terminal shell integration API)
- **Windows**: No extra software needed (uses built-in PowerShell MediaPlayer)
- **macOS**: No extra software needed (uses built-in `afplay`)
- **Linux**: Install `mpv` or `mpg123` for MP3 playback

## Adding Your Own Sounds

Drop any `.mp3`, `.wav`, `.ogg`, or `.m4a` file into the `sounds/` folder and restart the extension!

## Included Sounds

The extension comes with a collection of funny desi meme sounds including clips from CID, famous dialogues, and more. 😄

## Development

```bash
# Install dependencies
npm install

# Compile
npm run compile

# Watch mode
npm run watch
```

Press `F5` in VS Code to launch the Extension Development Host and test.

## License

MIT

---

**Made with ❤️ and a lot of terminal errors**
