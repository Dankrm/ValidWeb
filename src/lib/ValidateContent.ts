import { CodeAction } from "vscode";
import { Diagnostic } from "./Diagnostic";
import * as vscode from 'vscode';
import { Validator } from "./Validator";

export class ValidateContent extends Validator {
    protected chain = "content";
    protected ignoredChars = [this.chain];

    protected customValidate(): void {
        for (const element of this.elements) {
            const content = element.textContent?.trim() !== '';

            if (!content) {
                const found = this.getLocation(element);
                const range = this.createRangeFromNodeLocation(found);
                Diagnostic.getInstance().addDiagnostic(this.createDiagnostic(range));
            }
        }
    }

    public customCreateFix(diagnostic: vscode.Diagnostic): vscode.CodeAction {
        const fix = new vscode.CodeAction(this.rule.getRule().description, vscode.CodeActionKind.QuickFix);
		fix.edit = new vscode.WorkspaceEdit();
        if (this.invalidation[1]) {
            const position = new vscode.Position(diagnostic.range.start.line, 0);
            fix.edit.insert(this.doc.uri, position, `${this.invalidation[1]}\n`);
        }
        return fix;
    }

    protected alternativeValidate(): void {
        const range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0));
        if (!this.doc.getText().toLowerCase().includes(this.invalidation[1])) {
            Diagnostic.getInstance().showInformationMessage(this.rule.getRule().description);
            Diagnostic.getInstance().addDiagnostic(this.createDiagnostic(range));
        }
    }
}