import { createElement } from "react";
import { ChainingType } from "./ChainingType";
import ConcreteRule from "./ConcreteRule";
import ConnectionRule from "./ConnectionRule";
import Rule from "./Rule";
import { RuleType } from "./RuleType";

export const chainingTypes = {
    attribute: new ChainingType("attribute", "is missing required attribute"),
    attributeOptional: new ChainingType("attributeOptional", "attribute, except under certain conditions"),
    children: new ChainingType("children", "is missing a required instance of child element"),
    parent: new ChainingType("parent", "parent"),
    sibling: new ChainingType("sibling", "sibling"),
    order: new ChainingType("order", "order"),
    unclosed: new ChainingType("unclosed", "Unclosed element"),
    expected: new ChainingType("expected", "expected"),
};

export default class RuleFactory {

    constructor () {}

    factory (json : any): Set<Rule> {
        const rules = new Set<Rule>;
        if (json.MESSAGES.ERROR) {
            const errorRules = this.buildMessages(json.MESSAGES.ERROR, new RuleType('error'));
            errorRules.forEach(rules.add, rules);
        }
        if (json.MESSAGES.INFO) {
            const infoRules = this.buildMessages(json.MESSAGES.ERROR, new RuleType('info')); 
            infoRules.forEach(rules.add, rules);
        }
        return rules;
    }

    buildMessages (outerMessages: any, ruleType: RuleType): Set<Rule> {
        const rules = new Set<Rule>;
        outerMessages.forEach((outerMessage: any) => {
            try {
                const filteredMessage = outerMessage.MESSAGE[0];

                let message = '';
                if (filteredMessage._) {
                    message = filteredMessage._;
                }
                
                if (message) {
                    const rule = new ConcreteRule();
                    const connectionRule = new ConnectionRule();
                    const chainingType = this.classifyMessage(String(message).toLocaleLowerCase());
                    connectionRule.setChainingType(chainingType);

                    rule.setRuleType(ruleType);
                    rule.setConnectionRule(connectionRule);

                    let elementToValidate = null;
                    let validation = null;

                    if (connectionRule !== null) {
                        if (!elementToValidate && filteredMessage.A && filteredMessage.A[0].CODE && filteredMessage.A[0].CODE[0]) {
                            elementToValidate = filteredMessage.A[0].CODE[0];
                        } else {
                            if (filteredMessage.CODE.length > 1) {
                                elementToValidate = filteredMessage.CODE[0];
                                validation = filteredMessage.CODE[1];
                            } else {
                                validation = filteredMessage.CODE[0];
                            }
                        }
                        if (!validation && filteredMessage.CODE[0] && filteredMessage.CODE) {
                            validation = filteredMessage.CODE[0];
                        }
                        
                        connectionRule.setBasedElement(elementToValidate);
                        rule.setValidationElement(validation);
                        rules.add(rule);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        });
        return rules;
    }

    classifyMessage (message: string): ChainingType {      
        let result = null;
        Object.entries(chainingTypes).forEach(([keyWord, value]) => {
            if (message.includes(value.getMessageCode())) {
                result = value;
            }
        });
        return result !== null ? result : chainingTypes.expected;
    }


}