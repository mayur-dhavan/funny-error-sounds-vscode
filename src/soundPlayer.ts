import * as cp from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

export class SoundPlayer {
    private soundFiles: string[] = [];
    private currentProcess: cp.ChildProcess | null = null;
    private soundsDir: string;

    constructor(extensionPath: string) {
        this.soundsDir = path.join(extensionPath, 'sounds');
        this.loadSoundFiles();
    }

    /**
     * Scan the sounds directory and load all audio file paths.
     */
    private loadSoundFiles(): void {
        try {
            if (!fs.existsSync(this.soundsDir)) {
                console.warn('[FunnyErrorSounds] Sounds directory not found:', this.soundsDir);
                return;
            }

            const supportedExtensions = ['.mp3', '.wav', '.ogg', '.wma', '.m4a', '.aac'];
            this.soundFiles = fs.readdirSync(this.soundsDir)
                .filter(file => supportedExtensions.includes(path.extname(file).toLowerCase()))
                .map(file => path.join(this.soundsDir, file));

            console.log(`[FunnyErrorSounds] Loaded ${this.soundFiles.length} sound files`);
        } catch (err) {
            console.error('[FunnyErrorSounds] Error loading sound files:', err);
        }
    }

    /**
     * Get total number of available sounds.
     */
    public getSoundCount(): number {
        return this.soundFiles.length;
    }

    /**
     * Get a list of all available sound names (human-readable) with their filenames.
     */
    public getSoundList(): { label: string; filename: string }[] {
        return this.soundFiles.map(filePath => {
            const filename = path.basename(filePath);
            const label = path.basename(filePath, path.extname(filePath))
                .replace(/-/g, ' ')
                .replace(/\b\w/g, c => c.toUpperCase());
            return { label, filename };
        });
    }

    /**
     * Play a specific sound by filename.
     * Returns the human-readable sound name, or null if not found.
     */
    public playSpecificSound(filename: string, durationSeconds: number = 5): string | null {
        const soundPath = this.soundFiles.find(
            f => path.basename(f) === filename
        );

        if (!soundPath) {
            console.warn(`[FunnyErrorSounds] Sound not found: ${filename}`);
            return null;
        }

        this.stop();

        const soundName = path.basename(soundPath, path.extname(soundPath))
            .replace(/-/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());

        this.playSoundFile(soundPath, durationSeconds);
        return soundName;
    }

    /**
     * Play a random sound from the collection.
     * Returns the filename of the sound being played.
     */
    public playRandomSound(durationSeconds: number = 5): string | null {
        if (this.soundFiles.length === 0) {
            console.warn('[FunnyErrorSounds] No sound files available');
            return null;
        }

        // Stop any currently playing sound
        this.stop();

        // Pick a random sound
        const randomIndex = Math.floor(Math.random() * this.soundFiles.length);
        const soundPath = this.soundFiles[randomIndex];
        const soundName = path.basename(soundPath, path.extname(soundPath))
            .replace(/-/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());

        this.playSoundFile(soundPath, durationSeconds);

        return soundName;
    }

    /**
     * Play a sound from any absolute file path on disk.
     * Returns the human-readable name, or null if file does not exist.
     */
    public playFileFromPath(filePath: string, durationSeconds: number = 5): string | null {
        if (!fs.existsSync(filePath)) {
            console.warn(`[FunnyErrorSounds] Custom sound file not found: ${filePath}`);
            return null;
        }

        this.stop();
        const soundName = path.basename(filePath, path.extname(filePath))
            .replace(/-/g, ' ')
            .replace(/\w/g, c => c.toUpperCase());
        this.playSoundFile(filePath, durationSeconds);
        return soundName;
    }

    /**
     * Play a specific sound file using platform-appropriate player.
     */
    private playSoundFile(filePath: string, durationSeconds: number): void {
        const platform = os.platform();
        const escapedPath = filePath.replace(/'/g, "''");

        try {
            if (platform === 'win32') {
                // Use PowerShell with WPF MediaPlayer (supports MP3, WAV, WMA, etc.)
                const psScript = `
                    Add-Type -AssemblyName PresentationCore
                    $player = New-Object System.Windows.Media.MediaPlayer
                    $player.Open([Uri]"${escapedPath}")
                    $player.Play()
                    Start-Sleep -Seconds ${durationSeconds}
                    $player.Stop()
                    $player.Close()
                `.trim();

                this.currentProcess = cp.spawn('powershell', [
                    '-NoProfile',
                    '-NonInteractive',
                    '-WindowStyle', 'Hidden',
                    '-Command', psScript
                ], {
                    windowsHide: true,
                    stdio: 'ignore'
                });

            } else if (platform === 'darwin') {
                // macOS: use afplay (built-in, supports MP3, WAV, AAC, etc.)
                this.currentProcess = cp.spawn('afplay', [
                    '-t', String(durationSeconds),
                    filePath
                ], {
                    stdio: 'ignore'
                });

            } else {
                // Linux: try mpv first, then paplay/aplay for WAV, mpg123 for MP3
                const ext = path.extname(filePath).toLowerCase();
                if (ext === '.wav') {
                    this.currentProcess = cp.spawn('aplay', [filePath], {
                        stdio: 'ignore'
                    });
                } else {
                    // Try mpv (most versatile), fall back to mpg123
                    this.currentProcess = cp.spawn('mpv', [
                        '--no-video',
                        `--length=${durationSeconds}`,
                        filePath
                    ], {
                        stdio: 'ignore'
                    });

                    this.currentProcess.on('error', () => {
                        // mpv not available, try mpg123
                        this.currentProcess = cp.spawn('mpg123', [filePath], {
                            stdio: 'ignore'
                        });
                    });
                }
            }

            // Auto-cleanup when process ends
            if (this.currentProcess) {
                this.currentProcess.on('exit', () => {
                    this.currentProcess = null;
                });
                this.currentProcess.on('error', (err) => {
                    console.error('[FunnyErrorSounds] Error playing sound:', err.message);
                    this.currentProcess = null;
                });
            }

        } catch (err) {
            console.error('[FunnyErrorSounds] Failed to play sound:', err);
        }
    }

    /**
     * Stop the currently playing sound.
     */
    public stop(): void {
        if (this.currentProcess) {
            try {
                this.currentProcess.kill();
            } catch {
                // Process may have already exited
            }
            this.currentProcess = null;
        }
    }

    /**
     * Reload sound files from the sounds directory.
     */
    public reload(): void {
        this.loadSoundFiles();
    }

    /**
     * Clean up resources.
     */
    public dispose(): void {
        this.stop();
    }
}
