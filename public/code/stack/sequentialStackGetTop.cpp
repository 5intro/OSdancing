#include<iostream>
using namespace std;
#include<stdlib.h>

//顺序栈定义
#define OK 1
#define ERROR 0
#define OVERFLOW -2
#define MAXSIZE  100
typedef int Status;
typedef int SElemType;
typedef struct{
	SElemType *base;
	SElemType *top;
	int stacksize;
}SqStack;

//顺序栈的初始化
Status InitStack(SqStack &S)
{// 构造一个空栈 S 
	S.base = new SElemType[MAXSIZE];//为顺序栈分配一个最大容量为MAXSIZE的数组空间
	if(!S.base)
		exit (OVERFLOW);//存储分配失败
	S.top = S.base;
	S.stacksize = MAXSIZE;
	return OK;
}


//顺序栈的入栈
Status Push(SqStack &S,SElemType &e)
{ // 插入元素e为新的栈顶元素
	if(S.top-S.base==S.stacksize)
		return ERROR;	//栈满
	*(S.top++) = e;	//元素e压入栈顶，栈顶指针加1
	return OK;
}

//顺序栈的出栈
Status Pop(SqStack &S,SElemType &e)
{// 若栈不空，则删除S的栈顶元素，用e返回其值，并返回OK；否则返回ERROR
	if(S.base == S.top)
		return ERROR;//栈空
	e = *(--S.top); //栈顶指针减1，将栈顶元素赋给e
	return OK;
}

//取顺序栈的栈顶元素
Status GetTop(SqStack S,SElemType &e)
{// 若栈不空，则用e返回S的栈顶元素，并返回OK；否则返回ERROR
	if(S.top == S.base)
		return ERROR;
	e = *(S.top-1);//栈顶指针减1，将栈顶元素赋给e
	return OK;
}

int main()
{
	SqStack s;
	SElemType e;
	SElemType t;
	if(InitStack(s)==OK)
		for(int j=1;j<=12;j++)
		{
			Push(s,j);
		}
	while(GetTop(s,e) == OK)
	{
		Pop(s,t);
	}
	return 0;
}