import { CharStreams, CommonTokenStream } from 'antlr4ts';
// 假设MyGrammarParser已经生成
import { MyGrammarParser } from './antlr/MyGrammarParser';
import {MyGrammarLexer} from "./antlr/MyGrammarLexer";

import { ParserErrorListener, RecognitionException, Recognizer } from 'antlr4ts';

// 自定义错误监听器
class CustomErrorListener implements ParserErrorListener {
  private errorMessages: string[] = [];

  // 获取所有错误信息
  getErrorMessages() {
    return this.errorMessages;
  }

  // 重写 syntaxError 方法，捕获错误信息
  public syntaxError<T>(
      recognizer: Recognizer<T, any>,
      offendingSymbol: T | undefined,
      line: number,
      charPositionInLine: number,
      msg: string,
      e: RecognitionException | undefined
  ): void {
    const errorMessage = `Syntax error at line ${line}, position ${charPositionInLine}: ${msg}`;
    this.errorMessages.push(errorMessage);
  }
}

export function parse(input: string) {
  try{
    const chars = CharStreams.fromString(input);
    const lexer = new MyGrammarLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new MyGrammarParser(tokens);

    const tree = parser.expr(); // 从根节点开始解析
    // return tree.toStringTree(parser.ruleNames);

    const errorListener = new CustomErrorListener();
    // 移除默认的错误监听器
    parser.removeErrorListeners();
    // 添加自定义错误监听器
    parser.addErrorListener(errorListener);

    // const tree = parser.prog();
    const errorMessages = errorListener.getErrorMessages();

    if (errorMessages.length > 0) {
      // 如果有错误信息，返回错误信息数组
      return { success: false, errors: errorMessages };
    }
    // 解析成功，返回语法树
    return { success: true, tree };
  } catch (error) {
    // 发生异常，返回错误信息
    return { success: false, errors: [true] };
  }

  // const dfa = lexer.getDFA();

    // console.log(dfa);
}

// const input = "3 + 5 * (10 - 4)";
// parse(input);