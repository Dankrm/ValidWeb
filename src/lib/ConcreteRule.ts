import { DOMAttributes, DOMElement, HTMLAttributes } from "react";
import ConnectionRule from "./ConnectionRule";
import Rule from "./Rule";
import { RuleType } from "./RuleType";


export default class ConcreteRule implements Rule {
    attributes: Set<string> = new Set<string>;
    connectionRule: ConnectionRule | undefined;
    description: string | undefined;
    ruleType: RuleType | undefined;

    constructor () {}

    getConnectionRule(): ConnectionRule | undefined {
        return this.connectionRule;
    }

    setConnectionRule (connectionRule: ConnectionRule) {
        this.connectionRule = connectionRule;
    }

    getRuleType (): RuleType | undefined {
        return this.ruleType;
    }

    setRuleType (ruleType: RuleType) {
        this.ruleType = ruleType;
    }

    addAttribute (attribute: string) {
        this.attributes?.add(attribute);
    }

    removeAttribute (attribute: string) {
        this.attributes?.delete(attribute);
    }

    setBasedElement(basedElement: string) {
        this.connectionRule?.setBasedElement(basedElement);
    }

    setValidationElement(validationElement: string) {
        if (this.connectionRule?.getChainingType()?.isAttribute()) {
            this.addAttribute(validationElement);
        } else {
            this.connectionRule?.setValidationElement(validationElement);
        }
    }

    validate(): boolean {
        return true;
    }
}