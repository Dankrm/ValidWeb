import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {

	const provider = new SidebarProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(SidebarProvider.viewType, provider)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('validweb.teste', () => {
			
		})
	);

}

export function deactivate() {}
