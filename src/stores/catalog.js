// src/stores/catalog.js
import { defineStore } from 'pinia'
import http from "@/api/http" // 根据你的路径调整

export const useCatalogStore = defineStore('catalog', {
    state: () => ({
        catalog: [],       // 存储菜单目录数据
        loaded: false,     // 标记数据是否已加载
        collapsed: false,   // 控制菜单折叠状态
        activeCatalogId: null // 新增：当前激活的目录ID
    }),
    actions: {
        setActiveCatalogId(id) {
            this.activeCatalogId = id
        },
        // 异步获取目录数据（只会加载一次）
        async fetchData() {
            // 如果数据已加载，直接返回
            if (this.loaded) return;

            try {
                // 1. 获取目录列表
                const response = await http.get('/algorithm/getCatalogue');
                this.catalog = response.data.data;
                // 2. 并行获取每个目录下的算法数据
                await Promise.all(
                    this.catalog.map(async (item) => {
                        const res = await http.get(`/algorithm/getAlgorithmByCatalogueId/${item.id}`);
                        item.algorithms = res.data.data; // 将算法数据挂载到目录项
                    })
                );

                this.loaded = true; // 标记数据已加载
            } catch (error) {
                console.error('加载目录数据失败:', error);
                throw error; // 可选择抛出错误供组件处理
            }
        },
        // 切换菜单折叠状态
        toggleCollapsed() {
            this.collapsed = !this.collapsed;
        },
        toggleMenu(id) {
            if (this.activeIds.has(id)) {
                this.activeIds.delete(id);
            } else {
                this.activeIds.add(id);
            }
        },
        // 设置初始展开状态
        setActiveId(id) {
            this.activeIds.add(id);
        },
        getItemId(id) {
            for (let i = 0; i < this.catalog.length; i++) {
                for (let j = 0; j < this.catalog[i].algorithms.length; j++) {
                    let algo = this.catalog[i].algorithms[j];

                    if (algo.id == id) {
                        return 'item-' + (i + 1) + '-' + j
                    }

                }
            }
        }
    }
})