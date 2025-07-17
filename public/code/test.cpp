#include<iostream>
using namespace std;

typedef struct BiNode {
    char data;
    struct BiNode *lchild, *rchild;
} BiTNode, *BiTree;

char seq[] = {'1', '5', '3', '#', '#', '4', '13', '#', '#', '2', '#', '#', '10', '#', '#'};
int i = 0;

void CreateBiTree(BiTree &T) {
    char ch;
    ch = seq[i++];
    if (ch == '#')
        T = NULL;
    else {
        T = new BiTNode;
        T->data = ch;
        CreateBiTree(T->lchild);
        CreateBiTree(T->rchild);
    }
}

void InOrderTraverse(BiTree T) {
    if (T) {
        InOrderTraverse(T->lchild);
        cout << T->data;
        InOrderTraverse(T->rchild);
    }
}

int main() {
    BiTree tree;
    cout << "请输入建立二叉链表的序列：\n";
    CreateBiTree(tree);
    cout << "中序遍历的结果为：\n";
    InOrderTraverse(tree);
    cout << endl;
    return 0;
}
