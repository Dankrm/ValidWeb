
import { DataTypes, Model } from 'sequelize';
import * as vscode from 'vscode';
import sequelize from '../db';

export class RuleType extends Model {
    declare type: string | undefined;
    declare diagnostic: vscode.DiagnosticSeverity;

    public getDiagnostic(){
        return this.diagnostic;
    }
}

RuleType.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    code: DataTypes.TEXT,
    type: DataTypes.TEXT,
    diagnostic: DataTypes.NUMBER,
}, {sequelize});

(async () => {
    await RuleType.destroy({
        where: {}
    });
    await sequelize.sync(); 
    await RuleType.bulkCreate ([
        {
            code: "error",
            type: "Erro",
            diagnostic: vscode.DiagnosticSeverity.Error
        },
        {
            code: "info",
            type: "Informação",
            diagnostic: vscode.DiagnosticSeverity.Information
        },
    ]);
})();