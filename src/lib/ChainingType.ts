
export class ChainingType {
    private chain: string;
    private messageCode: string;
    private invalidation: string;

    constructor (chain: string, messageCode: string, invalidation: string) {
        this.chain = chain;
        this.messageCode = messageCode;
        this.invalidation = invalidation;
    }

    getMessageCode(): string {
        return this.messageCode;
    }
    
    getInvalidation(): string {
        return this.invalidation;
    }

    isAttribute (): boolean {
        return this.chain.includes('attribute');
    }
}