import { CodeAction, TextDocument } from "vscode";
import { Diagnostic } from "./Diagnostic";
import Rule from "./Rule";
import { Validator } from "./Validator";

export class ValidateClosing extends Validator {
    protected chain = "/>";
    protected ignoredChars = [this.chain];

    protected customValidate(): void {
        for (const element of this.elements) {
            if (this.invalidation[0]) {
                const found = this.getLocation(element);
                if (!found.endTag) { 
                    Diagnostic.getInstance().addDiagnostic(this.createDiagnostic(found));
                }
            } else {
                const found = this.getLocation(element);
                Diagnostic.getInstance().showInformationMessage(this.rule.getRule().description);
            }
        }
    }

    public customCreateFix(): CodeAction {
        throw new Error("Method not implemented.");
    }
}