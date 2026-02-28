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

            const soundName = soundPlayer.playRandomSound(duration);

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
