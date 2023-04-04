import * as path from 'path';
import * as Lint from 'tslint';
import * as ts from 'typescript';
import { isClassDeclaration } from 'tsutils';

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'Class name must match file name';

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk);
  }
}

function walk(ctx: Lint.WalkContext<void>) {
  const { sourceFile } = ctx;
  const fileName = path.parse(sourceFile.fileName).name;
  ts.forEachChild(sourceFile, (node: ts.Node): void => {
    if (!isClassDeclaration(node)) {
      return;
    }
    if (node.name?.text !== fileName) {
      ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
    }
  });
}
