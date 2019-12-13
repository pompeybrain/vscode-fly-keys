// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { window, commands, StatusBarAlignment } from 'vscode';

const globalState = {
  commandActive: true,
  statusBarItem: window.createStatusBarItem(StatusBarAlignment.Left)
};

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('type', async args => {
    const editor = window.activeTextEditor;
    let text = args.text;
    if (editor && globalState.commandActive) {
      let command = getCommandConfig(text);
      console.log(
        `type: ${text} -> key: flyKeys.command.${text} -> execute  command: ${command}`
      );
      if (command) {
        await vscode.commands.executeCommand(command);
      }
    } else {
      await vscode.commands.executeCommand('default:type', { text });
    }
  });

  context.subscriptions.push(disposable);

  context.subscriptions.push(
    commands.registerCommand('extension.flyKeys.activeCommandMode', () => {
      toggleCommandMode(true);
    }),
    commands.registerCommand('extension.flyKeys.deactiveCommandMode', () => {
      toggleCommandMode(false);
    }),
    window.onDidChangeActiveTextEditor(() => {
      toggleCommandMode(true);
    })
  );

  toggleCommandMode(true);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function toggleCommandMode(active: boolean) {
  const editor = window.activeTextEditor;
  const visibleEditors = window.visibleTextEditors;

  if (!editor) {
    return;
  }

  vscode.commands.executeCommand(
    'setContext',
    'extension.flyKeys.commandMode',
    active
  );

  globalState.commandActive = active;
  visibleEditors.forEach(e => {
    e.options.cursorStyle = active
      ? vscode.TextEditorCursorStyle.Block
      : vscode.TextEditorCursorStyle.Line;
  });
  globalState.statusBarItem.text = active ? '$(lock)' : '$(pencil)';
  globalState.statusBarItem.show();
}

function getCommandConfig(key: string) {
  if (key === '.') {
    key = 'dot'; // special handler .
  }
  let commandsMap = vscode.workspace.getConfiguration('flyKeys.command');
  let command = commandsMap[key];
  return command;
}
