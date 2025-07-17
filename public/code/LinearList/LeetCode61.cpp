#define _CRT_SECURE_NO_WARNINGS 1
#include<iostream>
using namespace std;
struct ListNode {
    int val;
    struct ListNode *next;
};
struct ListNode* rotateRight(struct ListNode* head, int k)
{//将链表的每个节点向右移动k个位置
    if(k == 0 || head == NULL || head->next == NULL)
        return head;                                 //如果链表长度不大于1，或k=0，返回原链表
    int n =1;
    struct ListNode* tail = head;
    while(tail->next != NULL)                        //统计链表节点，tail指向链表尾部
    {
        tail = tail->next;
        n++;
    }
    int movenum = k%n;                            //链表实际需要向右移动次数
    if(movenum == 0)                             //k为n的整数倍，返回原链表
        return head;
    tail->next = head;                          //链表闭合成环
    int addnum = n-movenum;                    //计算旋转后链表的尾结点的位置
    while(addnum--)
        tail = tail->next;                    //确定旋转后链表的尾结点
    struct ListNode* newhead = tail->next;
    tail->next = NULL;                       //环形链表断开
    return newhead;                         //返回旋转后链表

}
void PrintList(struct ListNode* head)
{//链表打印函数
    struct ListNode* p = head->next;
    while(p)
    {
        cout<<p->val;
        if(p->next)
        {
            cout<<" ";
        }
        p = p->next;
    }
    cout<<endl;
}
int main()
{
    cout << "请输入需要右移的链表：\n";
    struct ListNode* head = new ListNode;
    head ->next = NULL;
    struct ListNode* r = head;
    do{
         struct ListNode* p = new ListNode;
         cin>>p->val;
         p->next = NULL;
         r->next = p;
         r = p;
    } while (getchar() != '\n');
    int k;
    cout << "右移的次数为：\n";
    cin>>k;
    struct ListNode* newhead = rotateRight(head, k);
    cout << "右移后的链表为：\n";
    PrintList(newhead);

}