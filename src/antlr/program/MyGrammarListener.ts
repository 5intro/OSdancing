// Generated from src/MyGrammar.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

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
 * This interface defines a complete listener for a parse tree produced by
 * `MyGrammarParser`.
 */
export interface MyGrammarListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `MyGrammarParser.prog`.
	 * @param ctx the parse tree
	 */
	enterProg?: (ctx: ProgContext) => void;
	/**
	 * Exit a parse tree produced by `MyGrammarParser.prog`.
	 * @param ctx the parse tree
	 */
	exitProg?: (ctx: ProgContext) => void;

	/**
	 * Enter a parse tree produced by `MyGrammarParser.declaration`.
	 * @param ctx the parse tree
	 */
	enterDeclaration?: (ctx: DeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `MyGrammarParser.declaration`.
	 * @param ctx the parse tree
	 */
	exitDeclaration?: (ctx: DeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `MyGrammarParser.typeSpecifier`.
	 * @param ctx the parse tree
	 */
	enterTypeSpecifier?: (ctx: TypeSpecifierContext) => void;
	/**
	 * Exit a parse tree produced by `MyGrammarParser.typeSpecifier`.
	 * @param ctx the parse tree
	 */
	exitTypeSpecifier?: (ctx: TypeSpecifierContext) => void;

	/**
	 * Enter a parse tree produced by `MyGrammarParser.declaratorList`.
	 * @param ctx the parse tree
	 */
	enterDeclaratorList?: (ctx: DeclaratorListContext) => void;
	/**
	 * Exit a parse tree produced by `MyGrammarParser.declaratorList`.
	 * @param ctx the parse tree
	 */
	exitDeclaratorList?: (ctx: DeclaratorListContext) => void;

	/**
	 * Enter a parse tree produced by `MyGrammarParser.declarator`.
	 * @param ctx the parse tree
	 */
	enterDeclarator?: (ctx: DeclaratorContext) => void;
	/**
	 * Exit a parse tree produced by `MyGrammarParser.declarator`.
	 * @param ctx the parse tree
	 */
	exitDeclarator?: (ctx: DeclaratorContext) => void;

	/**
	 * Enter a parse tree produced by `MyGrammarParser.functionDefinition`.
	 * @param ctx the parse tree
	 */
	enterFunctionDefinition?: (ctx: FunctionDefinitionContext) => void;
	/**
	 * Exit a parse tree produced by `MyGrammarParser.functionDefinition`.
	 * @param ctx the parse tree
	 */
	exitFunctionDefinition?: (ctx: FunctionDefinitionContext) => void;

	/**
	 * Enter a parse tree produced by `MyGrammarParser.parameterList`.
	 * @param ctx the parse tree
	 */
	enterParameterList?: (ctx: ParameterListContext) => void;
	/**
	 * Exit a parse tree produced by `MyGrammarParser.parameterList`.
	 * @param ctx the parse tree
	 */
	exitParameterList?: (ctx: ParameterListContext) => void;

	/**
	 * Enter a parse tree produced by `MyGrammarParser.parameterDeclaration`.
	 * @param ctx the parse tree
	 */
	enterParameterDeclaration?: (ctx: ParameterDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `MyGrammarParser.parameterDeclaration`.
	 * @param ctx the parse tree
	 */
	exitParameterDeclaration?: (ctx: ParameterDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `MyGrammarParser.compoundStatement`.
	 * @param ctx the parse tree
	 */
	enterCompoundStatement?: (ctx: CompoundStatementContext) => void;
	/**
	 * Exit a parse tree produced by `MyGrammarParser.compoundStatement`.
	 * @param ctx the parse tree
	 */
	exitCompoundStatement?: (ctx: CompoundStatementContext) => void;

	/**
	 * Enter a parse tree produced by `MyGrammarParser.statement`.
	 * @param ctx the parse tree
	 */
	enterStatement?: (ctx: StatementContext) => void;
	/**
	 * Exit a parse tree produced by `MyGrammarParser.statement`.
	 * @param ctx the parse tree
	 */
	exitStatement?: (ctx: StatementContext) => void;

	/**
	 * Enter a parse tree produced by `MyGrammarParser.expr`.
	 * @param ctx the parse tree
	 */
	enterExpr?: (ctx: ExprContext) => void;
	/**
	 * Exit a parse tree produced by `MyGrammarParser.expr`.
	 * @param ctx the parse tree
	 */
	exitExpr?: (ctx: ExprContext) => void;

	/**
	 * Enter a parse tree produced by `MyGrammarParser.term`.
	 * @param ctx the parse tree
	 */
	enterTerm?: (ctx: TermContext) => void;
	/**
	 * Exit a parse tree produced by `MyGrammarParser.term`.
	 * @param ctx the parse tree
	 */
	exitTerm?: (ctx: TermContext) => void;

	/**
	 * Enter a parse tree produced by `MyGrammarParser.factor`.
	 * @param ctx the parse tree
	 */
	enterFactor?: (ctx: FactorContext) => void;
	/**
	 * Exit a parse tree produced by `MyGrammarParser.factor`.
	 * @param ctx the parse tree
	 */
	exitFactor?: (ctx: FactorContext) => void;

	/**
	 * Enter a parse tree produced by `MyGrammarParser.error`.
	 * @param ctx the parse tree
	 */
	enterError?: (ctx: ErrorContext) => void;
	/**
	 * Exit a parse tree produced by `MyGrammarParser.error`.
	 * @param ctx the parse tree
	 */
	exitError?: (ctx: ErrorContext) => void;
}

