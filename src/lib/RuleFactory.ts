import { DiagnosticSeverity } from "vscode";
import { ChainingType } from "./ChainingType";
import ConcreteRule from "./ConcreteRule";
import ConnectionRule from "./ConnectionRule";
import Rule from "./Rule";
import { RuleType } from "./RuleType";
import * as vscode from 'vscode';

type IValidatorMessage = {
    extract: string
    firstColumn: number
    hiliteLength: number
    hiliteStart: number
    lastColumn: number
    lastLine: number
    message: string
    type: string
};

export const chainingTypes = {
    doctype: new ChainingType("doctype", "Non-space characters found without seeing a doctype first"),
    attribute: new ChainingType("attribute", "is missing required attribute"),
    attributeOptional: new ChainingType("attributeOptional", "attribute, except under certain conditions"),
    attributeShould: new ChainingType("attributeShould", "Consider adding a"),
    children: new ChainingType("children", "is missing a required instance of child element"),
    childrenNotAllowed: new ChainingType("childrenNotAllowed", "not allowed as child of element"),
    childrenNotAppear: new ChainingType("childrenNotAppear", "must not appear as a descendant of the"),
    headingEmpty: new ChainingType("headingEmpty", "Empty heading"),
    unclosed: new ChainingType("unclosed", "Unclosed element"),
    expected: new ChainingType("expected", "expected"),
};

export default class RuleFactory {

    constructor () {}

    factory (json : any): Set<Rule> {
        let rules = new Set<Rule>;
        json.data.messages.forEach((outerMessage: any) => {
            const rule = this.buildRule(outerMessage);
            if (rule) {
                rules.add(rule);
            }
        });
        return rules;
    }

    buildRule (outerMessage: IValidatorMessage): Rule | undefined {
        try {
            const message = outerMessage.message;
            if (message) {
                const chainingType = this.classifyMessage(String(message).toLocaleLowerCase());
                const connectionRule = new ConnectionRule(chainingType);

                const [elementToValidate, validation] = this.searchForElements(message);

                if (connectionRule !== null) {
                    const rule = new ConcreteRule(connectionRule, message, this.classifyRuleType(outerMessage));
                    rule.setBasedElement(elementToValidate);
                    rule.setValidationElement(validation);

                    return rule;
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    searchForElements (message: string): [string, string] {
        let elementToValidate = '';
        let validation = '';
        let found = 0;
        let foundCount = 0;

        while ((found = message.indexOf("“", found)) !== -1) {
            if (foundCount === 0) {
                elementToValidate = message.substring(++found, message.indexOf("”", found + 1));
                foundCount++;
            } else if (foundCount === 1) {
                validation = message.substring(++found, message.indexOf("”", found + 1));
                foundCount++;
            } else {
                break;
            }
        }

        return [elementToValidate, validation];
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

    classifyRuleType (outerMessage: any): RuleType {      
        switch (outerMessage.type) {
            case 'error': {
                return new RuleType('Erro', vscode.DiagnosticSeverity.Error);
            }
            case 'info': {
                return new RuleType('Informação', vscode.DiagnosticSeverity.Information);
            }
            default: {
                return new RuleType('Alerta', vscode.DiagnosticSeverity.Warning);
            }
        }
    }


}