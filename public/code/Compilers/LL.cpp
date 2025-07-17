push #E;//指针ip指向串w#的第一个符号
repeat
    令X为栈顶符号，a为ip所指符号；
    if X为终结符或#   then
        if X=a=# then 接收w
        else if X=a!=# then 弹出X，并使ip前进
        else error;
    else  //X为非终结符
        if M[X,a]=X->Y1Y2...YK then begin
            弹出X；
            push Yk,...,Y2,Y1;  //Y1在栈顶
        end；
    else
        error；
until X=#;  //栈为空