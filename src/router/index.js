
import { createRouter, createWebHistory } from 'vue-router';
const OSTest = () => import('@/components/test/Os/test');

const OSHome = () => import('@/components/pages/OSHome');

import FCFS from '@/components/test/Os/unit3/FCFS';
import FeedbackQueue from '@/components/test/Os/unit3/FeedbackQueue.vue';
import HighPrio from '@/components/test/Os/unit3/HighPrio.vue';
import HighPrio2 from '@/components/test/Os/unit3/HighPrio2.vue';
import HighResponse from '@/components/test/Os/unit3/HighResponse.vue';
import RR from '@/components/test/Os/unit3/RR.vue';
import SJF from '@/components/test/Os/unit3/SJF.vue';
import PartitionAllocation_BF from '@/components/test/Os/unit4/PartitionAllocation_BF.vue';
import PartitionAllocation_FF from '@/components/test/Os/unit4/PartitionAllocation_FF.vue';
import PartitionAllocation_NF from '@/components/test/Os/unit4/PartitionAllocation_NF.vue';
import PartitionAllocation_WF from '@/components/test/Os/unit4/PartitionAllocation_WF.vue';
import Replacement_FIFO from '@/components/test/Os/unit4/Replacement_FF.vue';
import Replacement_LRU from '@/components/test/Os/unit4/Replacement_LRU.vue';
import Replacement_OPT from '@/components/test/Os/unit4/Replacement_OPT.vue';
import CSCAN from '@/components/test/Os/unit5/CSCAN.vue';
import FCFS2 from '@/components/test/Os/unit5/FCFS.vue';
import SCAN from '@/components/test/Os/unit5/SCAN.vue';
import SSTF from '@/components/test/Os/unit5/SSTF.vue';
const routes = [

    { path: '/', redirect: '/so/home' ,},



    { path: '/so/test', name: 'OSTest', component: OSTest},
    { path: '/so/home', name: 'OSHome', component: OSHome},

    { path: '/so/FCFS', name: 'FCFS', component: FCFS},
    { path: '/so/FeedbackQueue', name: 'FeedbackQueue', component: FeedbackQueue},
    { path: '/so/HighPrio', name: 'HighPrio', component: HighPrio},
    { path: '/so/HighPrio2', name: 'HighPrio2', component: HighPrio2},
    { path: '/so/HighResponse', name: 'HighResponse', component: HighResponse},
    { path: '/so/RR', name: 'RR', component: RR},
    { path: '/so/SJF', name: 'SJF', component: SJF},
    { path: '/so/PartitionAllocation_BF', name: 'PartitionAllocation_BF', component: PartitionAllocation_BF},
    { path: '/so/PartitionAllocation_FF', name: 'PartitionAllocation_FF', component: PartitionAllocation_FF},
    { path: '/so/PartitionAllocation_NF', name: 'PartitionAllocation_NF', component: PartitionAllocation_NF},
    { path: '/so/PartitionAllocation_WF', name: 'PartitionAllocation_WF', component: PartitionAllocation_WF},
    { path: '/so/Replacement_FIFO', name: 'Replacement_FIFO', component: Replacement_FIFO},
    { path: '/so/Replacement_LRU', name: 'Replacement_LRU', component: Replacement_LRU},
    { path: '/so/Replacement_OPT', name: 'Replacement_OPT', component: Replacement_OPT},
    { path: '/so/CSCAN', name: 'CSCAN', component: CSCAN},
    { path: '/so/FCFS2', name: 'FCFS2', component: FCFS2},
    { path: '/so/SCAN', name: 'SCAN', component: SCAN},
    { path: '/so/SSTF', name: 'SSTF', component: SSTF},
    
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    if (to.path && to.path.startsWith('/os/home')) {
        to.meta.commonComponent = Navbar;
        to.meta.selectBar = SelectBarElement;
        to.params.active = 0;
    } else if (to.path && to.path.startsWith('/cp/home')) {
        console.log(to.path);
        to.meta.selectBar = SelectBarElement;
        to.params.active = 1;
    }
    if (to.path && to.path.startsWith('/os') ||  to.path.startsWith('/cp') || to.path.startsWith('/multipleChoice') || to.path.startsWith('/others')) {
        if (!checkLogin()) {
            ElMessage({
                message: '您当前尚未登录',
                type: 'error',
                grouping: true
            });

            next('/');
        }
    }
    next();
});

export default router;
