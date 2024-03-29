import * as vscode from 'vscode';
import Rule from './Rule';
import { ValidatorFactory } from '../validator/ValidatorFactory';
import { prisma } from '../extension';

export class DiagnosticCodeActionProvider implements vscode.CodeActionProvider {
	
    public static readonly providedCodeActionKinds = [
		vscode.CodeActionKind.QuickFix
	];

	public async provideCodeActions(doc: vscode.TextDocument, range: vscode.Range, context: vscode.CodeActionContext): Promise<vscode.CodeAction[] | undefined> {
		const fixArray: vscode.CodeAction[] = [];
		for (const diagnostic of context.diagnostics) {
			const rule = await prisma.rule.findUnique({
				include: {
					ruleType: true,
					chainingType: true
				},
				where: {
					id: Number(diagnostic.code)
				}
			});
			if (rule !== null) {
				const validator = ValidatorFactory.methodFactory(new Rule(rule), doc);
				if (validator) {
					const replace = validator.createFix(diagnostic);
					if (replace.edit?.size) {
						fixArray.push(replace);
					}
				}
			}
		}

		return fixArray;
	}
}