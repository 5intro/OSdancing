#include<iostream>
using namespace std;

#define OK 1
#define ERROR 0
#define OVERFLOW -2
typedef int Status;
typedef int SElemType;
typedef struct SNode{
	SElemType data;
	struct SNode *next;
}SNode,*LinkStack;

//链栈的初始化
Status InitStack (LinkStack &S)
{
      // 构造一个空栈 S，栈顶指针置空
      S=NULL;
      return OK;
}

int main(){
	return 0;
} 