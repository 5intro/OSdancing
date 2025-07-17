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
    //为顺序栈分配一个最大容量为MAXSIZE的数组空间
	S.base = new SElemType[MAXSIZE];
	if(!S.base)
		exit (OVERFLOW); //存储分配失败
	S.top = S.base;
	S.stacksize = MAXSIZE;
	return OK;
}

//顺序栈的入栈
Status Push(SqStack &S,SElemType &e)
{// 插入元素e为新的栈顶元素
	if(S.top-S.base==S.stacksize)
		return ERROR;	//栈满
	*(S.top++) = e;	//元素e压入栈顶，栈顶指针加1
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
			cout<<j<<"  ";
		}
	return OK;
}