import Rule from "./Rule";
import { RuleType } from "./RuleType";
import Threatment from "./Threatment";
import * as vscode from 'vscode';
import { ChainingType } from "./ChainingType";
import sequelize from "../db";
import { Op, Sequelize } from "sequelize";


export const ruleTypes = {
    error: new RuleType('Erro', vscode.DiagnosticSeverity.Error),
    info: new RuleType('Informação', vscode.DiagnosticSeverity.Information),
    warning: new RuleType('Alerta', vscode.DiagnosticSeverity.Warning)
};

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
            await this.threatment.callApi(html).then((response)=>{
                const threatedData = this.threatment.threatData(response);
                threatedData.forEach(this.allRules.add, this.allRules);
            });
        } catch (error) {
            console.error(error);
        }
    }

    classifyRuleType (outerMessage: any): RuleType {      
        switch (outerMessage.type) {
            case 'error': {
                return ruleTypes.error;
            }
            case 'info': {
                return ruleTypes.info;
            }
            default: {
                return ruleTypes.warning;
            }
        }
    }

    async classifyMessage (message: string): Promise<ChainingType | null> { 
        await ChainingType.sync(); 
        
        let result = await ChainingType.findOne(
            {
                where: Sequelize.where(
                    Sequelize.literal(`'${message}'`),
                    Op.like,
                    Sequelize.col('%messageCode%')
                )
            }
        );
        debugger

        return result;
    }
}