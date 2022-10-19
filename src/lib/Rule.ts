import { Attributes, HTMLAttributes } from "react";
import ConnectionRule from "./ConnectionRule";
import { RuleType } from "./RuleType";

export default interface Rule {
    attributes: Set<string>;
    description : string;
    connectionRule: ConnectionRule;
    ruleType: RuleType;
    validate() : boolean;
}