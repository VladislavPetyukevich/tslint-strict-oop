import * as Lint from 'tslint';
import * as ts from 'typescript';
import { isClassDeclaration } from 'tsutils';

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING(count: number): string {
    if (count === 0) {
      return 'File must have one class declaration in global scope';
    }
    return 'File must have not more than one class declaration in global scope';
  }

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk);
  }
}

function walk(ctx: Lint.WalkContext<void>) {
  const {
    sourceFile,
  } = ctx;
  let classes = 0;
  const maxClasses = 1;
  ts.forEachChild(sourceFile, (node: ts.Node): void => {
    if (isClassDeclaration(node)) {
      classes++;
      if (classes > maxClasses) {
        ctx.addFailureAtNode(node, Rule.FAILURE_STRING(classes));
      }
    }
  });
  if (classes === 0) {
    ctx.addFailure(0, 0, Rule.FAILURE_STRING(classes));
  }
}
