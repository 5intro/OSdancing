//grammar MyGrammar;
//expr: term ((PLUS | MINUS) term)* ;
//term: factor ((MUL | DIV) factor)* ;
//factor: INT | LPAREN expr RPAREN ;
//prog:   expr EOF;
//
//PLUS: '+' ;
//MINUS: '-' ;
//MUL: '*' ;
//DIV: '/' ;
//LPAREN: '(' ;
//RPAREN: ')' ;
//INT: [0-9]+ ;
//WS: [ \t\r\n]+ -> skip ;

grammar MyGrammar;

// 主规则，匹配表达式并要求以文件结束符结尾
prog:   expr EOF
      | error EOF {notifyErrorListeners("Invalid input: unexpected content at the end");}
      ;

// 表达式规则，由多个项通过加减运算符连接
expr: term ((PLUS | MINUS) term)*
    | error {notifyErrorListeners("Invalid expression structure");}
    ;

// 项规则，由多个因子通过乘除运算符连接
term: factor ((MUL | DIV) factor)*
    | error {notifyErrorListeners("Invalid term structure");}
    ;

// 因子规则，可以是整数或者括号括起来的表达式
factor: INT
      | LPAREN expr RPAREN
      | error {notifyErrorListeners("Invalid factor: expected integer or parenthesized expression");}
      ;

// 错误规则，匹配任意单个字符，用于捕获非预期输入
error: . ;

// 运算符和符号的词法规则
PLUS: '+' ;
MINUS: '-' ;
MUL: '*' ;
DIV: '/' ;
LPAREN: '(' ;
RPAREN: ')' ;

// 整数词法规则，匹配一个或多个数字
INT: [0-9]+ ;

// 空白字符词法规则，匹配空格、制表符、回车和换行符并跳过
WS: [ \t\r\n]+ -> skip ;