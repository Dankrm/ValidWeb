"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarProvider = void 0;
const vscode = require("vscode");
const NuRequest_1 = require("./request/NuRequest");
class SidebarProvider {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
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
    _getHtmlForWebview(webview) {
        const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
        const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
        const reactAppPathOnDisk = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'out', 'build.js'));
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
    async getValidator(html) {
        const nuRequest = new NuRequest_1.NuRequest();
        return await nuRequest.sendRequest(html);
    }
}
exports.SidebarProvider = SidebarProvider;
SidebarProvider.viewType = 'validweb-sidebar';
//# sourceMappingURL=SidebarProvider.js.map