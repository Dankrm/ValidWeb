import Rule from "./Rule";
import { Validator } from "./Validator";

export class ValidateContent extends Validator {
    protected chain = "content";
    protected ignoredChars = [this.chain];
    
    public constructor (found: Element, rule: Rule) {
        super(found, rule);
    }

    protected customValidate(): boolean {
        return this.found.textContent?.trim() !== '';
    }

}