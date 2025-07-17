#include <iostream>
using namespace std;

#define MVNum 100	//最大顶点数
typedef char VerTexType;							//假设顶点的数据类型为字符型
typedef int ArcType;                 				//假设边的权值类型为整型

typedef struct {
	VerTexType vexs[MVNum];            				//顶点表
	ArcType arcs[MVNum][MVNum];      				//邻接矩阵
	int vexnum, arcnum;                				//图的当前点数和边数
}Graph;

bool visited[MVNum];           					//访问标志数组，其初值为"false"
int FirstAdjVex(Graph G, int v);				//返回v的第一个邻接点
int NextAdjVex(Graph G, int v, int w);		//返回v相对于w的下一个邻接点

int LocateVex(Graph G, VerTexType v) {
	//确定点v在G中的位置
	for (int i = 0; i < G.vexnum; ++i)
		if (G.vexs[i] == v)
			return i;
	return -1;
}//LocateVex

void CreateUDN(Graph& G) {
	//采用邻接矩阵表示法，创建无向网G
	G.vexnum = 4;
	G.arcnum = 5;
	G.vexs[0] = 'A';
	G.vexs[1] = 'B';
	G.vexs[2] = 'C';
	G.vexs[3] = 'D';
	cout << endl;
	for (int i = 0; i < G.vexnum; ++i)
		for (int j = 0; j < G.vexnum; ++j)
			G.arcs[i][j] = 0;
	G.arcs[0][1] = G.arcs[1][0] = 500;
	G.arcs[0][2] = G.arcs[2][0] = 200;
	G.arcs[0][3] = G.arcs[3][0] = 150;
	G.arcs[1][2] = G.arcs[2][1] = 400;
	G.arcs[2][3] = G.arcs[3][2] = 600;
}//CreateUDN

void DFS(Graph G, int v) {        			//从第v个顶点出发递归地深度优先遍历图G
	cout << G.vexs[v] << "    ";  visited[v] = true;   	//访问第v个顶点，并置访问标志数组相应分量值为true
	int w;
	for (w = FirstAdjVex(G, v); w >= 0; w = NextAdjVex(G, v, w))
		//依次检查v的所有邻接点w ，FirstAdjVex(G, v)表示v的第一个邻接点
		//NextAdjVex(G, v, w)表示v相对于w的下一个邻接点，w≥0表示存在邻接点
		if (!visited[w]) DFS(G, w);    					//对v的尚未访问的邻接顶点w递归调用DFS
}//DFS

int FirstAdjVex(Graph G, int v) {
	for (int i = 0; i < G.vexnum; ++i) {
		if (G.arcs[v][i] != 0 && !visited[i])
			return i;
	}
	return -1;
}//FirstAdjVex

int NextAdjVex(Graph G, int v, int w) {
	for (int i = w + 1; i < G.vexnum; ++i) {
		if (G.arcs[v][i] != 0 && !visited[i])
			return i;
	}
	return -1;
}//NextAdjVex

int main() {
	cout << "************深度优先搜索遍历连通图的递归算法**************" << endl << endl;
	Graph G;
	CreateUDN(G);
	cout << endl;
	cout << "无向连通图G创建完成！" << endl << endl;

	cout << "深度优先搜索遍历连通图结果：" << endl;
	DFS(G, LocateVex(G, 'A'));
	cout << endl;
	return 0;
}//main