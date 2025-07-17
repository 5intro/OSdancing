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
	S.base = new SElemType[MAXSIZE];	//为顺序栈分配一个最大容量为MAXSIZE的数组空间
	if(!S.base)
		exit (OVERFLOW);    	//存储分配失败
	S.top = S.base;
	S.stacksize = MAXSIZE;
	return OK;
}

int main(){
	return 0;
} 