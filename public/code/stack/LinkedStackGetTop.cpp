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

//链栈的入栈
Status Push(LinkStack &S , SElemType e)
{//在栈顶插入元素e
	SNode *p = new SNode;//生成新结点p
	if(!p)
	{
		return OVERFLOW;
	}
	p->data = e;//将新结点数据域置为e
	p->next = S;//将新结点p插入栈顶
	S = p;//修改栈顶指针
	return OK;
}

Status GetTop(LinkStack S, SElemType &e)
{
    if (!S) 
        return ERROR;
    e = S->data; 
    return OK;
}

int main()
{
	LinkStack s;
	SElemType e;
	if(InitStack(s)==OK)
		for(int j=1;j<=15;j++)
		{
			Push(s,j);
			cout<<j<<"  ";
		}
	  if(GetTop(s, e) == OK)
            cout << "Top element is: " << e << endl;
        else
            cout << "Stack is empty" << endl;
	return 0;
}