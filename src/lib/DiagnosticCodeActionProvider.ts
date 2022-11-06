import { PrismaClient } from '@prisma/client';
import * as vscode from 'vscode';
import Rule from './Rule';
import { ValidatorFactory } from './ValidatorFactory';
const prisma = new PrismaClient();

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
					fixArray.push(replace);
				}
			}
		}

		return fixArray;
	}
}