import { Diagnostic } from "./Diagnostic";
import Rule from "./Rule";
import { Validator } from "./Validator";

export class ValidateContent extends Validator {
    protected chain = "content";
    protected ignoredChars = [this.chain];
    
    public constructor (rule: Rule, jsdom: any) {
        super(rule, jsdom);
    }

    protected customValidate(): void {
        for (const element of this.elements) {
            const content = element.textContent?.trim() !== '';

            if (!content) {
                const found = this.getLocation(element);
                Diagnostic.getInstance().addDiagnostic(this.getDiagnostic(found));
            }
        }
    }

}