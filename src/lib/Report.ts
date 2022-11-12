import * as vscode from 'vscode';
import * as fs from 'fs';
import { request } from 'https';
const pdfDocument = require('pdfkit');


export class Report {
    constructor () {}

    public static async generateForFile (diagnostics: vscode.Diagnostic[]) {
        const doc = new pdfDocument({ 
            font: 'Courier',
            size: 'A4' 
        });

        for (let diagnostic of diagnostics) {
            doc.text(diagnostic.message, {

            });
        }

        let out = fs.createWriteStream(__dirname + '/teste.pdf');
        doc.pipe(out);
        doc.end();
    }
}