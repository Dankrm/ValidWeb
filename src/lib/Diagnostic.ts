import { 
	createHash
 } from 'crypto';
import * as vscode from 'vscode';
import Rule from './Rule';
import { Threatment } from './Threatment';
import { Validator } from './Validator';
import { ValidatorFactory } from './ValidatorFactory';
import { prisma } from '../extension';
export class Diagnostic {
	private static instance: Diagnostic;
	private diagnostics: Map<string, vscode.Diagnostic[]> = new Map();
	private htmlDiagnostics = vscode.languages.createDiagnosticCollection("validweb");

	private constructor() {};

	public static getInstance(): Diagnostic {
        if (!Diagnostic.instance) {
            Diagnostic.instance = new Diagnostic();
        }
        return Diagnostic.instance;
    }

	private getHashOfPath (path: string): string {
		return createHash('sha1').update(path, 'binary').digest('hex');
	}

	public addDiagnosticToDoc(doc: vscode.TextDocument, diagnostic: vscode.Diagnostic) {
		const hash = this.getHashOfPath(doc.uri.path);
		this.diagnostics.has(hash) ? this.diagnostics.get(hash)?.push(diagnostic) : this.diagnostics.set(hash, [diagnostic]);
	}

	public clearDiagnosticsList(hash: string) {
		this.diagnostics.get(hash)?.splice(0);
	}

	public async refreshDiagnostics(doc: vscode.TextDocument): Promise<vscode.Diagnostic[] | undefined> {
		const hash = this.getHashOfPath(doc.uri.path);
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

		this.htmlDiagnostics.set(doc.uri, this.diagnostics.get(hash));
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

	public async subscribeToDocumentChanges(context: vscode.ExtensionContext): Promise<void> {
		context.subscriptions.push(this.htmlDiagnostics);
		if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.languageId === 'html') {
			await Threatment.getInstance().requestDataToThreatment(vscode.window.activeTextEditor.document.getText());
			this.refreshDiagnostics(vscode.window.activeTextEditor.document);
		}

		context.subscriptions.push(
			vscode.workspace.onDidChangeTextDocument(editor => {
				if (editor && editor.document.languageId === 'html') {
					this.refreshDiagnostics(editor.document);
				}
			})
		);

		context.subscriptions.push(
			vscode.window.onDidChangeActiveTextEditor(async (editor) => {
				if (editor && editor.document.languageId === 'html') {
					await Threatment.getInstance().requestDataToThreatment(editor.document.getText());
					this.refreshDiagnostics(editor.document);
				}
			})
		);

		context.subscriptions.push(
			vscode.workspace.onDidSaveTextDocument(editor => {
				if (editor && editor.languageId === 'html') {
					Threatment.getInstance().requestDataToThreatment(editor.getText()).then(response => {
						this.refreshDiagnostics(editor);
					});
				}
			})
		);
	}

	public getDiagnosticsOfPath (path: string): vscode.Diagnostic[] | undefined {
		return this.diagnostics.get(this.getHashOfPath(path));
	}

	public getValidatorByRule (rule: Rule, doc: vscode.TextDocument): Validator | null {
		return ValidatorFactory.methodFactory(rule, doc);
	}
}
