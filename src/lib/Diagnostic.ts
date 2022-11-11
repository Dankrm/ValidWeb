import { PrismaClient } from '@prisma/client';
import { 
	createHash
 } from 'crypto';
import * as vscode from 'vscode';
import Rule from './Rule';
import Threatment from './Threatment';
import { Validator } from './Validator';
import { ValidatorFactory } from './ValidatorFactory';

const prisma = new PrismaClient();

export class Diagnostic {
	private static instance: Diagnostic;
	private diagnostics: Map<string, vscode.Diagnostic[]> = new Map();
	public static htmlDiagnostics = vscode.languages.createDiagnosticCollection("validweb");

	public static getInstance(): Diagnostic {
        if (!Diagnostic.instance) {
            Diagnostic.instance = new Diagnostic();
        }
        return Diagnostic.instance;
    }

	private getHashTextDocument (doc: vscode.TextDocument): string {
		return createHash('sha1').update(doc.uri.path, 'binary').digest('hex');
	}

	public addDiagnosticToDoc(doc: vscode.TextDocument, diagnostic: vscode.Diagnostic) {
		const hash = this.getHashTextDocument(doc);
		this.diagnostics.has(hash) ? this.diagnostics.get(hash)?.push(diagnostic) : this.diagnostics.set(hash, [diagnostic]);
	}

	public clearDiagnosticsList(hash: string) {
		this.diagnostics.get(hash)?.splice(0);
	}

	public async refreshDiagnostics(doc: vscode.TextDocument): Promise<vscode.Diagnostic[] | undefined> {
		const hash = this.getHashTextDocument(doc);
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
		this.clearDiagnosticsList(hash);
		for (const rule of rules) {
			try {
				const ruleModel = new Rule(rule);
				const validator = this.getValidatorByRule(ruleModel, doc);
				validator?.execute();		
			} catch (error) {
				console.log(error);
			}
		}

		Diagnostic.htmlDiagnostics.set(doc.uri, this.diagnostics.get(hash));
		return this.diagnostics.get(hash);
	}

	public showInformationMessage(message: string, doc?: vscode.TextDocument): void {
		if (doc) {
			if (vscode.window.activeTextEditor?.document === doc) {
				vscode.window.showInformationMessage(message);
			}
		} else {
			vscode.window.showInformationMessage(message);
		}
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
