import { DOMElement, HTMLAttributes } from "react";
import { ChainingType } from "./ChainingType";


export default class ConnectionRule {
    private chainingType : ChainingType | undefined;
    private basedElement : string | undefined;
    private validationElement : string | undefined;

    constructor () {};

    getChainingType(): ChainingType | undefined {
        return this.chainingType;
    }
    setChainingType(chainingType: ChainingType) {
        this.chainingType = chainingType;
    }
    getBasedElement(): string | undefined {
        return this.basedElement;
    }
    setBasedElement(basedElement: string) {
        this.basedElement = basedElement;
    }
    getValidationElement(): string | undefined {
        return this.validationElement;
    }
    setValidationElement(validationElement: string) {
        this.validationElement = validationElement;
    }

    validate () {
        
    }
}