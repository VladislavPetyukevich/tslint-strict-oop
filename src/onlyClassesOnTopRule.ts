import * as Lint from 'tslint';
import * as ts from 'typescript';
import {
  isClassDeclaration,
  isImportDeclaration,
  isExportDeclaration,
  isTypeAliasDeclaration,
  isTypeParameterDeclaration,
  isParameterDeclaration,
  isInterfaceDeclaration,
} from 'tsutils';

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'Only class defenition on global scope allowed';

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk);
  }
}

function walk(ctx: Lint.WalkContext<void>) {
  const { sourceFile } = ctx;
  ts.forEachChild(sourceFile, (node: ts.Node): void => {
    if (
      isTypeAliasDeclaration(node) ||
      isTypeParameterDeclaration(node) ||
      isParameterDeclaration(node) ||
      isImportDeclaration(node) ||
      isExportDeclaration(node) ||
      isClassDeclaration(node) ||
      isInterfaceDeclaration(node) ||
      node.kind === ts.SyntaxKind.EndOfFileToken
    ) {
      return;
    }
    ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
  });
}
