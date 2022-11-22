import { CodeAction } from "vscode";
import { Validator } from "./Validator";
import * as vscode from 'vscode';

export class ValidateChildren extends Validator {
    protected chain = ">";
    protected ignoredChars = [this.chain];

    protected customValidate(): void {
        for (const element of this.elements) {
            if (this.invalidation[1]) {
                let childrenfound = false;
                for (const children in element.children) {
                    if (element.children[children].nodeName && element.children[children].nodeName.toLowerCase() === this.invalidation[1].toLowerCase()) {
                        childrenfound = true;
                    }
                }
                if (!childrenfound) {
                    const found = this.getLocation(element);
                    const range = this.createRangeFromNodeLocation(found.startTag);
                    this.addDiagnosticToDoc(this.createDiagnostic(range));
                }
            } else {
                const found = this.getLocation(element);
                const range = this.createRangeFromNodeLocation(found);
                this.addDiagnosticToDoc(this.createDiagnostic(range));
            }
        }
    }

    public customCreateFix(diagnostic: vscode.Diagnostic): CodeAction {
			const fix = new vscode.CodeAction(this.rule.getRule().description, vscode.CodeActionKind.QuickFix);
			fix.edit = new vscode.WorkspaceEdit();
			if (this.invalidation[1]) {
					const position = new vscode.Position(diagnostic.range.start.line + 1, 0);
					fix.edit.insert(this.doc.uri, position, `<${this.invalidation[1]}></${this.invalidation[1]}>\n`);
			} else {
					fix.edit.delete(this.doc.uri, diagnostic.range);
			}
		return fix;
    }
}