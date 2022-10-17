
export class ChainingType {
    private chain: string;
    private messageCode: string;

    constructor (chain: string, messageCode: string) {
        this.chain = chain;
        this.messageCode = messageCode;
    }

    getMessageCode(): string{
        return this.messageCode;
    }

    isAttribute (): boolean {
        return this.chain.includes('attribute');
    }
}