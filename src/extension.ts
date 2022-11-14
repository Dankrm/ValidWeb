import * as vscode from 'vscode';
import { SidebarRuleTypesProvider } from './SidebarRuleTypesProvider';
import { SidebarRulesProvider } from './SidebarRulesProvider';
import { DiagnosticCodeActionProvider } from './lib/DiagnosticCodeActionProvider';
import { Diagnostic } from './lib/Diagnostic';
import { TreeViewProvider } from './TreeView/TreeViewProvider';
import { Report } from './lib/Report';


export async function activate(context: vscode.ExtensionContext) {
	await Diagnostic.getInstance().subscribeToDocumentChanges(context);

	const provider = new SidebarRuleTypesProvider(context);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(SidebarRuleTypesProvider.viewType, provider)
	);	
	
	const providerRules = new SidebarRulesProvider(context);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(SidebarRulesProvider.viewType, providerRules)
	);

	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider({ scheme: 'file', language: 'html' }, new DiagnosticCodeActionProvider(), {
			providedCodeActionKinds: DiagnosticCodeActionProvider.providedCodeActionKinds
		})
	);

	const filesTreeView = new TreeViewProvider((vscode.workspace.workspaceFolders) 
	? vscode.workspace.workspaceFolders[0].uri.fsPath 
	: undefined);

	context.subscriptions.push(
		vscode.window.registerTreeDataProvider('validweb-sidebar-tree', 
			filesTreeView
		)
	);

	vscode.commands.registerCommand('validweb.refreshFiles', () => {
		filesTreeView.refresh();
	});

	const report = new Report();
	vscode.commands.registerCommand('validweb.generateFileReport', async (localContext) => {
		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			cancellable: true
		}, async (progress) => {
			progress.report({
				message: `Carregando PDF ...`,
			});
			await report.generateForFile(localContext.resourceUri);
		});
	});

	vscode.commands.registerCommand('validweb.generateFolderReport', async (localContext) => {
		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			cancellable: true
		}, async (progress) => {
			progress.report({
				message: `Carregando PDF ...`,
			});
			await report.generateForFolder(localContext);
		});
	});
	
}

export function deactivate() {}
