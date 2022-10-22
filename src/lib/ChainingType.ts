import {Sequelize, Model, DataTypes} from 'sequelize';
import db from '../db';

export class ChainingType extends Model{
    private chain: string;
    private messageCode: string;
    private invalidation: string;

    constructor (chain: string, messageCode: string, invalidation: string) {
        super();
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

ChainingType.init({
    chain: DataTypes.TEXT,
    messageCode: DataTypes.TEXT,
    invalidation: DataTypes.TEXT
}, {db, modelName: 'chaining_type'});