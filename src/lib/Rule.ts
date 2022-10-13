import ConnectionRule from "./ConnectionRule";

export default interface Rule {
    description : string | undefined;
    connectionRule: ConnectionRule | undefined;
    validate() : boolean;
}