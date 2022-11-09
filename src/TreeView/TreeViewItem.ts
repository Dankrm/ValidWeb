import * as vscode from 'vscode';

export class TreeViewItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public children?: TreeViewItem[]
      ) {
        super(label, collapsibleState);
        this.children = children;
      }

    
}
