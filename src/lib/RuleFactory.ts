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
    doctype: new ChainingType("doctype", "non-space characters found without seeing a doctype first", "$x"),
    attribute: new ChainingType("attribute", "is missing required attribute", "x$[y]"),
    attributeOptional: new ChainingType("attributeOptional", "attribute, except under certain conditions", "x$[y]"),
    attributeShould: new ChainingType("attributeShould", "consider adding a", "x$[y]"),
    attributeEmpty: new ChainingType("attributeEmpty", "bad value “” for attribute", "y$[x]"),
    children: new ChainingType("children", "is missing a required instance of child element", "x$>y"),
    childrenNotAllowed: new ChainingType("childrenNotAllowed", "not allowed as child of element", "y>x"),
    childrenNotAppear: new ChainingType("childrenNotAppear", "must not appear as a descendant of the", "y>x"),
    headingEmpty: new ChainingType("headingEmpty", "empty heading", "x?"),
    unclosed: new ChainingType("unclosed", "unclosed element", "$/>"),
    expected: new ChainingType("expected", "expected", "$x"),
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
            if (message.substring(found + 1, found + 2) !== '”') {
                if (foundCount === 0) {
                    elementToValidate = message.substring(++found, message.indexOf("”", found));
                    foundCount++;
                } else if (foundCount === 1) {
                    validation = message.substring(++found, message.indexOf("”", found));
                    foundCount++;
                } else {
                    break;
                }
            } else {
                found++;
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