import { TextDocument } from "vscode";
import { Diagnostic } from "./Diagnostic";
import Rule from "./Rule";
import { Validator } from "./Validator";

export class ValidateClosing extends Validator {
    protected chain = "/>";
    protected ignoredChars = [this.chain];
    
    public constructor (rule: Rule, jsdom: any) {
        super(rule, jsdom);
    }

    protected customValidate(): void {
        for (const element of this.elements) {
            if (this.invalidation[1]) {
                let childrenfound = false;
                for (const children in element.children) {
                    if (element.children[children].nodeName.toLowerCase() === this.invalidation[1].toLowerCase()) {
                        childrenfound = true;
                    }
                }
                if (!childrenfound) {
                    const found = this.getLocation(element);
                    Diagnostic.getInstance().addDiagnostic(this.getDiagnostic(found));
                }
            } else {
                const found = this.getLocation(element);
                Diagnostic.getInstance().addDiagnostic(this.getDiagnostic(found));
            }

        }
    }

}