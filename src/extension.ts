import * as vscode from 'vscode';
import { ControllerIDE } from './ControllerIDE';
import { HtmlCodeActionProvider } from './HtmlCodeActionProvider';


export function activate(context: vscode.ExtensionContext) {
	const provider = new ControllerIDE(context);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(ControllerIDE.viewType, provider)
	);

	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider('validweb', new HtmlCodeActionProvider(), {
			providedCodeActionKinds: HtmlCodeActionProvider.providedCodeActionKinds
		})
	);

}

export function deactivate() {}
