import { DOMAttributes, DOMElement, HTMLAttributes } from "react";
import ConnectionRule from "./ConnectionRule";
import Rule from "./Rule";
import { RuleType } from "./RuleType";


export default class ConcreteRule implements Rule {
    attributes: Set<string> = new Set<string>;
    connectionRule: ConnectionRule;
    description: string;
    ruleType: RuleType;

    constructor (connectionRule: ConnectionRule, description: string, ruleType: RuleType) {
        this.connectionRule = connectionRule;
        this.description = description;
        this.ruleType = ruleType;
    }

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

    getValidationElement(): string {
        let response = '';
        if (this.connectionRule.getChainingType().isAttribute()) {
             this.attributes.forEach(element => {
                response = element;
            });
        } else {
            response = this.connectionRule.getValidationElement();
        }
        return response;
    }

    setValidationElement(validationElement: string) {
        if (this.connectionRule.getChainingType().isAttribute()) {
            this.addAttribute(validationElement);
        } else {
            this.connectionRule.setValidationElement(validationElement);
        }
    }

    constructQuerySelector (): [string, string] {
        let query = '';
        let tem = '';
        let naoTem = '';

        if (this.connectionRule.getChainingType().getInvalidation() !== '') {
            query = this.connectionRule.getChainingType().getInvalidation();
            if (this.connectionRule.getBasedElement() !== ''){
                query = query.replaceAll('x', this.connectionRule.getBasedElement());
            }

            if (this.getValidationElement() !== ''){
                query = query.replaceAll('y', this.getValidationElement());
            }

            [tem, naoTem] = query.split('$');
        } else {

        }

        return [tem, naoTem];
    }

    validate(): boolean {
        return true;
    }
}