import Rule from "./Rule";
import { RuleType } from "./RuleType";
import Threatment from "./Threatment";
import * as vscode from 'vscode';
import { ChainingType } from "./ChainingType";

export const chainingTypes = {
    doctype: new ChainingType("doctype", "non-space characters found without seeing a doctype first", "$x"),
    attribute: new ChainingType("attribute", "is missing required attribute", "x$[y]"),
    attributeOptional: new ChainingType("attributeOptional", "attribute, except under certain conditions", "x$[y]"),
    attributeShould: new ChainingType("attributeShould", "consider adding a", "x$[y]"),
    attributeEmpty: new ChainingType("attributeEmpty", "bad value “” for attribute", "x$[y]"),
    children: new ChainingType("children", "is missing a required instance of child element", "x$>y"),
    childrenNotAllowed: new ChainingType("childrenNotAllowed", "not allowed as child of element", "y>x"),
    childrenNotAppear: new ChainingType("childrenNotAppear", "must not appear as a descendant of the", "y>x"),
    headingEmpty: new ChainingType("headingEmpty", "empty heading", "x?"),
    unclosed: new ChainingType("unclosed", "unclosed element", "$/>"),
    expected: new ChainingType("expected", "expected", "$x"),
};

export const ruleTypes = {
    error: new RuleType('Erro', vscode.DiagnosticSeverity.Error),
    info: new RuleType('Informação', vscode.DiagnosticSeverity.Information),
    warning: new RuleType('Alerta', vscode.DiagnosticSeverity.Warning)
};

export class Validator {
    private static instance: Validator;
    private threatment: Threatment = Threatment.getInstance();
    private allRules : Set<Rule> = new Set<Rule>;

    private constructor () {}

    public static getInstance(): Validator {
        if (!Validator.instance) {
            Validator.instance = new Validator();
        }
        return Validator.instance;
    }

    public getRuleSet () {
        return this.allRules;
    }

    async requestDataToThreatment (html: string) {
        this.allRules = new Set<Rule>;
        try {
            await this.threatment.callApi(html).then((response)=>{
                const threatedData = this.threatment.threatData(response);
                threatedData.forEach(this.allRules.add, this.allRules);
            });
        } catch (error) {
            console.error(error);
        }
    }

    classifyRuleType (outerMessage: any): RuleType {      
        switch (outerMessage.type) {
            case 'error': {
                return ruleTypes.error;
            }
            case 'info': {
                return ruleTypes.info;
            }
            default: {
                return ruleTypes.warning;
            }
        }
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