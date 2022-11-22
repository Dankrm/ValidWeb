import Rule from "../lib/Rule";
import { ValidateAttributes } from "./ValidateAttributes";
import { ValidateChildren } from "./ValidateChildren";
import { ValidateClosing } from "./ValidateClosing";
import { ValidateContent } from "./ValidateContent";
import { Validator } from "./Validator";
import * as vscode from 'vscode';

export class ValidatorFactory {
    public static methodFactory(rule: Rule, doc: vscode.TextDocument): Validator | null {
        let retorno;
        switch (rule.getRule().chainingType.selector) {
            case '>': {
                retorno = new ValidateChildren(rule, doc);
                break;
            }
            case '[': {
                retorno = new ValidateAttributes(rule, doc);
                break;
            }
            case 'content': {
                retorno = new ValidateContent(rule, doc);
                break;
            }
            case '/>': {
                retorno = new ValidateClosing(rule, doc);
                break;
            }
            default : {
                retorno = null;
            }
        }
        return retorno;
    }
}