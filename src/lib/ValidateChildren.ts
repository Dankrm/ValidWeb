import Rule from "./Rule";
import { Validator } from "./Validator";

export class ValidateChildren extends Validator {
    protected chain = ">";
    protected ignoredChars = [this.chain];
    
    public constructor (found: Element, rule: Rule) {
        super(found, rule);
    }

    protected customValidate(): boolean {
		let childrenfound = false;
		for (const children in this.found.children) {
			if (this.found.children[children].nodeName === this.invalidation) {
				childrenfound = true;
			}
		}
        return childrenfound;
    }

}