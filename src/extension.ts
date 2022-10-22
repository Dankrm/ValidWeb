import * as vscode from 'vscode';
import { SidebarWebviewProvider } from './SidebarWebviewProvider';
import { HtmlCodeActionProvider } from './HtmlCodeActionProvider';
import { Diagnostic } from './lib/Diagnostic';


export function activate(context: vscode.ExtensionContext) {

	const provider = new SidebarWebviewProvider(context);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(SidebarWebviewProvider.viewType, provider)
	);

	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider('validweb', new HtmlCodeActionProvider(), {
			providedCodeActionKinds: HtmlCodeActionProvider.providedCodeActionKinds
		})
	);

	const htmlDiagnostics = vscode.languages.createDiagnosticCollection("validweb");
	context.subscriptions.push(htmlDiagnostics);
	Diagnostic.getInstance().subscribeToDocumentChanges(context, htmlDiagnostics);

}

export function deactivate() {}
