
import * as vscode from 'vscode';
import { Validator } from './lib/Validator';
import { Diagnostic } from './lib/Diagnostic';

export class ControllerIDE implements vscode.WebviewViewProvider {

	public static readonly viewType = 'validweb-sidebar';

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
			  case "onInfo": {
				if (!data.value) {
				  return;
				}
				vscode.window.showInformationMessage(data.value);
				break;
			  }
			  case "onError": {
				if (!data.value) {
				  return;
				}
				vscode.window.showErrorMessage(data.value);
				break;
			  }
			  case "validateApi": {
				const validator = Validator.getInstance();
				const editor = vscode.window.activeTextEditor;
				if (editor) {
					let document = editor.document;
					const documentText = document.getText();
					validator.requestDataToThreatment(documentText);
				}

				const htmlDiagnostics = vscode.languages.createDiagnosticCollection("validweb");
				this.extensionContext.subscriptions.push(htmlDiagnostics);
				Diagnostic.getInstance().subscribeToDocumentChanges(this.extensionContext, htmlDiagnostics);

				break;
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
