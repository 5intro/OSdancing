// Generated from src/MyGrammar.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { ProgContext } from "./MyGrammarParser";
import { DeclarationContext } from "./MyGrammarParser";
import { TypeSpecifierContext } from "./MyGrammarParser";
import { DeclaratorListContext } from "./MyGrammarParser";
import { DeclaratorContext } from "./MyGrammarParser";
import { FunctionDefinitionContext } from "./MyGrammarParser";
import { ParameterListContext } from "./MyGrammarParser";
import { ParameterDeclarationContext } from "./MyGrammarParser";
import { CompoundStatementContext } from "./MyGrammarParser";
import { StatementContext } from "./MyGrammarParser";
import { ExprContext } from "./MyGrammarParser";
import { TermContext } from "./MyGrammarParser";
import { FactorContext } from "./MyGrammarParser";
import { ErrorContext } from "./MyGrammarParser";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `MyGrammarParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface MyGrammarVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `MyGrammarParser.prog`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProg?: (ctx: ProgContext) => Result;

	/**
	 * Visit a parse tree produced by `MyGrammarParser.declaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDeclaration?: (ctx: DeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `MyGrammarParser.typeSpecifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeSpecifier?: (ctx: TypeSpecifierContext) => Result;

	/**
	 * Visit a parse tree produced by `MyGrammarParser.declaratorList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDeclaratorList?: (ctx: DeclaratorListContext) => Result;

	/**
	 * Visit a parse tree produced by `MyGrammarParser.declarator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDeclarator?: (ctx: DeclaratorContext) => Result;

	/**
	 * Visit a parse tree produced by `MyGrammarParser.functionDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionDefinition?: (ctx: FunctionDefinitionContext) => Result;

	/**
	 * Visit a parse tree produced by `MyGrammarParser.parameterList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParameterList?: (ctx: ParameterListContext) => Result;

	/**
	 * Visit a parse tree produced by `MyGrammarParser.parameterDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParameterDeclaration?: (ctx: ParameterDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `MyGrammarParser.compoundStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCompoundStatement?: (ctx: CompoundStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `MyGrammarParser.statement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStatement?: (ctx: StatementContext) => Result;

	/**
	 * Visit a parse tree produced by `MyGrammarParser.expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpr?: (ctx: ExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MyGrammarParser.term`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTerm?: (ctx: TermContext) => Result;

	/**
	 * Visit a parse tree produced by `MyGrammarParser.factor`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFactor?: (ctx: FactorContext) => Result;

	/**
	 * Visit a parse tree produced by `MyGrammarParser.error`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitError?: (ctx: ErrorContext) => Result;
}

