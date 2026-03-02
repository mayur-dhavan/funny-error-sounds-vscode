import * as vscode from 'vscode';
import { SoundPlayer } from './soundPlayer';

let soundPlayer: SoundPlayer;
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
    console.log('[FunnyErrorSounds] Extension activating...');

    // Initialize the sound player
    soundPlayer = new SoundPlayer(context.extensionPath);

    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'funnyErrorSounds.toggle';
    updateStatusBar();
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // ─── Listen for terminal command failures ───────────────────────
    // This API fires when a shell command finishes executing in the terminal.
    // We check if the exit code is non-zero (i.e., the command failed).
    const terminalListener = vscode.window.onDidEndTerminalShellExecution(event => {
        const config = vscode.workspace.getConfiguration('funnyErrorSounds');
        const enabled = config.get<boolean>('enabled', true);

        if (!enabled) {
            return;
        }

        if (event.exitCode !== undefined && event.exitCode !== 0) {
            const duration = config.get<number>('soundDuration', 5);
            const showNotification = config.get<boolean>('showNotification', true);
            const soundMode = config.get<string>('soundMode', 'random');
            const selectedSound = config.get<string>('selectedSound', '');

            let soundName: string | null;
            if (soundMode === 'custom') {
                const customPath = context.globalState.get<string>('customSoundPath', '');
                if (customPath) {
                    soundName = soundPlayer.playFileFromPath(customPath, duration);
                } else {
                    vscode.window.showWarningMessage(
                        'No custom sound file set. Use "Funny Sounds: Upload Custom Sound File" to pick one.'
                    );
                    soundName = null;
                }
            } else if (soundMode === 'selected' && selectedSound) {
                soundName = soundPlayer.playSpecificSound(selectedSound, duration);
            } else {
                soundName = soundPlayer.playRandomSound(duration);
            }

            if (soundName && showNotification) {
                vscode.window.showInformationMessage(
                    `🔊 ${soundName}`,
                    'Stop Sound'
                ).then(selection => {
                    if (selection === 'Stop Sound') {
                        soundPlayer.stop();
                    }
                });
            }
        }
    });
    context.subscriptions.push(terminalListener);

    // ─── Commands ───────────────────────────────────────────────────

    // Test sound command
    const testCmd = vscode.commands.registerCommand('funnyErrorSounds.testSound', () => {
        const config = vscode.workspace.getConfiguration('funnyErrorSounds');
        const duration = config.get<number>('soundDuration', 5);

        const soundName = soundPlayer.playRandomSound(duration);
        if (soundName) {
            vscode.window.showInformationMessage(`🔊 Test: ${soundName}`, 'Stop Sound')
                .then(selection => {
                    if (selection === 'Stop Sound') {
                        soundPlayer.stop();
                    }
                });
        } else {
            vscode.window.showWarningMessage('No sound files found in the sounds/ folder!');
        }
    });
    context.subscriptions.push(testCmd);

    // Choose sound command — shows a Quick Pick with all available sounds
    const chooseCmd = vscode.commands.registerCommand('funnyErrorSounds.chooseSound', async () => {
        const sounds = soundPlayer.getSoundList();
        if (sounds.length === 0) {
            vscode.window.showWarningMessage('No sound files found in the sounds/ folder!');
            return;
        }

        const config = vscode.workspace.getConfiguration('funnyErrorSounds');
        const currentSelected = config.get<string>('selectedSound', '');
        const duration = config.get<number>('soundDuration', 5);

        // Build Quick Pick items
        const items: vscode.QuickPickItem[] = [
            {
                label: '$(shuffle) Random',
                description: 'Play a different sound each time',
                detail: config.get<string>('soundMode') === 'random' ? '$(check) Currently active' : undefined
            },
            { label: '', kind: vscode.QuickPickItemKind.Separator },
            ...sounds.map(s => ({
                label: `$(play) ${s.label}`,
                description: s.filename,
                detail: s.filename === currentSelected ? '$(check) Currently selected' : undefined
            }))
        ];

        const pick = vscode.window.createQuickPick();
        pick.items = items;
        pick.title = '🎵 Choose Your Error Sound';
        pick.placeholder = 'Search sounds... (select to preview, press Enter to confirm)';
        pick.matchOnDescription = true;

        // Preview sound on highlight
        pick.onDidChangeActive(activeItems => {
            if (activeItems.length > 0) {
                const item = activeItems[0];
                if (item.description && item.description !== 'Play a different sound each time') {
                    soundPlayer.playSpecificSound(item.description, 3);
                }
            }
        });

        pick.onDidAccept(() => {
            const selected = pick.selectedItems[0];
            if (!selected) {
                pick.dispose();
                return;
            }

            soundPlayer.stop();

            if (selected.description === 'Play a different sound each time') {
                // User chose Random mode
                config.update('soundMode', 'random', vscode.ConfigurationTarget.Global);
                config.update('selectedSound', '', vscode.ConfigurationTarget.Global);
                vscode.window.showInformationMessage('🎲 Sound mode: Random — a different sound on every error!');
            } else {
                // User chose a specific sound
                const filename = selected.description!;
                config.update('soundMode', 'selected', vscode.ConfigurationTarget.Global);
                config.update('selectedSound', filename, vscode.ConfigurationTarget.Global);
                const niceName = selected.label.replace('$(play) ', '');
                vscode.window.showInformationMessage(`🎵 Error sound set to: ${niceName}`);
            }

            pick.dispose();
        });

        pick.onDidHide(() => {
            soundPlayer.stop();
            pick.dispose();
        });

        pick.show();
    });
    context.subscriptions.push(chooseCmd);

    // Upload custom sound command — opens a file picker and saves the path
    const uploadCmd = vscode.commands.registerCommand('funnyErrorSounds.uploadCustomSound', async () => {
        const uris = await vscode.window.showOpenDialog({
            canSelectMany: false,
            openLabel: 'Use This Sound',
            filters: {
                'Audio Files': ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'wma', 'flac']
            },
            title: 'Select Your Custom Error Sound'
        });

        if (!uris || uris.length === 0) {
            return;
        }

        const filePath = uris[0].fsPath;
        const config = vscode.workspace.getConfiguration('funnyErrorSounds');
        // Store the path in globalState — no package.json registration required
        await context.globalState.update('customSoundPath', filePath);
        await config.update('soundMode', 'custom', vscode.ConfigurationTarget.Global);

        const duration = config.get<number>('soundDuration', 5);
        const soundName = soundPlayer.playFileFromPath(filePath, duration);

        vscode.window.showInformationMessage(
            `📂 Custom sound set: ${soundName ?? filePath}`,
            'Stop Sound'
        ).then(selection => {
            if (selection === 'Stop Sound') {
                soundPlayer.stop();
            }
        });
    });
    context.subscriptions.push(uploadCmd);

    // Toggle on/off command
    const toggleCmd = vscode.commands.registerCommand('funnyErrorSounds.toggle', () => {
        const config = vscode.workspace.getConfiguration('funnyErrorSounds');
        const enabled = config.get<boolean>('enabled', true);
        config.update('enabled', !enabled, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(
            `Funny Error Sounds: ${!enabled ? '🔊 Enabled' : '🔇 Disabled'}`
        );
    });
    context.subscriptions.push(toggleCmd);

    // ─── Configuration change listener ──────────────────────────────
    const configListener = vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('funnyErrorSounds')) {
            updateStatusBar();
        }
    });
    context.subscriptions.push(configListener);

    // Log activation
    const count = soundPlayer.getSoundCount();
    console.log(`[FunnyErrorSounds] Activated with ${count} sounds loaded!`);
    vscode.window.showInformationMessage(
        `🔊 Funny Error Sounds activated! ${count} sounds loaded. Mess up a command to hear one!`
    );
}

function updateStatusBar(): void {
    const config = vscode.workspace.getConfiguration('funnyErrorSounds');
    const enabled = config.get<boolean>('enabled', true);

    if (enabled) {
        statusBarItem.text = '$(unmute) Funny Sounds';
        statusBarItem.tooltip = 'Funny Error Sounds: ON (click to toggle)';
    } else {
        statusBarItem.text = '$(mute) Funny Sounds';
        statusBarItem.tooltip = 'Funny Error Sounds: OFF (click to toggle)';
    }
}

export function deactivate() {
    if (soundPlayer) {
        soundPlayer.dispose();
    }
}
