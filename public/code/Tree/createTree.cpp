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
						
void InOrderTraverse(BiTree T)
{ 
	if(T){
		InOrderTraverse(T->lchild);
		InOrderTraverse(T->rchild);
	}
}

int main()
{
	const char* values = "ABD###CE##";
	int i=0;
	BiTree tree;
	CreateBiTree(tree,values,i);
	return 0;
}