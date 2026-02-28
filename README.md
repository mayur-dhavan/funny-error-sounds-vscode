# 🔊 Funny Error Sounds — VS Code Extension

> **When your terminal command fails, a hilarious sound plays!**

Tired of boring error messages? This extension spices up your VS Code terminal by playing random funny sounds every time a command fails (non-zero exit code). Choose from 22+ desi meme sounds or pick your own favorite!

## Features

- 🎵 **22+ funny sound clips** included (desi memes, CID, and more!)
- 🖥️ **Terminal error detection** — automatically detects when a command fails via shell integration
- 🔊 **Cross-platform audio** — works on Windows, macOS, and Linux
- 🎛️ **Choose your sound** — pick a specific sound or let it play randomly
- ⚙️ **Configurable** — toggle on/off, adjust duration, control notifications
- 📊 **Status bar control** — quickly toggle sounds from the status bar
- 🎧 **Live preview** — hear sounds as you browse through them in the picker

## How It Works

1. You run a command in the VS Code integrated terminal
2. The command fails (returns a non-zero exit code)
3. A funny sound plays! 🔊😂

## Commands

| Command | Description |
|---------|-------------|
| `Funny Sounds: Play Test Sound 🔊` | Play a random sound to test |
| `Funny Sounds: Toggle On/Off` | Enable or disable sounds |
| `Funny Sounds: Choose Sound Effect 🎵` | Browse & pick your favorite error sound |

## 🎵 How to Change Your Error Sound

You can choose which sound plays when a terminal command fails:

### Step 1 — Open the Command Palette

| Platform | Shortcut |
|----------|----------|
| **Windows / Linux** | `Ctrl + Shift + P` |
| **macOS** | `Cmd + Shift + P` |

### Step 2 — Search for the command

Type **"Choose Sound"** in the Command Palette and select:

```
Funny Sounds: Choose Sound Effect 🎵
```

### Step 3 — Pick your sound

A list of all available sounds will appear:

- **Scroll through sounds** — each sound **previews automatically** as you highlight it
- **Select a specific sound** — press `Enter` to set it as your permanent error sound
- **Choose "Random"** — to go back to a different sound on every error

> 💡 **Tip:** You can also change the sound mode directly in VS Code Settings. Open Settings (`Ctrl + ,` / `Cmd + ,`), search for **"Funny Error Sounds"**, and set `Sound Mode` to `random` or `selected`.

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `funnyErrorSounds.enabled` | `true` | Enable or disable funny error sounds |
| `funnyErrorSounds.soundDuration` | `5` | How many seconds to play each sound clip |
| `funnyErrorSounds.showNotification` | `true` | Show a notification with the sound name |
| `funnyErrorSounds.soundMode` | `random` | `random` = different sound each time, `selected` = always play chosen sound |
| `funnyErrorSounds.selectedSound` | `""` | Filename of the chosen sound (used when mode is `selected`) |

## Requirements

- **VS Code 1.93+** (for terminal shell integration API)
- **Windows**: No extra software needed (uses built-in PowerShell MediaPlayer)
- **macOS**: No extra software needed (uses built-in `afplay`)
- **Linux**: Install `mpv` or `mpg123` for MP3 playback

## Adding Your Own Sounds

1. Drop any `.mp3`, `.wav`, `.ogg`, or `.m4a` file into the `sounds/` folder
2. Reload VS Code (`Ctrl + Shift + P` → "Reload Window")
3. Open **Choose Sound Effect** to see your new sound in the list!

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

## Author

**Mayur Dhavan**
- GitHub: [@mayur-dhavan](https://github.com/mayur-dhavan)
- Portfolio: [mayur-dhavan.netlify.app](https://mayur-dhavan.netlify.app/)

## License

MIT

---

**Made with ❤️ and a lot of terminal errors** by [Mayur Dhavan](https://github.com/mayur-dhavan)
