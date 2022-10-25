import Rule from "./Rule";
import { RuleType } from "./RuleType";
import Threatment from "./Threatment";
import * as vscode from 'vscode';
import { ChainingType } from "./ChainingType";
import { Op, Sequelize } from "sequelize";

export class Validator {
    private static instance: Validator;
    private threatment: Threatment = Threatment.getInstance();
    private allRules : Set<Rule> = new Set<Rule>;

    private constructor () {}

    public static getInstance(): Validator {
        if (!Validator.instance) {
            Validator.instance = new Validator();
        }
        return Validator.instance;
    }

    public getRuleSet () {
        return this.allRules;
    }

    async requestDataToThreatment (html: string) {
        this.allRules = new Set<Rule>;
        try {
            await this.threatment.callApi(html).then(async (data) => {
                const threatedData = await this.threatment.threatData(data);
                for (const rule of threatedData) {
                    this.allRules.add(rule);
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    async classifyRuleType (outerMessage: any): Promise<RuleType | null> {      
        return await RuleType.findOne({
            where: {
                code: outerMessage
            }
        });
    }

    async classifyMessage (message: string): Promise<ChainingType | null> { 
        await ChainingType.sync(); 
        
        let result = await ChainingType.findOne(
            {
                where: Sequelize.fn('instr', `'${message}'`, Sequelize.col('messageCode')),
            }
        );

        return result;
    }
}