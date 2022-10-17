import * as vscode from 'vscode';
import Rule from './Rule';
import { Validator } from './Validator';
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

export const errorMention = "html_error";

export class Diagnostic {
	private static instance: Diagnostic;
	
	public static getInstance(): Diagnostic {
        if (!Diagnostic.instance) {
            Diagnostic.instance = new Diagnostic();
        }
        return Diagnostic.instance;
    }

	private refreshDiagnostics(doc: vscode.TextDocument, htmlDiagnostics: vscode.DiagnosticCollection): void {
		const diagnostics: vscode.Diagnostic[] = [];
		const ruleSet = Validator.getInstance().getRuleSet();

		debugger
		const dom = new JSDOM(doc.getText());

		const document = dom.window.document.querySelector('img');

		ruleSet.forEach((rule) => {
			for (let lineIndex = 0; lineIndex < doc.lineCount; lineIndex++) {
				const lineOfText = doc.lineAt(lineIndex);
				const basedElement = rule.connectionRule?.getBasedElement();
				const validation = rule.connectionRule?.getValidationElement();
				if ((basedElement && lineOfText.text.includes(basedElement)) || validation && lineOfText.text.includes(validation)) {
					diagnostics.push(this.createDiagnostic(doc, lineOfText, lineIndex, rule));
				}
			}
		});

		htmlDiagnostics.set(doc.uri, diagnostics);
	}

	private createDiagnostic(doc: vscode.TextDocument, lineOfText: vscode.TextLine, lineIndex: number, rule: Rule): vscode.Diagnostic {
		const element = rule.connectionRule?.getBasedElement() || rule.connectionRule?.getValidationElement() || '';

		const index = lineOfText.text.indexOf(element);

		const range = new vscode.Range(lineIndex, index, lineIndex, index + element.length);

		const diagnostic = new vscode.Diagnostic(range, "When you say 'emoji', do you want to find out more?",
			vscode.DiagnosticSeverity.Information);
		diagnostic.code = errorMention;
		return diagnostic;
	}


	subscribeToDocumentChanges(context: vscode.ExtensionContext, htmlDiagnostics: vscode.DiagnosticCollection): void {
		
		if (vscode.window.activeTextEditor) {
			this.refreshDiagnostics(vscode.window.activeTextEditor.document, htmlDiagnostics);
		}

		context.subscriptions.push(
			vscode.window.onDidChangeActiveTextEditor(editor => {
				if (editor) {
					Validator.getInstance().requestDataToThreatment(editor.document.getText());
					this.refreshDiagnostics(editor.document, htmlDiagnostics);
				}
			})
		);

		context.subscriptions.push(
			vscode.workspace.onDidChangeTextDocument(e => {
				Validator.getInstance().requestDataToThreatment(e.document.getText());
				this.refreshDiagnostics(e.document, htmlDiagnostics);
			})
		);

		context.subscriptions.push(
			vscode.workspace.onDidCloseTextDocument(doc => htmlDiagnostics.delete(doc.uri))
		);
	}
}
