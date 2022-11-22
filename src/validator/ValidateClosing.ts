import * as vscode from 'vscode';
import { Validator } from "./Validator";

export class ValidateClosing extends Validator {
    protected chain = "/>";
    protected ignoredChars = [this.chain];

    protected customValidate(): void {
        for (const element of this.elements) {
            if (this.invalidation[0]) {
                const found = this.getLocation(element);
                if (!found.endTag) { 
                    this.addDiagnosticToDoc(this.createDiagnostic(found));
                }
            } else {
                const found = this.getLocation(element);
                this.showInformationMessage();
            }
        }
    }

    public customCreateFix(diagnostic: vscode.Diagnostic): vscode.CodeAction {
        const fix = new vscode.CodeAction(this.rule.getRule().description, vscode.CodeActionKind.QuickFix);
		fix.edit = new vscode.WorkspaceEdit();
        if (this.invalidation[1]) {
            const position = new vscode.Position(diagnostic.range.start.line + 1, 0);
            fix.edit.insert(this.doc.uri, position, `<${this.invalidation[1]}></${this.invalidation[1]}>\n`);
        }
        return fix;
    }
}