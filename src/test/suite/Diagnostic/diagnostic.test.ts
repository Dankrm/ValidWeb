import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import { Diagnostic } from '../../../lib/Diagnostic';
import { Validator } from '../../../lib/Validator';

suite('Diagnóstico', () => {
    test('Criar Diagnostico', async () => {
        const diagnostic = new vscode.Diagnostic(new vscode.Range(0, 10, 0, 20), "Teste", vscode.DiagnosticSeverity.Information);
    });

	test('Adicionar Diagnostico para Documentos', async () => {


	});
});