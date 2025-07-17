int networkDelayTime(int** times, int timesSize, int* timesColSize, int n, int k)
{//计算从结点k发出一个信号，使所有结点都收到信号的时间
	const int inf = 0x3f3f3f3f;
	int** g = (int**)malloc(n * sizeof(int*));
	for (int i = 0; i < n; i++)
	{
		g[i] = (int*)malloc(n * sizeof(int));
		memset(g[i], inf, sizeof(int) * n);
	}
	for (int i = 0; i < timesSize; i++)     //逐行遍历times, 将结点间的信号传递时间记录在g中
	{
		int v1 = times[i][0], v2 = times[i][1];
		g[v1 - 1][v2 - 1] = times[i][2];
	}
	int* dist = (int*)malloc(n * sizeof(int));   //记录从起始结点k到其余各结点的最短路径长度
	memset(dist, inf, sizeof(int) * n);
	dist[k - 1] = 0;
	int* used = (int*)malloc(n * sizeof(int));   //记录结点是否是已确定结点
	memset(used, 0, sizeof(int) * n);
	int ans = 0;
	for (int i = 0; i < n; ++i)
	{
		int x = -1;
		for (int y = 0; y < n; ++y)              //查找未确定结点中到起始结点路径长度最短的结点
			if (!used[y] && (x == -1 || dist[y] < dist[x]))
				x = y;
		used[x] = true;                         //将查找到的结点标记为已确定
		ans = fmax(ans, dist[x]);               //更新最短路径长度的最大值
		for (int y = 0; y < n; ++y)             //更新其他结点到起始结点的最短路径长度
			dist[y] = fmin(dist[y], dist[x] + g[x][y]);
	}
	return ans == inf ? -1 : ans;               //返回所需时间
}