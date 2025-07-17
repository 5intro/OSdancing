#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct LNode {
    int coe;  // 系数
    int exp;  // 指数
    LNode* next;
};

typedef LNode* LinkList;

// 创建有序多项式（先将输入存储在容器中，排序后再插入链表，使用尾差法）
void CreatePolynomial(LinkList& L) {
    L = new LNode;  // 初始化头节点
    L->next = NULL;
    int coe, exp;
    char ch;
    vector<pair<int, int>> terms;  // 存储每项的系数和指数
    // 输入多项式的各项，存储到 terms 数组
    do {
        cin >> coe >> exp;  // 输入系数和指数
        terms.push_back({ coe, exp });  // 将系数和指数存入容器
        ch = getchar();  // 读取回车或空格
    } while (ch != '\n');  // 当输入回车时停止
    // 对输入的项按指数降序排序
    sort(terms.begin(), terms.end(), [](pair<int, int> a, pair<int, int> b) {
        return a.second > b.second;  // 按指数降序排序
        });
    // 使用尾差法将排序后的项插入链表
    LinkList r = L;  // 维护尾指针
    for (auto& term : terms) {
        LNode* p = new LNode;
        p->coe = term.first;  // 赋值系数
        p->exp = term.second;  // 赋值指数
        p->next = NULL;
        r->next = p;  // 将新节点接到尾指针后
        r = p;        // 更新尾指针
    }
}

// 输出多项式
void PrintPolynomial(LinkList L) {
    LinkList p = L->next;
    bool first = true;

    while (p) {
        if (first) {  // 第一个项
            cout << p->coe << "x^" << p->exp;
            first = false;
        }
        else {
            if (p->coe < 0) {  // 负系数，直接输出
                cout << " - " << -p->coe << "x^" << p->exp;
            }
            else {  // 正系数，使用 "+"
                cout << " + " << p->coe << "x^" << p->exp;
            }
        }
        p = p->next;
    }
    cout << endl;
}

int main() {
    LinkList poly;
    cout << "请输入多项式的系数和指数（每项输入一组系数和指数，以空格隔开，输入完后按回车键结束输入）:" << endl;
    CreatePolynomial(poly);  // 创建有序多项式
    cout << "多项式为: ";
    PrintPolynomial(poly);  // 输出多项式
    return 0;
}
