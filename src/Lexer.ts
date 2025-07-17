import { CharStreams, CommonTokenStream } from 'antlr4ts';
// 假设MyGrammarParser已经生成
import { MyGrammarParser } from './antlr/program/MyGrammarParser';
import {MyGrammarLexer} from "./antlr/MyGrammarLexer";

export function Lexer(input: string) {
    const inputStream1 = CharStreams.fromString(input);
    // 创建词法分析器
    const lexer1 = new MyGrammarLexer(inputStream1);
    // 创建 token 流
    const tokenStream1 = new CommonTokenStream(lexer1);
    // 填充 token 流
    tokenStream1.fill();
    // 返回 token 数组
    const tokenArray = tokenStream1.getTokens();
// 输出每个 token 的信息
//     tokenArray.forEach((token, index) => {
//         console.log(`Token ${index + 1}: Type - ${token.type}, Text - ${token.text}`);
//     });
    return tokenArray;
}
