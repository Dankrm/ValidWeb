import Rule from "./Rule";
import { Validator } from "./Validator";

export class ValidateAttributes extends Validator {
    protected chain = "[";
    protected ignoredChars = ['[', ']'];
    
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