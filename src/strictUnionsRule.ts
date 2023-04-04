import * as Lint from 'tslint';
import { isSignatureDeclaration, isTypeReference, isUnionType, isUnionTypeNode } from 'tsutils';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.TypedRule {
  public static FAILURE_STRING = 'Type unions are not allowed';

  public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk, undefined, program.getTypeChecker());
  }
}

function walk(ctx: Lint.WalkContext, tc: ts.TypeChecker): void {
  return ts.forEachChild(ctx.sourceFile, function cb(node: ts.Node): void {
    const type = getType(node, tc);
    if (type !== undefined && isMoreThanOneUnion(type)) {
      ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
    }
    return ts.forEachChild(node, cb);
  });
}

function getType(node: ts.Node, tc: ts.TypeChecker): ts.Type | undefined {
  if (isUnionTypeNode(node)) {
    return tc.getTypeAtLocation(node);
  } else if (isSignatureDeclaration(node) && node.type === undefined) {
    // Explicit types should be handled by the first case.
    const signature = tc.getSignatureFromDeclaration(node);
    return signature === undefined ? undefined : signature.getReturnType();
  } else {
    return undefined;
  }
}

function isMoreThanOneUnion(type: ts.Type): boolean {
  if (isTypeReference(type) && type.typeArguments !== undefined) {
    return type.typeArguments.some(isMoreThanOneUnion);
  }

  if (!isUnionType(type)) {
    return false;
  }
  const typeFlagsWithoutNullUndefined = type.types
    .map(subType => subType.getFlags())
    .filter(
      typeFlag => {
        const isUndefined = typeFlag === ts.TypeFlags.Undefined;
        const isNull = typeFlag === ts.TypeFlags.Null;
        return !(isUndefined || isNull);
      }
    )
  const uniqueTypeFlags = new Set(typeFlagsWithoutNullUndefined);
  return uniqueTypeFlags.size > 1;
}
