import * as vscode from 'vscode';

export const errorMention = "html_error";

export class Diagnostic {

	refreshDiagnostics(doc: vscode.TextDocument, htmlDiagnostics: vscode.DiagnosticCollection, element: string): void {
		const diagnostics: vscode.Diagnostic[] = [];
		for (let lineIndex = 0; lineIndex < doc.lineCount; lineIndex++) {
			const lineOfText = doc.lineAt(lineIndex);
			if (lineOfText.text.includes(element)) {
				diagnostics.push(this.createDiagnostic(doc, lineOfText, lineIndex, element));
			}
		}
		htmlDiagnostics.set(doc.uri, diagnostics);
	}

	createDiagnostic(doc: vscode.TextDocument, lineOfText: vscode.TextLine, lineIndex: number, element: string): vscode.Diagnostic {
		const index = lineOfText.text.indexOf(element);

		const range = new vscode.Range(lineIndex, index, lineIndex, index + element.length);

		const diagnostic = new vscode.Diagnostic(range, "When you say 'emoji', do you want to find out more?",
			vscode.DiagnosticSeverity.Information);
		diagnostic.code = errorMention;
		return diagnostic;
	}


	subscribeToDocumentChanges(context: vscode.ExtensionContext, htmlDiagnostics: vscode.DiagnosticCollection, element: string): void {
		if (vscode.window.activeTextEditor) {
			this.refreshDiagnostics(vscode.window.activeTextEditor.document, htmlDiagnostics, element);
		}
		context.subscriptions.push(
			vscode.window.onDidChangeActiveTextEditor(editor => {
				if (editor) {
					this.refreshDiagnostics(editor.document, htmlDiagnostics, element);
				}
			})
		);

		context.subscriptions.push(
			vscode.workspace.onDidChangeTextDocument(e => this.refreshDiagnostics(e.document, htmlDiagnostics, element))
		);

		context.subscriptions.push(
			vscode.workspace.onDidCloseTextDocument(doc => htmlDiagnostics.delete(doc.uri))
		);
	}
}
