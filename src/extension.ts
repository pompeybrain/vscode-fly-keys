// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {
  window,
  commands,
  Disposable,
  ExtensionContext,
  StatusBarAlignment,
  StatusBarItem,
  TextDocument
} from 'vscode';

const globalState = {
  commandActive: true,
  statusBarItem: window.createStatusBarItem(StatusBarAlignment.Right)
};

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand('extension.flyKeys.activeCommandMode', () => {
      toggleCommandMode(true);
    }),
    commands.registerCommand('extension.flyKeys.deactiveCommandMode', () => {
      toggleCommandMode(false);
    }),
    commands.registerCommand('extension.flyKeys.commentLine', () => {
      vscode.commands.executeCommand('editor.action.commentLine');
    }),
    commands.registerCommand('extension.flyKeys.cut', () => {
      vscode.commands.executeCommand('editor.action.clipboardCutAction');
    }),
    commands.registerCommand('extension.flyKeys.copy', () => {
      vscode.commands.executeCommand('editor.action.clipboardCopyAction');
    }),
    commands.registerCommand('extension.flyKeys.paste', () => {
      vscode.commands.executeCommand('editor.action.clipboardPasteAction');
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

  globalState.statusBarItem.text = active
    ? 'FlyKeys: $(lock)'
    : 'FlyKeys: $(pencil)';
  globalState.statusBarItem.show();
}
