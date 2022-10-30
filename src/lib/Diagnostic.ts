import { PrismaClient } from '@prisma/client';
import * as vscode from 'vscode';
import Rule from './Rule';
import Threatment from './Threatment';
import { Validator } from './Validator';
import { ValidatorFactory } from './ValidatorFactory';
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const prisma = new PrismaClient();

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

	private async refreshDiagnostics(doc: vscode.TextDocument, htmlDiagnostics: vscode.DiagnosticCollection): Promise<void> {
		const jsdom = new JSDOM(doc.getText(), { includeNodeLocations: true });
		const document = jsdom.window.document;

		const rules = await prisma.rule.findMany({
			include: {
				ruleType: true,
				chainingType: true
			}
		});

		rules.forEach(rule => {
			try {
				const ruleModel = new Rule(rule);
				const selector = ruleModel.constructQuerySelector();
				if (selector[0]) {
					const foundElements = document.querySelectorAll(selector[0]);
					if (selector[1]) {
						if (foundElements) {
							foundElements.forEach((foundElement: Element) => {
								const foundElementLocation = jsdom.nodeLocation(foundElement);
								if (foundElementLocation) {
									const validator = this.getValidatorByRule(foundElement, ruleModel);
									const validate = validator?.execute();
									if (!validate) {
										this.diagnostics.push(this.createDiagnostic(foundElementLocation.startLine - 1, foundElementLocation.startCol, ruleModel));
									}
									
								} else {
									this.showInformationMessage(ruleModel.getRule().description);
								}
							});
						} else {
							this.showInformationMessage(ruleModel.getRule().description);
						}
					} else {
						foundElements.forEach((found: Element) => {
							const foundElement = jsdom.nodeLocation(found);
							this.diagnostics.push(this.createDiagnostic(foundElement.startLine - 1, foundElement.startCol, ruleModel));
						});
					} 
				} else {
					this.showInformationMessage(ruleModel.getRule().description);
				}
			} catch (error) {
				console.log(error);
			}
		});

		htmlDiagnostics.set(doc.uri, this.diagnostics);
	}

	private createDiagnostic(line: number, column: number, rule: Rule): vscode.Diagnostic {
		const range = new vscode.Range(line, column, line, column + rule.getRule().basedElement.length);
		const diagnostic = new vscode.Diagnostic(range, rule.getRule().description, rule.getRule().ruleType.diagnostic);
		diagnostic.code = errorMention;
		return diagnostic;
	}

	private showInformationMessage(message: string): void {
		vscode.window.showInformationMessage(message);
	}

	subscribeToDocumentChanges(context: vscode.ExtensionContext, htmlDiagnostics: vscode.DiagnosticCollection): void {
		
		if (vscode.window.activeTextEditor) {
			this.clearDiagnostics(htmlDiagnostics);
			Threatment.getInstance().requestDataToThreatment(vscode.window.activeTextEditor.document.getText()).then(response => {
				vscode.window.activeTextEditor && this.refreshDiagnostics(vscode.window.activeTextEditor.document, htmlDiagnostics);
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
				Threatment.getInstance().requestDataToThreatment(editor.getText()).then(response => {
					this.refreshDiagnostics(editor, htmlDiagnostics);
				});
			})
		);

		context.subscriptions.push(
			vscode.workspace.onDidCloseTextDocument(doc => htmlDiagnostics.delete(doc.uri))
		);
	}

	getValidatorByRule (found: Element, rule: Rule): Validator | null {
		return ValidatorFactory.methodFactory(found, rule);
	}

}
