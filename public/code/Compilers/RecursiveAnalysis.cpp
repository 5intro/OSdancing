# 解析表达式：表达式 = 项 { ( '+' | '-' ) 项 }*
void parse_expression(input, current_index)
    result = parse_term(input, current_index)
    while current_token.type in [PLUS, MINUS]
        op = current_token.type
        if op == PLUS
            consume(PLUS, "Expected '+'")
            result += parse_term(input, current_index)
        else
            consume(MINUS, "Expected '-'")
            result -= parse_term(input, current_index)
    return result

# 解析项：项 = 因子 { ( '*' | '/' ) 因子 }*
function parse_term(input, current_index)
    result = parse_factor(input, current_index)
    while current_token.type in [MULT, DIV]
        op = current_token.type
        if op == MULT
            consume(MULT, "Expected '*'")
            result *= parse_factor(input, current_index)
        else
            consume(DIV, "Expected '/'")
            divisor = parse_factor(input, current_index)
            if divisor == 0
                error("Division by zero")
            result /= divisor
    return result

# 解析因子：因子 = 数字 | '(' 表达式 ')'
function parse_factor(input, current_index)
    if current_token.type == NUMBER
        value = current_token.value
        consume(NUMBER, "Expected NUMBER")
        return value
    else if current_token.type == LPAREN
        consume(LPAREN, "Expected '('")
        result = parse_expression(input, current_index)
        consume(RPAREN, "Expected ')'")
        return result
    error("Expected NUMBER or '('")
    return 0

# 主程序
// input = "3 + 5 * (10 - 2)"
// current_index = 0
// current_token = get_next_token(input, current_index)
// result = parse_expression(input, current_index)
// print("Result: ", result)
/*
// 解析表达式：表达式 = 项 { ( '+' | '-' ) 项 }*
double parse_expression(const char* input, int* current_index) {
    double result = parse_term(input, current_index);
    while (current_token.type == PLUS || current_token.type == MINUS) {
        TokenType op = current_token.type;
        if (op == PLUS) {
            consume(PLUS, "Expected '+'");
            result += parse_term(input, current_index);
        } else {
            consume(MINUS, "Expected '-'");
            result -= parse_term(input, current_index);
        }
    }
    return result;
}

// 解析项：项 = 因子 { ( '*' | '/' ) 因子 }*
double parse_term(const char* input, int* current_index) {
    double result = parse_factor(input, current_index);
    while (current_token.type == MULT || current_token.type == DIV) {
        TokenType op = current_token.type;
        if (op == MULT) {
            consume(MULT, "Expected '*'");
            result *= parse_factor(input, current_index);
        } else {
            consume(DIV, "Expected '/'");
            double divisor = parse_factor(input, current_index);
            if (divisor == 0) {
                error("Division by zero");
            }
            result /= divisor;
        }
    }
    return result;
}

// 解析因子：因子 = 数字 | '(' 表达式 ')'
double parse_factor(const char* input, int* current_index) {
    if (current_token.type == NUMBER) {
        double value = current_token.value;
        consume(NUMBER, "Expected NUMBER");
        return value;
    } else if (current_token.type == LPAREN) {
        consume(LPAREN, "Expected '('");
        double result = parse_expression(input, current_index);
        consume(RPAREN, "Expected ')'");
        return result;
    } else {
        error("Expected NUMBER or '('");
    }
    return 0; // 不会到达这里
}

int main() {
    const char* input = "3 + 5 * (10 - 2)";
    int current_index = 0;
    current_token = get_next_token(input, &current_index);
    double result = parse_expression(input, &current_index);
    printf("Result: %f\n", result);
    return 0;
}
*/