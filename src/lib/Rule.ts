import { Attributes, HTMLAttributes } from "react";
import ConnectionRule from "./ConnectionRule";
import { RuleType } from "./RuleType";

export default interface Rule {
    attributes: Set<string> | undefined;
    description : string | undefined;
    connectionRule: ConnectionRule | undefined;
    ruleType: RuleType | undefined;
    validate() : boolean;
}