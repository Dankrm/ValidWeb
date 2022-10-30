import { Rule as DbRule, RuleType, ChainingType} from "@prisma/client";

export default class Rule {
    constructor(
        private readonly rule: DbRule & {
            ruleType: RuleType;
            chainingType: ChainingType;
        }
        ) {}

    getRule() {
        return this.rule;
    }
    
    constructQuerySelector (): [string, string] {
        let query = '';
        let has = '';
        let dontHas = '';
        if (this.rule.chainingType.invalidation !== '') {
            query = this.rule.chainingType.invalidation;
            if (this.rule.basedElement !== ''){
                query = query.replaceAll('x', this.rule.basedElement);
            }

            if (this.rule.validationElement !== ''){
                query = query.replaceAll('y', this.rule.basedElement);
            }

            [has, dontHas] = query.split('$');
        } else {

        }

        return [has, dontHas];
    }
}