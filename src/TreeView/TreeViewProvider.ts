
import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';
import { TreeViewItem } from './TreeViewItem';

export class TreeViewProvider implements vscode.TreeDataProvider<TreeViewItem> {
	constructor(private workspaceRoot: string | undefined) {}
	private _onDidChangeTreeData: vscode.EventEmitter<TreeViewItem | undefined | null | void> = new vscode.EventEmitter<TreeViewItem | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<TreeViewItem | undefined | null | void> = this._onDidChangeTreeData.event;
  
	refresh(): void {
	  this._onDidChangeTreeData.fire();
	}

	async getChildren(element?: TreeViewItem | undefined): Promise<TreeViewItem[]> {
		if (!this.workspaceRoot) {
			vscode.window.showErrorMessage('Sem diretório definido');
			return Promise.resolve([]);
		}

		if (!element) {
			return Promise.resolve(
				this.createTreeView(this.workspaceRoot)
			);
		} else {
			return Promise.resolve(
				element.children ?? []
			);
		}

	}

	getTreeItem(element: TreeViewItem): vscode.TreeItem {
		return element;
	}

	private async createTreeView(localPath: string): Promise<TreeViewItem[]> {
		const treeViewItems: TreeViewItem[] = [];
		try {
			if (await this.pathExists(localPath)) {
				const response = await this.recursivePath(localPath);
				if (response) {
					treeViewItems.push(response);
				}
			}
		} catch (err) {
			console.error(err);
		}
		return treeViewItems;
	}

	private async recursivePath(localPath: string): Promise<TreeViewItem | null> {
		let treeItem: TreeViewItem | null = null;
		try {
			if (await this.pathExists(localPath)) {
				if ((await fs.lstat(localPath)).isDirectory()) {
					const dirArtefacts = await fs.readdir(localPath);
					const treeViewItems: TreeViewItem[] = [];

					for (let dirArtefact of dirArtefacts) {
						if (!this.isHiddenPath(dirArtefact)) {
							const response = await this.recursivePath(path.join(localPath, dirArtefact));
							if (response) {
								treeViewItems.push(response);
							}
						}
					}

					treeViewItems.sort((treeItemX, treeItemY) => {
						if (!treeItemX.children?.length) {
							return +1;
						} else if (!treeItemY.children?.length) {
							return -1;
						} else {
							return 0;
						}
					});

					if (treeViewItems.length) {
						treeItem = new TreeViewItem(path.basename(localPath), vscode.TreeItemCollapsibleState.Collapsed, treeViewItems);
					}
				} else {
					if (path.extname(localPath) === '.html') {
						treeItem = new TreeViewItem(path.basename(localPath), vscode.TreeItemCollapsibleState.None);
					}
				}
			}
		} catch (err) {
			console.log(err);
		}
		return treeItem;
	}

	private async pathExists(p: string): Promise<boolean> {
		try {
		  await fs.access(p);
		} catch (err) {
		  return false;
		}
		return true;
	}

	private isHiddenPath(path: string) {
		return (/(^|\/)\.[^\/\.]/g).test(path);
	};
}
