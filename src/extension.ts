import * as vscode from 'vscode';
import { SidebarRuleTypesProvider } from './SidebarRuleTypesProvider';
import { SidebarRulesProvider } from './SidebarRulesProvider';
import { HtmlCodeActionProvider } from './HtmlCodeActionProvider';
import { Diagnostic } from './lib/Diagnostic';


export function activate(context: vscode.ExtensionContext) {

	const provider = new SidebarRuleTypesProvider(context);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(SidebarRuleTypesProvider.viewType, provider)
	);	
	
	const providerRules = new SidebarRulesProvider(context);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(SidebarRulesProvider.viewType, providerRules)
	);

	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider('validweb', new HtmlCodeActionProvider(), {
			providedCodeActionKinds: HtmlCodeActionProvider.providedCodeActionKinds
		})
	);

	context.subscriptions.push(Diagnostic.htmlDiagnostics);
	Diagnostic.getInstance().subscribeToDocumentChanges(context);
}

export function deactivate() {}
