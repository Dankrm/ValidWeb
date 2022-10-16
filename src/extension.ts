import * as vscode from 'vscode';
import { ControllerIDE } from './ControllerIDE';
import { HtmlCodeActionProvider } from './HtmlCodeActionProvider';

export function activate(context: vscode.ExtensionContext) {

	const provider = new ControllerIDE(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(ControllerIDE.viewType, provider)
	);

	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider('html', new HtmlCodeActionProvider(), {
			providedCodeActionKinds: HtmlCodeActionProvider.providedCodeActionKinds
		})
	);

	const htmlDiagnostics = vscode.languages.createDiagnosticCollection("html");
	context.subscriptions.push(htmlDiagnostics);
}

export function deactivate() {}
