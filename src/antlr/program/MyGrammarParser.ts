// Generated from src/MyGrammar.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { MyGrammarListener } from "./MyGrammarListener";
import { MyGrammarVisitor } from "./MyGrammarVisitor";


export class MyGrammarParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly T__3 = 4;
	public static readonly T__4 = 5;
	public static readonly T__5 = 6;
	public static readonly T__6 = 7;
	public static readonly T__7 = 8;
	public static readonly T__8 = 9;
	public static readonly T__9 = 10;
	public static readonly T__10 = 11;
	public static readonly T__11 = 12;
	public static readonly T__12 = 13;
	public static readonly T__13 = 14;
	public static readonly T__14 = 15;
	public static readonly PLUS = 16;
	public static readonly MINUS = 17;
	public static readonly MUL = 18;
	public static readonly DIV = 19;
	public static readonly LPAREN = 20;
	public static readonly RPAREN = 21;
	public static readonly INT = 22;
	public static readonly IDENTIFIER = 23;
	public static readonly WS = 24;
	public static readonly RULE_prog = 0;
	public static readonly RULE_declaration = 1;
	public static readonly RULE_typeSpecifier = 2;
	public static readonly RULE_declaratorList = 3;
	public static readonly RULE_declarator = 4;
	public static readonly RULE_functionDefinition = 5;
	public static readonly RULE_parameterList = 6;
	public static readonly RULE_parameterDeclaration = 7;
	public static readonly RULE_compoundStatement = 8;
	public static readonly RULE_statement = 9;
	public static readonly RULE_expr = 10;
	public static readonly RULE_term = 11;
	public static readonly RULE_factor = 12;
	public static readonly RULE_error = 13;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"prog", "declaration", "typeSpecifier", "declaratorList", "declarator", 
		"functionDefinition", "parameterList", "parameterDeclaration", "compoundStatement", 
		"statement", "expr", "term", "factor", "error",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "';'", "'int'", "'float'", "'char'", "'void'", "','", "'['", 
		"']'", "'{'", "'}'", "'if'", "'else'", "'while'", "'for'", "'return'", 
		"'+'", "'-'", "'*'", "'/'", "'('", "')'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, "PLUS", "MINUS", "MUL", "DIV", "LPAREN", "RPAREN", 
		"INT", "IDENTIFIER", "WS",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(MyGrammarParser._LITERAL_NAMES, MyGrammarParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return MyGrammarParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "MyGrammar.g4"; }

	// @Override
	public get ruleNames(): string[] { return MyGrammarParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return MyGrammarParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(MyGrammarParser._ATN, this);
	}
	// @RuleVersion(0)
	public prog(): ProgContext {
		let _localctx: ProgContext = new ProgContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, MyGrammarParser.RULE_prog);
		let _la: number;
		try {
			this.state = 40;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 2, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 32;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << MyGrammarParser.T__0) | (1 << MyGrammarParser.T__1) | (1 << MyGrammarParser.T__2) | (1 << MyGrammarParser.T__3) | (1 << MyGrammarParser.T__4) | (1 << MyGrammarParser.T__5) | (1 << MyGrammarParser.T__6) | (1 << MyGrammarParser.T__7) | (1 << MyGrammarParser.T__8) | (1 << MyGrammarParser.T__9) | (1 << MyGrammarParser.T__10) | (1 << MyGrammarParser.T__11) | (1 << MyGrammarParser.T__12) | (1 << MyGrammarParser.T__13) | (1 << MyGrammarParser.T__14) | (1 << MyGrammarParser.PLUS) | (1 << MyGrammarParser.MINUS) | (1 << MyGrammarParser.MUL) | (1 << MyGrammarParser.DIV) | (1 << MyGrammarParser.LPAREN) | (1 << MyGrammarParser.RPAREN) | (1 << MyGrammarParser.INT) | (1 << MyGrammarParser.IDENTIFIER) | (1 << MyGrammarParser.WS))) !== 0)) {
					{
					this.state = 30;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 0, this._ctx) ) {
					case 1:
						{
						this.state = 28;
						this.declaration();
						}
						break;

					case 2:
						{
						this.state = 29;
						this.functionDefinition();
						}
						break;
					}
					}
					this.state = 34;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 35;
				this.match(MyGrammarParser.EOF);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 36;
				this.error();
				this.state = 37;
				this.match(MyGrammarParser.EOF);
				this.notifyErrorListeners("Invalid input: unexpected content at the end");
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public declaration(): DeclarationContext {
		let _localctx: DeclarationContext = new DeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, MyGrammarParser.RULE_declaration);
		try {
			this.state = 49;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 3, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 42;
				this.typeSpecifier();
				this.state = 43;
				this.declaratorList();
				this.state = 44;
				this.match(MyGrammarParser.T__0);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 46;
				this.error();
				this.notifyErrorListeners("Invalid declaration structure");
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public typeSpecifier(): TypeSpecifierContext {
		let _localctx: TypeSpecifierContext = new TypeSpecifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, MyGrammarParser.RULE_typeSpecifier);
		try {
			this.state = 58;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 4, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 51;
				this.match(MyGrammarParser.T__1);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 52;
				this.match(MyGrammarParser.T__2);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 53;
				this.match(MyGrammarParser.T__3);
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 54;
				this.match(MyGrammarParser.T__4);
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 55;
				this.error();
				this.notifyErrorListeners("Invalid type specifier");
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public declaratorList(): DeclaratorListContext {
		let _localctx: DeclaratorListContext = new DeclaratorListContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, MyGrammarParser.RULE_declaratorList);
		let _la: number;
		try {
			this.state = 71;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 6, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 60;
				this.declarator();
				this.state = 65;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === MyGrammarParser.T__5) {
					{
					{
					this.state = 61;
					this.match(MyGrammarParser.T__5);
					this.state = 62;
					this.declarator();
					}
					}
					this.state = 67;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 68;
				this.error();
				this.notifyErrorListeners("Invalid declarator list");
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public declarator(): DeclaratorContext {
		let _localctx: DeclaratorContext = new DeclaratorContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, MyGrammarParser.RULE_declarator);
		try {
			this.state = 83;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 7, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 73;
				this.match(MyGrammarParser.IDENTIFIER);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 74;
				this.match(MyGrammarParser.IDENTIFIER);
				this.state = 75;
				this.match(MyGrammarParser.T__6);
				this.state = 76;
				this.match(MyGrammarParser.INT);
				this.state = 77;
				this.match(MyGrammarParser.T__7);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 78;
				this.match(MyGrammarParser.MUL);
				this.state = 79;
				this.declarator();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 80;
				this.error();
				this.notifyErrorListeners("Invalid declarator");
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public functionDefinition(): FunctionDefinitionContext {
		let _localctx: FunctionDefinitionContext = new FunctionDefinitionContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, MyGrammarParser.RULE_functionDefinition);
		try {
			this.state = 97;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 9, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 85;
				this.typeSpecifier();
				this.state = 86;
				this.match(MyGrammarParser.IDENTIFIER);
				this.state = 87;
				this.match(MyGrammarParser.LPAREN);
				this.state = 89;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 8, this._ctx) ) {
				case 1:
					{
					this.state = 88;
					this.parameterList();
					}
					break;
				}
				this.state = 91;
				this.match(MyGrammarParser.RPAREN);
				this.state = 92;
				this.compoundStatement();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 94;
				this.error();
				this.notifyErrorListeners("Invalid function definition");
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public parameterList(): ParameterListContext {
		let _localctx: ParameterListContext = new ParameterListContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, MyGrammarParser.RULE_parameterList);
		let _la: number;
		try {
			this.state = 110;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 11, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 99;
				this.parameterDeclaration();
				this.state = 104;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === MyGrammarParser.T__5) {
					{
					{
					this.state = 100;
					this.match(MyGrammarParser.T__5);
					this.state = 101;
					this.parameterDeclaration();
					}
					}
					this.state = 106;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 107;
				this.error();
					this.notifyErrorListeners("Invalid parameter list");
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public parameterDeclaration(): ParameterDeclarationContext {
		let _localctx: ParameterDeclarationContext = new ParameterDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, MyGrammarParser.RULE_parameterDeclaration);
		try {
			this.state = 118;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 12, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 112;
				this.typeSpecifier();
				this.state = 113;
				this.declarator();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 115;
				this.error();
					this.notifyErrorListeners("Invalid parameter declaration");
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public compoundStatement(): CompoundStatementContext {
		let _localctx: CompoundStatementContext = new CompoundStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, MyGrammarParser.RULE_compoundStatement);
		try {
			let _alt: number;
			this.state = 131;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 14, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 120;
				this.match(MyGrammarParser.T__8);
				this.state = 124;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 13, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 121;
						this.statement();
						}
						}
					}
					this.state = 126;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 13, this._ctx);
				}
				this.state = 127;
				this.match(MyGrammarParser.T__9);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 128;
				this.error();
					this.notifyErrorListeners("Invalid compound statement");
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public statement(): StatementContext {
		let _localctx: StatementContext = new StatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, MyGrammarParser.RULE_statement);
		try {
			this.state = 175;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 20, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 133;
				this.expr();
				this.state = 134;
				this.match(MyGrammarParser.T__0);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 136;
				this.compoundStatement();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 137;
				this.match(MyGrammarParser.T__10);
				this.state = 138;
				this.match(MyGrammarParser.LPAREN);
				this.state = 139;
				this.expr();
				this.state = 140;
				this.match(MyGrammarParser.RPAREN);
				this.state = 141;
				this.statement();
				this.state = 144;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 15, this._ctx) ) {
				case 1:
					{
					this.state = 142;
					this.match(MyGrammarParser.T__11);
					this.state = 143;
					this.statement();
					}
					break;
				}
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 146;
				this.match(MyGrammarParser.T__12);
				this.state = 147;
				this.match(MyGrammarParser.LPAREN);
				this.state = 148;
				this.expr();
				this.state = 149;
				this.match(MyGrammarParser.RPAREN);
				this.state = 150;
				this.statement();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 152;
				this.match(MyGrammarParser.T__13);
				this.state = 153;
				this.match(MyGrammarParser.LPAREN);
				this.state = 155;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 16, this._ctx) ) {
				case 1:
					{
					this.state = 154;
					this.expr();
					}
					break;
				}
				this.state = 157;
				this.match(MyGrammarParser.T__0);
				this.state = 159;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 17, this._ctx) ) {
				case 1:
					{
					this.state = 158;
					this.expr();
					}
					break;
				}
				this.state = 161;
				this.match(MyGrammarParser.T__0);
				this.state = 163;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 18, this._ctx) ) {
				case 1:
					{
					this.state = 162;
					this.expr();
					}
					break;
				}
				this.state = 165;
				this.match(MyGrammarParser.RPAREN);
				this.state = 166;
				this.statement();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 167;
				this.match(MyGrammarParser.T__14);
				this.state = 169;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 19, this._ctx) ) {
				case 1:
					{
					this.state = 168;
					this.expr();
					}
					break;
				}
				this.state = 171;
				this.match(MyGrammarParser.T__0);
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 172;
				this.error();
					this.notifyErrorListeners("Invalid statement");
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public expr(): ExprContext {
		let _localctx: ExprContext = new ExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, MyGrammarParser.RULE_expr);
		let _la: number;
		try {
			this.state = 188;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 22, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 177;
				this.term();
				this.state = 182;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === MyGrammarParser.PLUS || _la === MyGrammarParser.MINUS) {
					{
					{
					this.state = 178;
					_la = this._input.LA(1);
					if (!(_la === MyGrammarParser.PLUS || _la === MyGrammarParser.MINUS)) {
					this._errHandler.recoverInline(this);
					} else {
						if (this._input.LA(1) === Token.EOF) {
							this.matchedEOF = true;
						}

						this._errHandler.reportMatch(this);
						this.consume();
					}
					this.state = 179;
					this.term();
					}
					}
					this.state = 184;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 185;
				this.error();
					this.notifyErrorListeners("Invalid expression structure");
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public term(): TermContext {
		let _localctx: TermContext = new TermContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, MyGrammarParser.RULE_term);
		let _la: number;
		try {
			this.state = 201;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 24, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 190;
				this.factor();
				this.state = 195;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === MyGrammarParser.MUL || _la === MyGrammarParser.DIV) {
					{
					{
					this.state = 191;
					_la = this._input.LA(1);
					if (!(_la === MyGrammarParser.MUL || _la === MyGrammarParser.DIV)) {
					this._errHandler.recoverInline(this);
					} else {
						if (this._input.LA(1) === Token.EOF) {
							this.matchedEOF = true;
						}

						this._errHandler.reportMatch(this);
						this.consume();
					}
					this.state = 192;
					this.factor();
					}
					}
					this.state = 197;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 198;
				this.error();
					this.notifyErrorListeners("Invalid term structure");
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public factor(): FactorContext {
		let _localctx: FactorContext = new FactorContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, MyGrammarParser.RULE_factor);
		try {
			this.state = 212;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 25, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 203;
				this.match(MyGrammarParser.INT);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 204;
				this.match(MyGrammarParser.IDENTIFIER);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 205;
				this.match(MyGrammarParser.LPAREN);
				this.state = 206;
				this.expr();
				this.state = 207;
				this.match(MyGrammarParser.RPAREN);
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 209;
				this.error();
					this.notifyErrorListeners("Invalid factor: expected integer, identifier or parenthesized expression");
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public error(): ErrorContext {
		let _localctx: ErrorContext = new ErrorContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, MyGrammarParser.RULE_error);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 214;
			this.matchWildcard();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\x1A\xDB\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x04\x0F\t\x0F\x03\x02\x03\x02\x07\x02!\n\x02\f\x02\x0E\x02" +
		"$\v\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x05\x02+\n\x02\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x05\x034\n\x03\x03\x04" +
		"\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x05\x04=\n\x04\x03\x05" +
		"\x03\x05\x03\x05\x07\x05B\n\x05\f\x05\x0E\x05E\v\x05\x03\x05\x03\x05\x03" +
		"\x05\x05\x05J\n\x05\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03" +
		"\x06\x03\x06\x03\x06\x03\x06\x05\x06V\n\x06\x03\x07\x03\x07\x03\x07\x03" +
		"\x07\x05\x07\\\n\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x05" +
		"\x07d\n\x07\x03\b\x03\b\x03\b\x07\bi\n\b\f\b\x0E\bl\v\b\x03\b\x03\b\x03" +
		"\b\x05\bq\n\b\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x05\ty\n\t\x03\n\x03" +
		"\n\x07\n}\n\n\f\n\x0E\n\x80\v\n\x03\n\x03\n\x03\n\x03\n\x05\n\x86\n\n" +
		"\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x05" +
		"\v\x93\n\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x03\v\x05\v" +
		"\x9E\n\v\x03\v\x03\v\x05\v\xA2\n\v\x03\v\x03\v\x05\v\xA6\n\v\x03\v\x03" +
		"\v\x03\v\x03\v\x05\v\xAC\n\v\x03\v\x03\v\x03\v\x03\v\x05\v\xB2\n\v\x03" +
		"\f\x03\f\x03\f\x07\f\xB7\n\f\f\f\x0E\f\xBA\v\f\x03\f\x03\f\x03\f\x05\f" +
		"\xBF\n\f\x03\r\x03\r\x03\r\x07\r\xC4\n\r\f\r\x0E\r\xC7\v\r\x03\r\x03\r" +
		"\x03\r\x05\r\xCC\n\r\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x03" +
		"\x0E\x03\x0E\x03\x0E\x05\x0E\xD7\n\x0E\x03\x0F\x03\x0F\x03\x0F\x02\x02" +
		"\x02\x10\x02\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02\x0E\x02\x10\x02\x12" +
		"\x02\x14\x02\x16\x02\x18\x02\x1A\x02\x1C\x02\x02\x04\x03\x02\x12\x13\x03" +
		"\x02\x14\x15\x02\xF2\x02*\x03\x02\x02\x02\x043\x03\x02\x02\x02\x06<\x03" +
		"\x02\x02\x02\bI\x03\x02\x02\x02\nU\x03\x02\x02\x02\fc\x03\x02\x02\x02" +
		"\x0Ep\x03\x02\x02\x02\x10x\x03\x02\x02\x02\x12\x85\x03\x02\x02\x02\x14" +
		"\xB1\x03\x02\x02\x02\x16\xBE\x03\x02\x02\x02\x18\xCB\x03\x02\x02\x02\x1A" +
		"\xD6\x03\x02\x02\x02\x1C\xD8\x03\x02\x02\x02\x1E!\x05\x04\x03\x02\x1F" +
		"!\x05\f\x07\x02 \x1E\x03\x02\x02\x02 \x1F\x03\x02\x02\x02!$\x03\x02\x02" +
		"\x02\" \x03\x02\x02\x02\"#\x03\x02\x02\x02#%\x03\x02\x02\x02$\"\x03\x02" +
		"\x02\x02%+\x07\x02\x02\x03&\'\x05\x1C\x0F\x02\'(\x07\x02\x02\x03()\b\x02" +
		"\x01\x02)+\x03\x02\x02\x02*\"\x03\x02\x02\x02*&\x03\x02\x02\x02+\x03\x03" +
		"\x02\x02\x02,-\x05\x06\x04\x02-.\x05\b\x05\x02./\x07\x03\x02\x02/4\x03" +
		"\x02\x02\x0201\x05\x1C\x0F\x0212\b\x03\x01\x0224\x03\x02\x02\x023,\x03" +
		"\x02\x02\x0230\x03\x02\x02\x024\x05\x03\x02\x02\x025=\x07\x04\x02\x02" +
		"6=\x07\x05\x02\x027=\x07\x06\x02\x028=\x07\x07\x02\x029:\x05\x1C\x0F\x02" +
		":;\b\x04\x01\x02;=\x03\x02\x02\x02<5\x03\x02\x02\x02<6\x03\x02\x02\x02" +
		"<7\x03\x02\x02\x02<8\x03\x02\x02\x02<9\x03\x02\x02\x02=\x07\x03\x02\x02" +
		"\x02>C\x05\n\x06\x02?@\x07\b\x02\x02@B\x05\n\x06\x02A?\x03\x02\x02\x02" +
		"BE\x03\x02\x02\x02CA\x03\x02\x02\x02CD\x03\x02\x02\x02DJ\x03\x02\x02\x02" +
		"EC\x03\x02\x02\x02FG\x05\x1C\x0F\x02GH\b\x05\x01\x02HJ\x03\x02\x02\x02" +
		"I>\x03\x02\x02\x02IF\x03\x02\x02\x02J\t\x03\x02\x02\x02KV\x07\x19\x02" +
		"\x02LM\x07\x19\x02\x02MN\x07\t\x02\x02NO\x07\x18\x02\x02OV\x07\n\x02\x02" +
		"PQ\x07\x14\x02\x02QV\x05\n\x06\x02RS\x05\x1C\x0F\x02ST\b\x06\x01\x02T" +
		"V\x03\x02\x02\x02UK\x03\x02\x02\x02UL\x03\x02\x02\x02UP\x03\x02\x02\x02" +
		"UR\x03\x02\x02\x02V\v\x03\x02\x02\x02WX\x05\x06\x04\x02XY\x07\x19\x02" +
		"\x02Y[\x07\x16\x02\x02Z\\\x05\x0E\b\x02[Z\x03\x02\x02\x02[\\\x03\x02\x02" +
		"\x02\\]\x03\x02\x02\x02]^\x07\x17\x02\x02^_\x05\x12\n\x02_d\x03\x02\x02" +
		"\x02`a\x05\x1C\x0F\x02ab\b\x07\x01\x02bd\x03\x02\x02\x02cW\x03\x02\x02" +
		"\x02c`\x03\x02\x02\x02d\r\x03\x02\x02\x02ej\x05\x10\t\x02fg\x07\b\x02" +
		"\x02gi\x05\x10\t\x02hf\x03\x02\x02\x02il\x03\x02\x02\x02jh\x03\x02\x02" +
		"\x02jk\x03\x02\x02\x02kq\x03\x02\x02\x02lj\x03\x02\x02\x02mn\x05\x1C\x0F" +
		"\x02no\b\b\x01\x02oq\x03\x02\x02\x02pe\x03\x02\x02\x02pm\x03\x02\x02\x02" +
		"q\x0F\x03\x02\x02\x02rs\x05\x06\x04\x02st\x05\n\x06\x02ty\x03\x02\x02" +
		"\x02uv\x05\x1C\x0F\x02vw\b\t\x01\x02wy\x03\x02\x02\x02xr\x03\x02\x02\x02" +
		"xu\x03\x02\x02\x02y\x11\x03\x02\x02\x02z~\x07\v\x02\x02{}\x05\x14\v\x02" +
		"|{\x03\x02\x02\x02}\x80\x03\x02\x02\x02~|\x03\x02\x02\x02~\x7F\x03\x02" +
		"\x02\x02\x7F\x81\x03\x02\x02\x02\x80~\x03\x02\x02\x02\x81\x86\x07\f\x02" +
		"\x02\x82\x83\x05\x1C\x0F\x02\x83\x84\b\n\x01\x02\x84\x86\x03\x02\x02\x02" +
		"\x85z\x03\x02\x02\x02\x85\x82\x03\x02\x02\x02\x86\x13\x03\x02\x02\x02" +
		"\x87\x88\x05\x16\f\x02\x88\x89\x07\x03\x02\x02\x89\xB2\x03\x02\x02\x02" +
		"\x8A\xB2\x05\x12\n\x02\x8B\x8C\x07\r\x02\x02\x8C\x8D\x07\x16\x02\x02\x8D" +
		"\x8E\x05\x16\f\x02\x8E\x8F\x07\x17\x02\x02\x8F\x92\x05\x14\v\x02\x90\x91" +
		"\x07\x0E\x02\x02\x91\x93\x05\x14\v\x02\x92\x90\x03\x02\x02\x02\x92\x93" +
		"\x03\x02\x02\x02\x93\xB2\x03\x02\x02\x02\x94\x95\x07\x0F\x02\x02\x95\x96" +
		"\x07\x16\x02\x02\x96\x97\x05\x16\f\x02\x97\x98\x07\x17\x02\x02\x98\x99" +
		"\x05\x14\v\x02\x99\xB2\x03\x02\x02\x02\x9A\x9B\x07\x10\x02\x02\x9B\x9D" +
		"\x07\x16\x02\x02\x9C\x9E\x05\x16\f\x02\x9D\x9C\x03\x02\x02\x02\x9D\x9E" +
		"\x03\x02\x02\x02\x9E\x9F\x03\x02\x02\x02\x9F\xA1\x07\x03\x02\x02\xA0\xA2" +
		"\x05\x16\f\x02\xA1\xA0\x03\x02\x02\x02\xA1\xA2\x03\x02\x02\x02\xA2\xA3" +
		"\x03\x02\x02\x02\xA3\xA5\x07\x03\x02\x02\xA4\xA6\x05\x16\f\x02\xA5\xA4" +
		"\x03\x02\x02\x02\xA5\xA6\x03\x02\x02\x02\xA6\xA7\x03\x02\x02\x02\xA7\xA8" +
		"\x07\x17\x02\x02\xA8\xB2\x05\x14\v\x02\xA9\xAB\x07\x11\x02\x02\xAA\xAC" +
		"\x05\x16\f\x02\xAB\xAA\x03\x02\x02\x02\xAB\xAC\x03\x02\x02\x02\xAC\xAD" +
		"\x03\x02\x02\x02\xAD\xB2\x07\x03\x02\x02\xAE\xAF\x05\x1C\x0F\x02\xAF\xB0" +
		"\b\v\x01\x02\xB0\xB2\x03\x02\x02\x02\xB1\x87\x03\x02\x02\x02\xB1\x8A\x03" +
		"\x02\x02\x02\xB1\x8B\x03\x02\x02\x02\xB1\x94\x03\x02\x02\x02\xB1\x9A\x03" +
		"\x02\x02\x02\xB1\xA9\x03\x02\x02\x02\xB1\xAE\x03\x02\x02\x02\xB2\x15\x03" +
		"\x02\x02\x02\xB3\xB8\x05\x18\r\x02\xB4\xB5\t\x02\x02\x02\xB5\xB7\x05\x18" +
		"\r\x02\xB6\xB4\x03\x02\x02\x02\xB7\xBA\x03\x02\x02\x02\xB8\xB6\x03\x02" +
		"\x02\x02\xB8\xB9\x03\x02\x02\x02\xB9\xBF\x03\x02\x02\x02\xBA\xB8\x03\x02" +
		"\x02\x02\xBB\xBC\x05\x1C\x0F\x02\xBC\xBD\b\f\x01\x02\xBD\xBF\x03\x02\x02" +
		"\x02\xBE\xB3\x03\x02\x02\x02\xBE\xBB\x03\x02\x02\x02\xBF\x17\x03\x02\x02" +
		"\x02\xC0\xC5\x05\x1A\x0E\x02\xC1\xC2\t\x03\x02\x02\xC2\xC4\x05\x1A\x0E" +
		"\x02\xC3\xC1\x03\x02\x02\x02\xC4\xC7\x03\x02\x02\x02\xC5\xC3\x03\x02\x02" +
		"\x02\xC5\xC6\x03\x02\x02\x02\xC6\xCC\x03\x02\x02\x02\xC7\xC5\x03\x02\x02" +
		"\x02\xC8\xC9\x05\x1C\x0F\x02\xC9\xCA\b\r\x01\x02\xCA\xCC\x03\x02\x02\x02" +
		"\xCB\xC0\x03\x02\x02\x02\xCB\xC8\x03\x02\x02\x02\xCC\x19\x03\x02\x02\x02" +
		"\xCD\xD7\x07\x18\x02\x02\xCE\xD7\x07\x19\x02\x02\xCF\xD0\x07\x16\x02\x02" +
		"\xD0\xD1\x05\x16\f\x02\xD1\xD2\x07\x17\x02\x02\xD2\xD7\x03\x02\x02\x02" +
		"\xD3\xD4\x05\x1C\x0F\x02\xD4\xD5\b\x0E\x01\x02\xD5\xD7\x03\x02\x02\x02" +
		"\xD6\xCD\x03\x02\x02\x02\xD6\xCE\x03\x02\x02\x02\xD6\xCF\x03\x02\x02\x02" +
		"\xD6\xD3\x03\x02\x02\x02\xD7\x1B\x03\x02\x02\x02\xD8\xD9\v\x02\x02\x02" +
		"\xD9\x1D\x03\x02\x02\x02\x1C \"*3<CIU[cjpx~\x85\x92\x9D\xA1\xA5\xAB\xB1" +
		"\xB8\xBE\xC5\xCB\xD6";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!MyGrammarParser.__ATN) {
			MyGrammarParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(MyGrammarParser._serializedATN));
		}

		return MyGrammarParser.__ATN;
	}

}

export class ProgContext extends ParserRuleContext {
	public EOF(): TerminalNode { return this.getToken(MyGrammarParser.EOF, 0); }
	public declaration(): DeclarationContext[];
	public declaration(i: number): DeclarationContext;
	public declaration(i?: number): DeclarationContext | DeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DeclarationContext);
		} else {
			return this.getRuleContext(i, DeclarationContext);
		}
	}
	public functionDefinition(): FunctionDefinitionContext[];
	public functionDefinition(i: number): FunctionDefinitionContext;
	public functionDefinition(i?: number): FunctionDefinitionContext | FunctionDefinitionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(FunctionDefinitionContext);
		} else {
			return this.getRuleContext(i, FunctionDefinitionContext);
		}
	}
	public error(): ErrorContext | undefined {
		return this.tryGetRuleContext(0, ErrorContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MyGrammarParser.RULE_prog; }
	// @Override
	public enterRule(listener: MyGrammarListener): void {
		if (listener.enterProg) {
			listener.enterProg(this);
		}
	}
	// @Override
	public exitRule(listener: MyGrammarListener): void {
		if (listener.exitProg) {
			listener.exitProg(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MyGrammarVisitor<Result>): Result {
		if (visitor.visitProg) {
			return visitor.visitProg(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DeclarationContext extends ParserRuleContext {
	public typeSpecifier(): TypeSpecifierContext | undefined {
		return this.tryGetRuleContext(0, TypeSpecifierContext);
	}
	public declaratorList(): DeclaratorListContext | undefined {
		return this.tryGetRuleContext(0, DeclaratorListContext);
	}
	public error(): ErrorContext | undefined {
		return this.tryGetRuleContext(0, ErrorContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MyGrammarParser.RULE_declaration; }
	// @Override
	public enterRule(listener: MyGrammarListener): void {
		if (listener.enterDeclaration) {
			listener.enterDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: MyGrammarListener): void {
		if (listener.exitDeclaration) {
			listener.exitDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MyGrammarVisitor<Result>): Result {
		if (visitor.visitDeclaration) {
			return visitor.visitDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeSpecifierContext extends ParserRuleContext {
	public error(): ErrorContext | undefined {
		return this.tryGetRuleContext(0, ErrorContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MyGrammarParser.RULE_typeSpecifier; }
	// @Override
	public enterRule(listener: MyGrammarListener): void {
		if (listener.enterTypeSpecifier) {
			listener.enterTypeSpecifier(this);
		}
	}
	// @Override
	public exitRule(listener: MyGrammarListener): void {
		if (listener.exitTypeSpecifier) {
			listener.exitTypeSpecifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MyGrammarVisitor<Result>): Result {
		if (visitor.visitTypeSpecifier) {
			return visitor.visitTypeSpecifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DeclaratorListContext extends ParserRuleContext {
	public declarator(): DeclaratorContext[];
	public declarator(i: number): DeclaratorContext;
	public declarator(i?: number): DeclaratorContext | DeclaratorContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DeclaratorContext);
		} else {
			return this.getRuleContext(i, DeclaratorContext);
		}
	}
	public error(): ErrorContext | undefined {
		return this.tryGetRuleContext(0, ErrorContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MyGrammarParser.RULE_declaratorList; }
	// @Override
	public enterRule(listener: MyGrammarListener): void {
		if (listener.enterDeclaratorList) {
			listener.enterDeclaratorList(this);
		}
	}
	// @Override
	public exitRule(listener: MyGrammarListener): void {
		if (listener.exitDeclaratorList) {
			listener.exitDeclaratorList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MyGrammarVisitor<Result>): Result {
		if (visitor.visitDeclaratorList) {
			return visitor.visitDeclaratorList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DeclaratorContext extends ParserRuleContext {
	public IDENTIFIER(): TerminalNode | undefined { return this.tryGetToken(MyGrammarParser.IDENTIFIER, 0); }
	public INT(): TerminalNode | undefined { return this.tryGetToken(MyGrammarParser.INT, 0); }
	public MUL(): TerminalNode | undefined { return this.tryGetToken(MyGrammarParser.MUL, 0); }
	public declarator(): DeclaratorContext | undefined {
		return this.tryGetRuleContext(0, DeclaratorContext);
	}
	public error(): ErrorContext | undefined {
		return this.tryGetRuleContext(0, ErrorContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MyGrammarParser.RULE_declarator; }
	// @Override
	public enterRule(listener: MyGrammarListener): void {
		if (listener.enterDeclarator) {
			listener.enterDeclarator(this);
		}
	}
	// @Override
	public exitRule(listener: MyGrammarListener): void {
		if (listener.exitDeclarator) {
			listener.exitDeclarator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MyGrammarVisitor<Result>): Result {
		if (visitor.visitDeclarator) {
			return visitor.visitDeclarator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionDefinitionContext extends ParserRuleContext {
	public typeSpecifier(): TypeSpecifierContext | undefined {
		return this.tryGetRuleContext(0, TypeSpecifierContext);
	}
	public IDENTIFIER(): TerminalNode | undefined { return this.tryGetToken(MyGrammarParser.IDENTIFIER, 0); }
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(MyGrammarParser.LPAREN, 0); }
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(MyGrammarParser.RPAREN, 0); }
	public compoundStatement(): CompoundStatementContext | undefined {
		return this.tryGetRuleContext(0, CompoundStatementContext);
	}
	public parameterList(): ParameterListContext | undefined {
		return this.tryGetRuleContext(0, ParameterListContext);
	}
	public error(): ErrorContext | undefined {
		return this.tryGetRuleContext(0, ErrorContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MyGrammarParser.RULE_functionDefinition; }
	// @Override
	public enterRule(listener: MyGrammarListener): void {
		if (listener.enterFunctionDefinition) {
			listener.enterFunctionDefinition(this);
		}
	}
	// @Override
	public exitRule(listener: MyGrammarListener): void {
		if (listener.exitFunctionDefinition) {
			listener.exitFunctionDefinition(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MyGrammarVisitor<Result>): Result {
		if (visitor.visitFunctionDefinition) {
			return visitor.visitFunctionDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParameterListContext extends ParserRuleContext {
	public parameterDeclaration(): ParameterDeclarationContext[];
	public parameterDeclaration(i: number): ParameterDeclarationContext;
	public parameterDeclaration(i?: number): ParameterDeclarationContext | ParameterDeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ParameterDeclarationContext);
		} else {
			return this.getRuleContext(i, ParameterDeclarationContext);
		}
	}
	public error(): ErrorContext | undefined {
		return this.tryGetRuleContext(0, ErrorContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MyGrammarParser.RULE_parameterList; }
	// @Override
	public enterRule(listener: MyGrammarListener): void {
		if (listener.enterParameterList) {
			listener.enterParameterList(this);
		}
	}
	// @Override
	public exitRule(listener: MyGrammarListener): void {
		if (listener.exitParameterList) {
			listener.exitParameterList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MyGrammarVisitor<Result>): Result {
		if (visitor.visitParameterList) {
			return visitor.visitParameterList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParameterDeclarationContext extends ParserRuleContext {
	public typeSpecifier(): TypeSpecifierContext | undefined {
		return this.tryGetRuleContext(0, TypeSpecifierContext);
	}
	public declarator(): DeclaratorContext | undefined {
		return this.tryGetRuleContext(0, DeclaratorContext);
	}
	public error(): ErrorContext | undefined {
		return this.tryGetRuleContext(0, ErrorContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MyGrammarParser.RULE_parameterDeclaration; }
	// @Override
	public enterRule(listener: MyGrammarListener): void {
		if (listener.enterParameterDeclaration) {
			listener.enterParameterDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: MyGrammarListener): void {
		if (listener.exitParameterDeclaration) {
			listener.exitParameterDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MyGrammarVisitor<Result>): Result {
		if (visitor.visitParameterDeclaration) {
			return visitor.visitParameterDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CompoundStatementContext extends ParserRuleContext {
	public statement(): StatementContext[];
	public statement(i: number): StatementContext;
	public statement(i?: number): StatementContext | StatementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(StatementContext);
		} else {
			return this.getRuleContext(i, StatementContext);
		}
	}
	public error(): ErrorContext | undefined {
		return this.tryGetRuleContext(0, ErrorContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MyGrammarParser.RULE_compoundStatement; }
	// @Override
	public enterRule(listener: MyGrammarListener): void {
		if (listener.enterCompoundStatement) {
			listener.enterCompoundStatement(this);
		}
	}
	// @Override
	public exitRule(listener: MyGrammarListener): void {
		if (listener.exitCompoundStatement) {
			listener.exitCompoundStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MyGrammarVisitor<Result>): Result {
		if (visitor.visitCompoundStatement) {
			return visitor.visitCompoundStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StatementContext extends ParserRuleContext {
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	public compoundStatement(): CompoundStatementContext | undefined {
		return this.tryGetRuleContext(0, CompoundStatementContext);
	}
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(MyGrammarParser.LPAREN, 0); }
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(MyGrammarParser.RPAREN, 0); }
	public statement(): StatementContext[];
	public statement(i: number): StatementContext;
	public statement(i?: number): StatementContext | StatementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(StatementContext);
		} else {
			return this.getRuleContext(i, StatementContext);
		}
	}
	public error(): ErrorContext | undefined {
		return this.tryGetRuleContext(0, ErrorContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MyGrammarParser.RULE_statement; }
	// @Override
	public enterRule(listener: MyGrammarListener): void {
		if (listener.enterStatement) {
			listener.enterStatement(this);
		}
	}
	// @Override
	public exitRule(listener: MyGrammarListener): void {
		if (listener.exitStatement) {
			listener.exitStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MyGrammarVisitor<Result>): Result {
		if (visitor.visitStatement) {
			return visitor.visitStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExprContext extends ParserRuleContext {
	public term(): TermContext[];
	public term(i: number): TermContext;
	public term(i?: number): TermContext | TermContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TermContext);
		} else {
			return this.getRuleContext(i, TermContext);
		}
	}
	public PLUS(): TerminalNode[];
	public PLUS(i: number): TerminalNode;
	public PLUS(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(MyGrammarParser.PLUS);
		} else {
			return this.getToken(MyGrammarParser.PLUS, i);
		}
	}
	public MINUS(): TerminalNode[];
	public MINUS(i: number): TerminalNode;
	public MINUS(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(MyGrammarParser.MINUS);
		} else {
			return this.getToken(MyGrammarParser.MINUS, i);
		}
	}
	public error(): ErrorContext | undefined {
		return this.tryGetRuleContext(0, ErrorContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MyGrammarParser.RULE_expr; }
	// @Override
	public enterRule(listener: MyGrammarListener): void {
		if (listener.enterExpr) {
			listener.enterExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MyGrammarListener): void {
		if (listener.exitExpr) {
			listener.exitExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MyGrammarVisitor<Result>): Result {
		if (visitor.visitExpr) {
			return visitor.visitExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TermContext extends ParserRuleContext {
	public factor(): FactorContext[];
	public factor(i: number): FactorContext;
	public factor(i?: number): FactorContext | FactorContext[] {
		if (i === undefined) {
			return this.getRuleContexts(FactorContext);
		} else {
			return this.getRuleContext(i, FactorContext);
		}
	}
	public MUL(): TerminalNode[];
	public MUL(i: number): TerminalNode;
	public MUL(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(MyGrammarParser.MUL);
		} else {
			return this.getToken(MyGrammarParser.MUL, i);
		}
	}
	public DIV(): TerminalNode[];
	public DIV(i: number): TerminalNode;
	public DIV(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(MyGrammarParser.DIV);
		} else {
			return this.getToken(MyGrammarParser.DIV, i);
		}
	}
	public error(): ErrorContext | undefined {
		return this.tryGetRuleContext(0, ErrorContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MyGrammarParser.RULE_term; }
	// @Override
	public enterRule(listener: MyGrammarListener): void {
		if (listener.enterTerm) {
			listener.enterTerm(this);
		}
	}
	// @Override
	public exitRule(listener: MyGrammarListener): void {
		if (listener.exitTerm) {
			listener.exitTerm(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MyGrammarVisitor<Result>): Result {
		if (visitor.visitTerm) {
			return visitor.visitTerm(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FactorContext extends ParserRuleContext {
	public INT(): TerminalNode | undefined { return this.tryGetToken(MyGrammarParser.INT, 0); }
	public IDENTIFIER(): TerminalNode | undefined { return this.tryGetToken(MyGrammarParser.IDENTIFIER, 0); }
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(MyGrammarParser.LPAREN, 0); }
	public expr(): ExprContext | undefined {
		return this.tryGetRuleContext(0, ExprContext);
	}
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(MyGrammarParser.RPAREN, 0); }
	public error(): ErrorContext | undefined {
		return this.tryGetRuleContext(0, ErrorContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MyGrammarParser.RULE_factor; }
	// @Override
	public enterRule(listener: MyGrammarListener): void {
		if (listener.enterFactor) {
			listener.enterFactor(this);
		}
	}
	// @Override
	public exitRule(listener: MyGrammarListener): void {
		if (listener.exitFactor) {
			listener.exitFactor(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MyGrammarVisitor<Result>): Result {
		if (visitor.visitFactor) {
			return visitor.visitFactor(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ErrorContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MyGrammarParser.RULE_error; }
	// @Override
	public enterRule(listener: MyGrammarListener): void {
		if (listener.enterError) {
			listener.enterError(this);
		}
	}
	// @Override
	public exitRule(listener: MyGrammarListener): void {
		if (listener.exitError) {
			listener.exitError(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MyGrammarVisitor<Result>): Result {
		if (visitor.visitError) {
			return visitor.visitError(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


