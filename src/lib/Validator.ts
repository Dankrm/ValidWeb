import { Diagnostic } from "./Diagnostic";
import Rule from "./Rule";

export abstract class Validator {
    protected abstract chain: string;
    protected abstract ignoredChars: string[];
    protected found: Element;
    protected invalidation: string;
    protected rule: Rule;

    protected constructor (found: Element, rule: Rule) {
        this.found = found;
        this.rule = rule;
        this.invalidation = rule.constructQuerySelector()[0];
    }

    private beforeValidate(): void {
        for (const ignoredChar of this.ignoredChars) {
            this.invalidation.replaceAll(ignoredChar, '');
        }
    }
    
    protected abstract customValidate(): boolean;

    private validate(): boolean {
        this.beforeValidate();
        return this.customValidate();
    }

    public execute(): boolean {
        return this.validate();
    }
}