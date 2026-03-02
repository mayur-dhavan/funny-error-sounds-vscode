# 🔊 Funny Error Sounds — VS Code Extension

> **When your terminal command fails, a hilarious sound plays!**

Tired of boring error messages? This extension spices up your VS Code terminal by playing random funny sounds every time a command fails (non-zero exit code). Choose from 22+ desi meme sounds, pick your own favorite — or **upload your own audio file**!

## Features

- 🎵 **22+ funny sound clips** included (desi memes, CID, and more!)
- 🖥️ **Terminal error detection** — automatically detects when a command fails via shell integration
- 🔊 **Cross-platform audio** — works on Windows, macOS, and Linux
- 🎤 **Upload your own sound** — use any `.mp3`, `.wav`, `.ogg`, `.m4a`, or other audio file from your computer
- 🎧 **Choose your sound** — pick a specific built-in sound or let it play randomly
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
| `Funny Sounds: Choose Sound Effect 🎵` | Browse & pick your favorite built-in error sound |
| `Funny Sounds: Upload Custom Sound File 📂` | Pick any audio file from your computer as the error sound |

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

> 💡 **Tip:** You can also change the sound mode directly in VS Code Settings. Open Settings (`Ctrl + ,` / `Cmd + ,`), search for **"Funny Error Sounds"**, and set `Sound Mode` to `random`, `selected`, or `custom`.

## 📂 Upload Your Own Sound

You can use **any audio file on your computer** as the error sound:

### Step 1 — Open the Command Palette and run the upload command

```
Funny Sounds: Upload Custom Sound File 📂
```

### Step 2 — Pick your file

A file browser will open. Select any supported audio file (`.mp3`, `.wav`, `.ogg`, `.m4a`, `.aac`, `.wma`, `.flac`) from anywhere on your computer. The extension will:

1. Save the file path to your settings
2. Automatically switch sound mode to **Custom**
3. Play a preview of your file immediately

### Switching back to built-in sounds

Open **Choose Sound Effect** (`Funny Sounds: Choose Sound Effect 🎵`) and select any built-in sound or **Random** to switch back.

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `funnyErrorSounds.enabled` | `true` | Enable or disable funny error sounds |
| `funnyErrorSounds.soundDuration` | `5` | How many seconds to play each sound clip |
| `funnyErrorSounds.showNotification` | `true` | Show a notification with the sound name |
| `funnyErrorSounds.soundMode` | `random` | `random` = different sound each time, `selected` = always play chosen built-in sound, `custom` = use your own file |
| `funnyErrorSounds.selectedSound` | `""` | Filename of the chosen built-in sound (used when mode is `selected`) |
| `funnyErrorSounds.customSoundPath` | `""` | Absolute path to your own audio file (set automatically by the Upload command) |

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

---

## ❤️ Support the Project

If you enjoy this extension, consider sponsoring its development!

[**💖 Sponsor @mayur-dhavan on GitHub**](https://github.com/sponsors/mayur-dhavan)

## Author

**Mayur Dhavan**
- GitHub: [@mayur-dhavan](https://github.com/mayur-dhavan)
- Portfolio: [mayur-dhavan.netlify.app](https://mayur-dhavan.netlify.app/)

## License

MIT

---

**Made with ❤️ and a lot of terminal errors** by [Mayur Dhavan](https://github.com/mayur-dhavan)
