import { CodeAction } from "vscode";
import { Diagnostic } from "./Diagnostic";
import Rule from "./Rule";
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

    public customCreateFix(): CodeAction {
        throw new Error("Method not implemented.");
    }
}