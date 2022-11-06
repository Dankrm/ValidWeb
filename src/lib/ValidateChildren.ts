import { CodeAction } from "vscode";
import { Diagnostic } from "./Diagnostic";
import Rule from "./Rule";
import { Validator } from "./Validator";

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
                    Diagnostic.getInstance().addDiagnostic(this.createDiagnostic(range));
                }
            } else {
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