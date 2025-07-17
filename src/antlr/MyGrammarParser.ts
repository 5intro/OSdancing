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
	public static readonly PLUS = 1;
	public static readonly MINUS = 2;
	public static readonly MUL = 3;
	public static readonly DIV = 4;
	public static readonly LPAREN = 5;
	public static readonly RPAREN = 6;
	public static readonly INT = 7;
	public static readonly WS = 8;
	public static readonly RULE_expr = 0;
	public static readonly RULE_term = 1;
	public static readonly RULE_factor = 2;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"expr", "term", "factor",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'+'", "'-'", "'*'", "'/'", "'('", "')'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "PLUS", "MINUS", "MUL", "DIV", "LPAREN", "RPAREN", "INT", "WS",
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
	public expr(): ExprContext {
		let _localctx: ExprContext = new ExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, MyGrammarParser.RULE_expr);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 6;
			this.term();
			this.state = 11;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === MyGrammarParser.PLUS || _la === MyGrammarParser.MINUS) {
				{
				{
				this.state = 7;
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
				this.state = 8;
				this.term();
				}
				}
				this.state = 13;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
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
		this.enterRule(_localctx, 2, MyGrammarParser.RULE_term);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 14;
			this.factor();
			this.state = 19;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === MyGrammarParser.MUL || _la === MyGrammarParser.DIV) {
				{
				{
				this.state = 15;
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
				this.state = 16;
				this.factor();
				}
				}
				this.state = 21;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
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
		this.enterRule(_localctx, 4, MyGrammarParser.RULE_factor);
		try {
			this.state = 27;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MyGrammarParser.INT:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 22;
				this.match(MyGrammarParser.INT);
				}
				break;
			case MyGrammarParser.LPAREN:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 23;
				this.match(MyGrammarParser.LPAREN);
				this.state = 24;
				this.expr();
				this.state = 25;
				this.match(MyGrammarParser.RPAREN);
				}
				break;
			default:
				throw new NoViableAltException(this);
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
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\n \x04\x02\t" +
		"\x02\x04\x03\t\x03\x04\x04\t\x04\x03\x02\x03\x02\x03\x02\x07\x02\f\n\x02" +
		"\f\x02\x0E\x02\x0F\v\x02\x03\x03\x03\x03\x03\x03\x07\x03\x14\n\x03\f\x03" +
		"\x0E\x03\x17\v\x03\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x05\x04\x1E" +
		"\n\x04\x03\x04\x02\x02\x02\x05\x02\x02\x04\x02\x06\x02\x02\x04\x03\x02" +
		"\x03\x04\x03\x02\x05\x06\x02\x1F\x02\b\x03\x02\x02\x02\x04\x10\x03\x02" +
		"\x02\x02\x06\x1D\x03\x02\x02\x02\b\r\x05\x04\x03\x02\t\n\t\x02\x02\x02" +
		"\n\f\x05\x04\x03\x02\v\t\x03\x02\x02\x02\f\x0F\x03\x02\x02\x02\r\v\x03" +
		"\x02\x02\x02\r\x0E\x03\x02\x02\x02\x0E\x03\x03\x02\x02\x02\x0F\r\x03\x02" +
		"\x02\x02\x10\x15\x05\x06\x04\x02\x11\x12\t\x03\x02\x02\x12\x14\x05\x06" +
		"\x04\x02\x13\x11\x03\x02\x02\x02\x14\x17\x03\x02\x02\x02\x15\x13\x03\x02" +
		"\x02\x02\x15\x16\x03\x02\x02\x02\x16\x05\x03\x02\x02\x02\x17\x15\x03\x02" +
		"\x02\x02\x18\x1E\x07\t\x02\x02\x19\x1A\x07\x07\x02\x02\x1A\x1B\x05\x02" +
		"\x02\x02\x1B\x1C\x07\b\x02\x02\x1C\x1E\x03\x02\x02\x02\x1D\x18\x03\x02" +
		"\x02\x02\x1D\x19\x03\x02\x02\x02\x1E\x07\x03\x02\x02\x02\x05\r\x15\x1D";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!MyGrammarParser.__ATN) {
			MyGrammarParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(MyGrammarParser._serializedATN));
		}

		return MyGrammarParser.__ATN;
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
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(MyGrammarParser.LPAREN, 0); }
	public expr(): ExprContext | undefined {
		return this.tryGetRuleContext(0, ExprContext);
	}
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(MyGrammarParser.RPAREN, 0); }
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


