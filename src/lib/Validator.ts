import { Diagnostic } from "./Diagnostic";
import Rule from "./Rule";
import * as vscode from 'vscode';
import Threatment from "./Threatment";

export const errorMention = "html_error";
export abstract class Validator {
    protected abstract chain: string;
    protected abstract ignoredChars: string[];
    protected invalidation: [string, string] = ['', ''];
    protected rule: Rule;
    protected jsdom: any;
    protected elements: Element[] = [];

    protected constructor (rule: Rule, jsdom: any) {
        this.rule = rule;
        this.jsdom = jsdom;
        this.invalidation = Threatment.getInstance().constructQuerySelector(rule.getRule().basedElement, rule.getRule().validationElement, rule.getRule().chainingType);
    }

    private beforeValidate(): void {
        this.elements = this.jsdom.window.document.querySelectorAll(this.invalidation[0]);
        if (this.invalidation) {
            for (const igChar of this.ignoredChars) {
                this.invalidation[0] && ( this.invalidation[0] = this.invalidation[0].replaceAll(igChar, ''));
                this.invalidation[1] && ( this.invalidation[1] = this.invalidation[1].replaceAll(igChar, ''));
            }
        }
    }
    
    protected abstract customValidate(): void;

    private validate(): void {
        this.beforeValidate();
        this.customValidate();
    }

    public execute(): void {
        this.validate();
    }

    public getLocation (element: Element) {
		return this.jsdom.nodeLocation(element);
	}

    public getDiagnostic (found: any): vscode.Diagnostic {
		return this.createDiagnostic(found.startLine - 1, found.startCol);
	}

	private createDiagnostic(line: number, column: number): vscode.Diagnostic {
		const range = new vscode.Range(line, column, line, column + this.rule.getRule().basedElement.length);
		const diagnostic = new vscode.Diagnostic(range, this.rule.getRule().description, this.rule.getRule().ruleType.diagnostic);
		diagnostic.code = errorMention;
		return diagnostic;
	}
}