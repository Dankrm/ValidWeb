import { PrismaClient } from '@prisma/client';
import * as vscode from 'vscode';
import Rule from './Rule';
import Threatment from './Threatment';
import { Validator } from './Validator';
import { ValidatorFactory } from './ValidatorFactory';

const prisma = new PrismaClient();

export class Diagnostic {
	private static instance: Diagnostic;
	private diagnostics: vscode.Diagnostic[] = [];
	public static htmlDiagnostics = vscode.languages.createDiagnosticCollection("validweb");

	public static getInstance(): Diagnostic {
        if (!Diagnostic.instance) {
            Diagnostic.instance = new Diagnostic();
        }
        return Diagnostic.instance;
    }

	public addDiagnostic(diagnostic: vscode.Diagnostic) {
		this.diagnostics.push(diagnostic);
	}

	public clearDiagnosticsList() {
		this.diagnostics = [];
	}

	public clearDiagnosticsCollection() {
		Diagnostic.htmlDiagnostics.clear();
	}

	public async refreshDiagnostics(doc: vscode.TextDocument): Promise<void> {
		const rules = await prisma.rule.findMany({
			include: {
				ruleType: true,
				chainingType: true
			},
			where: {
				visible: true,
				ruleType: {
					visible: true
				}
			}
		});
		this.clearDiagnosticsList();
		for (const rule of rules) {
			try {
				const ruleModel = new Rule(rule);
				const validator = this.getValidatorByRule(ruleModel, doc);
				validator?.execute();		
			} catch (error) {
				console.log(error);
			}
		}
		this.clearDiagnosticsCollection();
		Diagnostic.htmlDiagnostics.set(doc.uri, this.diagnostics);
	}

	public showInformationMessage(message: string): void {
		vscode.window.showInformationMessage(message);
	}

	public subscribeToDocumentChanges(context: vscode.ExtensionContext): void {
		if (vscode.window.activeTextEditor) {
			vscode.window.activeTextEditor && this.refreshDiagnostics(vscode.window.activeTextEditor.document);
			// Threatment.getInstance().requestDataToThreatment(vscode.window.activeTextEditor.document.getText()).then(async response => {
			// });
		}

		context.subscriptions.push(
			vscode.workspace.onDidChangeTextDocument(editor => {
				if (editor) {
					this.refreshDiagnostics(editor.document);
				}
			})
		);

		context.subscriptions.push(
			vscode.window.onDidChangeActiveTextEditor(editor => {
				if (editor) {
					this.refreshDiagnostics(editor.document);
				}
			})
		);

		context.subscriptions.push(
			vscode.workspace.onDidSaveTextDocument(editor => {
				Threatment.getInstance().requestDataToThreatment(editor.getText()).then(response => {
					this.refreshDiagnostics(editor);
				});
			})
		);

		context.subscriptions.push(
			vscode.workspace.onDidCloseTextDocument(doc => Diagnostic.htmlDiagnostics.delete(doc.uri))
		);
	}

	getValidatorByRule (rule: Rule, doc: vscode.TextDocument): Validator | null {
		return ValidatorFactory.methodFactory(rule, doc);
	}

}
