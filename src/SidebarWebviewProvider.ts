
import * as vscode from 'vscode';

import { PrismaClient } from '@prisma/client';
import { Diagnostic } from './lib/Diagnostic';
const prisma = new PrismaClient();

export class SidebarWebviewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'validweb-sidebar-webview';

	private _view?: vscode.WebviewView;

	constructor(
		private readonly extensionContext: vscode.ExtensionContext,
	) { }

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,

			localResourceRoots: [
				this.extensionContext.extensionUri
			]
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		webviewView.webview.onDidReceiveMessage(async (data) => {
			switch (data.type) {
				case "loadRuleTypes": {
					const ruleTypes = await prisma.ruleType.findMany();
					webviewView.webview.postMessage(
						{
							type: "loadedRuleTypes",
							ruleTypes: ruleTypes
						});

					break;
				}
				case "changeVisibilityRuleTypes": {
					await prisma.ruleType.update({
						where: {
							id: Number(data.id)
						},
						data: {
							visible: data.visible
						}
					});
					Diagnostic.getInstance().clearDiagnostics();
					vscode.window.activeTextEditor?.document && 
						Diagnostic.getInstance().refreshDiagnostics(vscode.window.activeTextEditor.document);
				}
			}
		  });
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		
		const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionContext.extensionUri, 'media', 'reset.css'));
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this.extensionContext.extensionUri, 'media', 'vscode.css'));
		
		const reactAppPathOnDisk = webview.asWebviewUri(
			vscode.Uri.joinPath(this.extensionContext.extensionUri, 'out', 'build.js')
		);

		return `<!DOCTYPE html>
			<html lang="pt-BR">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy"
              		content="default-src 'none';
                      img-src https:;
                      script-src 'unsafe-eval' 'unsafe-inline' vscode-resource:;
                      style-src vscode-resource: 'unsafe-inline';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<title>ValidWeb</title>
			</head>
			<body>
				<div id="root"></div>
				<script src="${reactAppPathOnDisk}"></script>
			</body>
			</html>`;
	}
}
