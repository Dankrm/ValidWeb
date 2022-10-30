import Rule from "./Rule";
import { ValidateAttributes } from "./ValidateAttributes";
import { ValidateChildren } from "./ValidateChildren";
import { ValidateContent } from "./ValidateContent";
import { Validator } from "./Validator";

export class ValidatorFactory {
    public static methodFactory(found: Element, rule: Rule): Validator | null {
        let retorno;
        switch (rule.getRule().chainingType.selector) {
            case '>': {
                retorno = new ValidateChildren(found, rule);
                break;
            }
            case '[': {
                retorno = new ValidateAttributes(found, rule);
                break;
            }
            case 'content': {
                retorno = new ValidateContent(found, rule);
                break;
            }
            default : {
                retorno = null;
            }
        }
        return retorno;
    }
}