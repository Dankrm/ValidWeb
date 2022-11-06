import * as vscode from 'vscode';
import { SidebarRuleTypesProvider } from './SidebarRuleTypesProvider';
import { SidebarRulesProvider } from './SidebarRulesProvider';
import { DiagnosticCodeActionProvider } from './lib/DiagnosticCodeActionProvider';
import { Diagnostic } from './lib/Diagnostic';


export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(Diagnostic.htmlDiagnostics);
	Diagnostic.getInstance().subscribeToDocumentChanges(context);

	const provider = new SidebarRuleTypesProvider(context);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(SidebarRuleTypesProvider.viewType, provider)
	);	
	
	const providerRules = new SidebarRulesProvider(context);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(SidebarRulesProvider.viewType, providerRules)
	);

	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider('html', new DiagnosticCodeActionProvider(), {
			providedCodeActionKinds: DiagnosticCodeActionProvider.providedCodeActionKinds
		})
	);

}

export function deactivate() {}
