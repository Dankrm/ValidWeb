import * as vscode from 'vscode';
import Rule from './Rule';
import { Validator } from './Validator';
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

export const errorMention = "html_error";

export class Diagnostic {
	private static instance: Diagnostic;
	private diagnostics: vscode.Diagnostic[] = [];
	
	public static getInstance(): Diagnostic {
        if (!Diagnostic.instance) {
            Diagnostic.instance = new Diagnostic();
        }
        return Diagnostic.instance;
    }

	private clearDiagnostics(htmlDiagnostics: vscode.DiagnosticCollection) {
		this.diagnostics = [];
		htmlDiagnostics.clear();
	}

	private refreshDiagnostics(doc: vscode.TextDocument, htmlDiagnostics: vscode.DiagnosticCollection, ruleSet: Set<Rule>): void {
		const jsdom = new JSDOM(doc.getText());
		const document = jsdom.window.document;
		ruleSet.forEach(rule => {
			for (let lineIndex = 0; lineIndex < doc.lineCount; lineIndex++) {
				const lineOfText = doc.lineAt(lineIndex);
				const basedElement = rule.connectionRule?.getBasedElement();
				const validation = rule.connectionRule?.getValidationElement();
				if (basedElement && basedElement !== '' && lineOfText.text.includes(basedElement)) {
					this.diagnostics.push(this.createDiagnostic(doc, lineOfText, lineIndex, rule));
				}
			}
		});

		htmlDiagnostics.set(doc.uri, this.diagnostics);
	}

	private createDiagnostic(doc: vscode.TextDocument, lineOfText: vscode.TextLine, lineIndex: number, rule: Rule): vscode.Diagnostic {
		const element = rule.connectionRule?.getBasedElement() || rule.connectionRule?.getValidationElement();
		const index = lineOfText.text.indexOf(element);
		const range = new vscode.Range(lineIndex, index, lineIndex, index + element.length);
		const diagnostic = new vscode.Diagnostic(range, rule.connectionRule.getChainingType().getMessageCode(),
		rule.ruleType.getDiagnostic());
		diagnostic.code = errorMention;
		return diagnostic;
	}


	subscribeToDocumentChanges(context: vscode.ExtensionContext, htmlDiagnostics: vscode.DiagnosticCollection): void {
		
		if (vscode.window.activeTextEditor) {
			this.clearDiagnostics(htmlDiagnostics);
			Validator.getInstance().requestDataToThreatment(vscode.window.activeTextEditor.document.getText()).then(response => {
				vscode.window.activeTextEditor && this.refreshDiagnostics(vscode.window.activeTextEditor.document, htmlDiagnostics, Validator.getInstance().getRuleSet());
			});
		}

		// context.subscriptions.push(
		// 	vscode.window.onDidChangeActiveTextEditor(editor => {
		// 		if (editor) {
		// 			Validator.getInstance().requestDataToThreatment(editor.document.getText()).then(response => {
		// 				this.refreshDiagnostics(editor.document, htmlDiagnostics, Validator.getInstance().getRuleSet());
		// 			});
		// 		}
		// 	})
		// );

		context.subscriptions.push(
			vscode.workspace.onDidSaveTextDocument(editor => {
				this.clearDiagnostics(htmlDiagnostics);
				Validator.getInstance().requestDataToThreatment(editor.getText()).then(response => {
					this.refreshDiagnostics(editor, htmlDiagnostics, Validator.getInstance().getRuleSet());
				});
			})
		);

		context.subscriptions.push(
			vscode.workspace.onDidCloseTextDocument(doc => htmlDiagnostics.delete(doc.uri))
		);
	}
}
