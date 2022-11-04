
import { Diagnostic } from "./Diagnostic";
import Rule from "./Rule";
import { Validator } from "./Validator";

export class ValidateAttributes extends Validator {
    protected chain = "[";
    protected ignoredChars = ['[', ']'];
    
    public constructor (rule: Rule, jsdom: any) {
        super(rule, jsdom);
    }

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
                Diagnostic.getInstance().addDiagnostic(this.getDiagnostic(found));
            }
        }

    }

}