
import * as vscode from 'vscode';

export class TreeViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
	onDidChangeTreeData?: vscode.Event<void | vscode.TreeItem | vscode.TreeItem[] | null | undefined> | undefined;

	getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
		throw new Error('Method not implemented.');
	}

	getChildren(element?: vscode.TreeItem | undefined): vscode.ProviderResult<vscode.TreeItem[]> {
		throw new Error('Method not implemented.');
	}

	getParent?(element: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem> {
		throw new Error('Method not implemented.');
	}

	resolveTreeItem?(item: vscode.TreeItem, element: vscode.TreeItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TreeItem> {
		throw new Error('Method not implemented.');
	}
}
