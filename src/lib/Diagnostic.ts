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
		const jsdom = new JSDOM(doc.getText(), { includeNodeLocations: true });
		const document = jsdom.window.document;
	
		ruleSet.forEach(rule => {
			debugger
			try {
				const selector = rule.constructQuerySelector();
				if (selector[0]) {
					const foundElements = document.querySelectorAll(selector[0]);
					if (selector[1]) {
						foundElements.forEach((found: HTMLElement) => {
							const foundElement = jsdom.nodeLocation(found);
							if (foundElement) {
								if (selector[1].includes('>')) {
									selector[1] = selector[1].replace('>', '');
									let childrenfound = false;
									found.childNodes.forEach( children => {
										if (children.nodeName === selector[1]) {
											childrenfound = true;
										}
									});
									!childrenfound ? this.diagnostics.push(this.createDiagnostic(foundElement.startLine - 1, foundElement.startCol, rule)) : "";
								} else if (selector[1].includes('[')) {
									selector[1] = selector[1].replaceAll('[', '').replaceAll(']', '');
									let attributefound = false;
									found.getAttributeNames().forEach(attribute => {
										if (attribute === selector[1]) {
											attributefound = true;
										}
									});
									!attributefound ? this.diagnostics.push(this.createDiagnostic(foundElement.startLine - 1, foundElement.startCol, rule)) : "";
								}
							} else {
								//sugestão para criar
							}
						});

					} else {
						foundElements.forEach((found: HTMLElement) => {
							const foundElement = jsdom.nodeLocation(found);

							this.diagnostics.push(this.createDiagnostic(foundElement.startLine - 1, foundElement.startCol, rule));
						});
					} 
				} else {
					//fazer opeerações de sugestão ou mesnsagem
				}
			} catch (error) {
				console.log(error);
			}
		});

		htmlDiagnostics.set(doc.uri, this.diagnostics);
	}

	private createDiagnostic(line: number, column: number, rule: Rule): vscode.Diagnostic {
		const range = new vscode.Range(line, column, line, column + rule.connectionRule.getBasedElement().length);
		const diagnostic = new vscode.Diagnostic(range, rule.connectionRule.getChainingType().getMessageCode(), rule.ruleType.getDiagnostic());
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
