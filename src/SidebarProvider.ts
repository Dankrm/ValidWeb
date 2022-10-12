
import * as vscode from 'vscode';
import { NuRequest } from './request/NuRequest';


export class SidebarProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'validweb-sidebar';

	private _view?: vscode.WebviewView;

	constructor(
		private readonly _extensionUri: vscode.Uri,
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
				this._extensionUri
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
			  case "get-data": {
				vscode.window.showErrorMessage("AAAAAAAAAAAAAAAAAAAAAAA");
			  }
			}
		  });
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		
		const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
		
		const reactAppPathOnDisk = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, 'out', 'build.js')
		);

		let texto;
		this.getValidator('<img>')
			.then((response) => {
				texto = response.data;
			}).catch((error) => {
				debugger;
			});

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
			<script>
				const vscode = acquireVsCodeApi();
				window.onload = function() {
					vscode.postMessage({ command: 'get-data' });
					console.log('Pronto.');
				};
			</script>
			<body>
				<div id="root"></div>
				<script src="${reactAppPathOnDisk}"></script>
			</body>
			</html>`;
	}

	private async getValidator(html: string) {
		const nuRequest = new NuRequest();
		return await nuRequest.sendRequest(html);
	}
}
