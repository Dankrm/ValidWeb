declare type RuleType = {
    id: number;
    code: string;
    type: string;
    diagnostic: number;
    visible: boolean;
};
declare type Rules = {
    id: number;
    description: string;
    basedElement: string;
    validationElement: string;
    visible: boolean;
    ruleType: RuleType;
};
