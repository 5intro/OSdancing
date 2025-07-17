#include<iostream>
using namespace std;

#define OK 1
#define ERROR 0
#define OVERFLOW -2
typedef int Status;							//Status 是函数返回值类型，其值是函数结果状态代码。
typedef int ElemType;						//ElemType 为可定义的数据类型，此设为int类型

typedef struct DuLNode
{
	ElemType data;							//结点的数据域
	struct DuLNode* prior;
	struct DuLNode* next;					//结点的指针域
}DuLNode, * DuLinkList;						//DuLinkList为指向结构体DuLNode的指针类型

Status InitDuList_L(DuLinkList& L) {
	//构造一个空的双向链表L
	L = new DuLNode;							//生成新结点作为头结点，用头指针L指向头结点
	L->next = NULL;							//头结点的指针域置空
	L->prior = NULL;
	return OK;
}

DuLNode* GetElemP_DuL(DuLinkList L, int i) {
	//在带头结点的双向链表L中查找第i个元素，返回结点的地址
	int j;
	DuLNode* p;
	p = L->next; j = 1;							//初始化，p指向第一个结点，j为计数器
	while (j < i && p) {							//顺链域向后扫描，直到p指向第i个元素或p为空
		p = p->next; ++j;
	}
	if (!p || j > i)	return NULL;			//第i个元素不存在
	return p;
}											//GetElemP_DuL

Status ListInsert_DuL(DuLinkList& L, int i, ElemType e) {		//双向链表的插入
	//在带头结点的双向链表L中第i个位置之前插入元素e，i的合法值为1<=i<=表长+1
	DuLNode* s, * p;
	if (!(p = GetElemP_DuL(L, i)))				//在L中确定第i个元素的位置指针p
		return ERROR;						//p为NULL时，第i个元素不存在
	s = new DuLNode;							//生成新结点s
	s->data = e;								//将结点s数据置为e
	s->prior = p->prior;						//将结点s插入L中，需要修改4个指针域
	p->prior->next = s;
	s->next = p;
	p->prior = s;
	return OK;
}											//ListInsert_DuL

void CreateDuList_L(DuLinkList& L, int a[]) {
	//正位序输入n个元素的值，建立带表头结点的双向链表L，同时建立前驱指针
	DuLNode* r, * p;
	L = new DuLNode;
	L->next = NULL;
	r = L;
	for (int i = 0; i < 5; i++) {
		p = new DuLNode;
		p->data = a[i];
		p->next = NULL; r->next = p;
		r = p;

		p->prior = L->prior;
		L->prior = p;
	}
}												//CreateDuList_L

int main()
{
	DuLinkList L;
	InitDuList_L(L);
	int a[5] = { 1,2,3,4,5 };
	CreateDuList_L(L, a);
	ElemType e = 7;
	ListInsert_DuL(L, 3, e);
	for (DuLNode* p = L->next; p; p = p->next) {
		cout << p->data << " ";
	}
	return 0;
}