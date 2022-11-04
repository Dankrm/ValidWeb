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
}