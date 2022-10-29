import { ChainingType } from "./ChainingType";
import { RuleType } from "./RuleType";

export default class Rule {
    private description: string;
    private ruleType: RuleType;
    private chainingType : ChainingType;
    private basedElement : string = '';
    private validationElement : string = '';

    constructor (chainingType: ChainingType, description: string, ruleType: RuleType) {
        this.description = description;
        this.ruleType = ruleType;
        this.chainingType = chainingType;
    }

    getChainingType (): ChainingType {
        return this.chainingType;
    }    
    
    getRuleType (): RuleType {
        return this.ruleType;
    }

    setRuleType (ruleType: RuleType) {
        this.ruleType = ruleType;
    }

    getDescription (): string {
        return this.description;
    }

    setDescription (description: string) {
        this.description = description;
    }

    getBasedElement(): string {
        return this.basedElement;
    }

    setBasedElement(basedElement: string) {
        this.basedElement = basedElement;
    }

    getValidationElement(): string {
        return this.validationElement;
    }

    setValidationElement(validationElement: string) {
        this.validationElement = validationElement;
    }

    constructQuerySelector (): [string, string] {
        let query = '';
        let tem = '';
        let naoTem = '';

        if (this.chainingType.getInvalidation() !== '') {
            query = this.chainingType.getInvalidation();
            if (this.getBasedElement() !== ''){
                query = query.replaceAll('x', this.getBasedElement());
            }

            if (this.getValidationElement() !== ''){
                query = query.replaceAll('y', this.getValidationElement());
            }

            [tem, naoTem] = query.split('$');
        } else {

        }

        return [tem, naoTem];
    }
}