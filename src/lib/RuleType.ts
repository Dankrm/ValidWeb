
import * as vscode from 'vscode';

export class RuleType {
    private type: string | undefined;
    private diagnostic: vscode.DiagnosticSeverity;

    constructor (type: string, diagnostic: vscode.DiagnosticSeverity) {
        this.type = type;
        this.diagnostic = diagnostic;
    }

    public getDiagnostic(){
        return this.diagnostic;
    }
}