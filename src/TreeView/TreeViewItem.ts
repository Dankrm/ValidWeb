import * as vscode from 'vscode';
import { Diagnostic } from '../lib/Diagnostic';

export class TreeViewItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly localPath: string,
    public children?: TreeViewItem[],
    public valid?: boolean,
  ) {

    super(label, collapsibleState);
    this.children = children;
    this.resourceUri = vscode.Uri.file(localPath);

    if (this.children) {
      let isFolderValid = true;
      for (let child of this.children) {
        if (child.valid === false) {
          isFolderValid = false;
        }
      }

      this.valid = isFolderValid;

      if (isFolderValid) {
        this.iconPath = new vscode.ThemeIcon('folder-active');
      } else {
        this.iconPath = new vscode.ThemeIcon('folder');
      }
    } else {
      vscode.workspace.openTextDocument(localPath).then(async (doc) => {
        const diagnostics = await Diagnostic.getInstance().refreshDiagnostics(doc);
        if (diagnostics && diagnostics.length > 0) {
          this.valid = false;
          this.iconPath = new vscode.ThemeIcon('error');
        } else {
          this.valid = true;
          this.iconPath = new vscode.ThemeIcon('pass-filled');
        }
      });
      this.command = {
        title: "Acessar Arquivo",
        command: "vscode.open",
        arguments: [this.resourceUri]
      };
    }
  }
}
