import Rule from "./Rule";
import { ValidateAttributes } from "./ValidateAttributes";
import { ValidateChildren } from "./ValidateChildren";
import { ValidateClosing } from "./ValidateClosing";
import { ValidateContent } from "./ValidateContent";
import { Validator } from "./Validator";
import * as vscode from 'vscode';

export class ValidatorFactory {
    public static methodFactory(rule: Rule, jsdom: any): Validator | null {
        let retorno;
        switch (rule.getRule().chainingType.selector) {
            case '>': {
                retorno = new ValidateChildren(rule, jsdom);
                break;
            }
            case '[': {
                retorno = new ValidateAttributes(rule, jsdom);
                break;
            }
            case 'content': {
                retorno = new ValidateContent(rule, jsdom);
                break;
            }
            case '/>': {
                retorno = new ValidateClosing(rule, jsdom);
                break;
            }
            default : {
                retorno = null;
            }
        }
        return retorno;
    }
}