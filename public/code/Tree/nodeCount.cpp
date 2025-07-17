#include<iostream>
using namespace std;
typedef struct BiNode
{				
	char data;						
	struct BiNode *lchild,*rchild;	
}BiTNode,*BiTree;
void CreateBiTree(BiTree &T,const char* values,int &i)
{
	if (values[i] == '#') {
        T = NULL;
        i++;
    } else {
        T = new BiTNode;
        T->data = values[i++];
        CreateBiTree(T->lchild, values, i);
        CreateBiTree(T->rchild, values, i);
    }
}
int NodeCount(BiTree T)
{
     if(T==NULL) return 0;
     else return NodeCount(T->lchild)+ NodeCount(T->rchild) +1;
}

int main()
{
	const char* values = "ABD##E##C#F##";
	int i=0;
	BiTree tree;
	CreateBiTree(tree,values,i);
    NodeCount(tree);
	return 0;

}