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

void CreateList_L(LinkList& L, int a[]) {       //后插法创建单链表
    //建立到头结点的单链表L
    LNode* r, * p;
    L = new LNode;
    L->next = NULL;
    r = L;
    for (int i = 0; i < 5; i++) {
        p = new LNode;
        p->data = a[i];
        p->next = NULL;
        r->next = p;
        r = p;
    }
}

int main()
{
    LinkList L;
    InitList_L(L);
    int a[] = { 1, 2, 3, 4, 5 };
    CreateList_L(L, a);
    for (LNode* p = L->next; p; p = p->next) {
        cout << p->data << " ";
    }
    return 0;
}
