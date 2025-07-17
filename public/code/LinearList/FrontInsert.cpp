#include<iostream>
using namespace std;

typedef struct LNode
{
    ElemType data;
    struct LNode* next;
} LNode, * LinkList;

Status InitList_L(LinkList& L) {
    //构造一个空的单链表L
    L = new LNode;
    L->next = NULL;
    return OK;
}

void CreateList_F(LinkList& L, int a[]) {
    //前插法创建单链表
    //逆位序建立到头结点的单链表L
    L = new LNode;
    L->next = NULL;
    for (int i = 0; i < 5; i++) {
        LinkList p = new LNode;
        p->data = a[i];
        p->next = L->next;
        L->next = p;
    }
}

int main()
{
    LinkList L;
    InitList_L(L);
    int a[] = { 1, 2, 3, 4, 5 };
    CreateList_F(L, a);
    for (LNode* p = L->next; p; p = p->next) {
        cout << p->data << " ";
    }
    return 0;
}
