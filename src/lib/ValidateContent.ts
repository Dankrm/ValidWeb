import Rule from "./Rule";
import { Validator } from "./Validator";

export class ValidateContent extends Validator {
    protected chain = "content";
    protected ignoredChars = [this.chain];
    
    public constructor (found: Element, rule: Rule) {
        super(found, rule);
    }

    protected customValidate(): boolean {
		let attributefound = false;
		for (const attribute of this.found.getAttributeNames()) {
			if (attribute === this.invalidation) {
				attributefound = true;
			}
		}
        return attributefound;
    }

}