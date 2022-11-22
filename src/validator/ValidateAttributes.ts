
import { CodeAction } from "vscode";
import { Validator } from "./Validator";
import * as vscode from 'vscode';

export class ValidateAttributes extends Validator {
    protected chain = "[";
    protected ignoredChars = ['[', ']'];

    protected customValidate(): void {
        for (const element of this.elements) {
            let attributefound = false;
            for (const attribute of element.getAttributeNames()) {
                if (attribute.toLowerCase() === this.invalidation[1].toLowerCase()) {
                    if (element.getAttribute(attribute) !== '') {
                        attributefound = true;
                    }
                }
            }
            if (!attributefound) {
                const found = this.getLocation(element);
                if (found.attrs && found.attrs[this.invalidation[1]]) {
                    const foundAttr = found.attrs[this.invalidation[1]];
                    const range = this.createRangeFromNodeLocation(foundAttr);
                    this.addDiagnosticToDoc(this.createDiagnostic(range));
                } else {
                    const range = this.createRangeFromNodeLocation(found.startTag);
                    this.addDiagnosticToDoc(this.createDiagnostic(range));
                }
            }
        }
    }

    public customCreateFix(diagnostic: vscode.Diagnostic): CodeAction {
        const fix = new vscode.CodeAction(this.rule.getRule().description, vscode.CodeActionKind.QuickFix);
		fix.edit = new vscode.WorkspaceEdit();
        if (this.invalidation[1]) {
            if (!this.doc.lineAt(diagnostic.range.start.line).text.includes(this.invalidation[1])) {
                const position = new vscode.Position(diagnostic.range.start.line, diagnostic.range.start.character + this.invalidation[0].length + 1);
                fix.edit.insert(this.doc.uri, position, ` ${this.invalidation[1]}="" `);
            }
        } else {
            fix.edit.delete(this.doc.uri, diagnostic.range);
        }
		return fix;
    }
}