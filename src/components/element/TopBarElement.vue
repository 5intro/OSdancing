<template>
  <t-affix
      ref="affixRef"
      :z-index="5"
      :offset-top="0"
      :offset-bottom="50"
  >

    <t-header :style="{ height: 'var(--header-height);', background: 'var(--bg-color-container)'}">
      <t-head-menu theme="light" v-model:value="menu1Value"
                   style="border-bottom: solid 1px rgba(232,231,231,0.98); box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);">
        <template #logo>
          <router-link to="/" :title="'首页'" style="color: black;">
            <img height="55" src="@/assets/img/logo3.jpg" alt="logo"/>
          </router-link>
        </template>

        <template #operations>

          <template v-if="!collapsed">
            <div style="margin-right: 20px;">
              <t-input placeholder="" v-model="searchInp" @enter="search" >
                <template #suffixIcon>
                  <img @click="search" src="@/assets/img/search.png" style="object-fit: cover; height: 100%; cursor: pointer" >
                </template>
              </t-input>
            </div>
            <t-menu-item :value="'item'+index" v-for="(item, index) in navArr" style="padding: 0 !important;">
              <router-link v-if="index !== 2 && index !== 1 && index !== 4"
                           :to="item.path" style="padding: 0 var(--td-comp-paddingLR-l);">
                <div :id="'bar-' + index" :style="{color: item.color}" style="padding: 0 var(--td-comp-paddingLR-l);">{{ item.title }}</div>
              </router-link>
              <a v-else-if="index !== 1" :href="item.path" @click="handleClick" style="padding: 0 var(--td-comp-paddingLR-l);">
                <div :id="'bar-' + index" :style="{color: item.color}" style="padding: 0 var(--td-comp-paddingLR-l);">{{ item.title }}</div>
              </a>

              <div v-else @click="checkLoginBeforeNavigate(item.path)" style="cursor: pointer; padding: 0 var(--td-comp-paddingLR-l);">
                <div :id="'bar-' + index" :style="{color: item.color}">{{ item.title }}</div>
              </div>

            </t-menu-item>
          </template>
          <template v-else>
            <!--            <t-popup class="placement bottom center" :content="renderPopupContent" placement="bottom" show-arrow destroy-on-close>-->
            <!--              <t-button variant="text" shape="square">-->
            <!--                <template #icon><t-icon name="view-list" /></template>-->
            <!--              </t-button>-->
            <!--            </t-popup>-->

            <t-dropdown :options="options" :minColumnWidth="150" @click="changePath">
              <t-space>
                <t-button variant="text" shape="square">
                  <template #icon>
                    <t-icon name="view-list"/>
                  </template>
                </t-button>
              </t-space>
            </t-dropdown>
          </template>

          <button v-if="this.isLogin === false" type="button" class="login-btn btn btn-outline-secondary me-2"
                  id="login" data-bs-toggle="modal" data-bs-target="#loginModal">登录/注册
          </button>
          <t-dropdown v-else
                      :options="[{ content: '退出登录', value: 1, onClick: this.performLogout},]"
          >
            <t-space>
              <t-button variant="text">
                {{ this.username }}
                <template #suffix>
                  <t-icon name="chevron-down" size="20"/>
                </template>
              </t-button>
            </t-space>
          </t-dropdown>


          <!--      <a v-else class="dropdown-item" href="#" @click.prevent="performLogout">退出登录</a>-->


        </template>

      </t-head-menu>
    </t-header>

  </t-affix>

</template>
<script lang="jsx">
import SelectBarElement from './SelectBarElement.vue'
// 导入必要的模块和工具
import {initLoginOrRegister} from "@/api/util";
import {
  checkLogin,
  getFromLocalStorageWithExpiry,
  getFromSessionStorage,
  logout,
  redirectTo
} from "../../../public/js/util";
import {BASEURL} from "../../../public/js/base";

export default {
  name: "TopBarElement",
  data() {
    return {
      navArr: [
        {path: '/', title: '首页', color: 'black'},
        {path: '/dataStructure', title: '数据结构算法演示', color: 'black'},
        {path: '/live.html', title: '自定义算法演示', color: 'black'},
        {path: '/onlineEvaluation', title: '在线编程评测', color: 'black'},
        {path: '/others', title: '其他课程算法演示', color: 'black'},
      ],
      options: [],
      isLogin: false,
      username: '',
      isDropdownOpen: false,
      collapsed: false,
      initialWindowWidth: 0, // 新增属性，用于记录初始窗口宽度
      menu1Value: '',
      searchInp: ''
    };
  },
  methods: {
    search() {
      if(!checkLogin()) {
        this.$message.error('您当前尚未登录');
        return;
      }
      this.$router.push(`/search?receivedString=${encodeURIComponent(this.searchInp)}`);
    },
    changePath(value) {
      if (value.value != '/live.html') {
        // if (value.value != '')
        this.$router.push(value.value)
      } else {
        // if (this.isMobile()) {
        //   this.$message.error('手机端暂不支持该功能！');
        //   return;
        // }
        window.location.href = '/live.html';
      }

    },
    // 判断是否为某个路径的前缀路径
    isPathPrefixDataStructure(currentPath, prePath) {
      const escapedPrefixPath = prePath.replace(/\//g, '\\/');

      // 构建正则表达式，匹配前缀路径，后面可以跟任意字符或路径结束
      const prefixRegex = new RegExp(`^${escapedPrefixPath}(\/|$)`);

      // 使用正则表达式测试当前路径
      return prefixRegex.test(currentPath);
    },
    getPathPrefix(path) {
      // 移除路径尾部的 '/'（如果有的话）
      path = path.replace(/\/$/, '');

      // 找到第一个 '/' 的位置
      const firstSlashIndex = path.indexOf('/');

      // 如果没有找到 '/' 或者路径只包含一个 '/'，则没有前缀
      if (firstSlashIndex === -1 || firstSlashIndex === path.length - 1) {
        return '';
      }

      // 找到第一个 '/' 后面紧接着的下一个 '/' 的位置
      const nextSlashIndex = path.indexOf('/', firstSlashIndex + 1);

      // 如果没有下一个 '/'，则返回第一个 '/' 后面的所有内容
      if (nextSlashIndex === -1) {
        return path.substring(firstSlashIndex + 1);
      }

      // 返回第一个 '/' 和紧接着的下一个 '/' 之间的内容
      return path.substring(firstSlashIndex + 1, nextSlashIndex);
    },

    // 更改选中路径
    changeSelected() {
      let path = this.$route.path, prePath = this.getPathPrefix(path);
      if (prePath === 'logicalContent') path = '/dataStructure'
      if (prePath === 'detail') path = '/onlineEvaluation'
      if (prePath === 'os') {
        path = '/os/home'
      }
      if (prePath === 'cp') path = '/os/home'
      for (let idx in this.navArr) {
        let item = this.navArr[idx];
        if (this.isPathPrefixDataStructure(path, item.path)) {
          item.color = '#489fc8';
          this.menu1Value = 'item' + idx;
          item.img = item.selectImg;
        } else {
          item.color = 'black'
          item.img = item.unselectImg
        }
      }
      // console.log(this.menu1Value)
    },
    changeStatus() {
      if (checkLogin()) {
        let jwt_token = getFromLocalStorageWithExpiry('jwt_token');
        if (getFromSessionStorage('jwt_token') != null)
          jwt_token = getFromSessionStorage('jwt_token');
        let that = this;
        let username, isLogin;
        $.ajax({
          url: BASEURL + "user/parseJwtToken?jwt_token=" + jwt_token,
          success: function (data) {
            data = data.data
            if (data == null) {
              isLogin = false;
              return
            }
            isLogin = true;
            that.username = data['username'];
            $(function () {
              $("#logout").click(function () {
                logout();
                this.isLogin = false;
                redirectTo('/');
              });
            });

          },
          error: function () {
            alert('Error loading data!');
          }
        });
        this.isLogin = isLogin;

      } else this.isLogin = false;
    },

    handleClick(event) {
      if (!checkLogin()) {
        event.preventDefault(); // 阻止默认行为
        event.stopPropagation(); // 阻止事件冒泡

        this.$message.error('您当前尚未登录');
        let that = this
        setTimeout(function () {
          that.$message.closeAll()
        }, 2000);
      }
      if (this.isMobile()) {
        event.preventDefault(); // 阻止默认行为
        event.stopPropagation(); // 阻止事件冒泡

        this.$message.error('该功能手机端暂不支持');
        let that = this
        setTimeout(function () {
          that.$message.closeAll()
        }, 2000);
      }
    },

    checkLoginBeforeNavigate(path) {
      if (checkLogin()) {
        this.$router.push(path);
      } else {
        this.$message.error('您当前尚未登录');
        let that = this
        setTimeout(function () {
          that.$message.closeAll()
        }, 2000);
        // alert('您当前尚未登录！');
      }
    },
    toggleDropdown() {
      this.isDropdownOpen = true;
    },
    closeDropdown() {
      this.isDropdownOpen = false;
    },
    performLogout() {
      logout();
      this.isLogin = false;
      redirectTo('/');
    },
    // 处理窗口大小变化的函数
    handleResize() {

      const windowWidth = window.innerWidth;
      // 当窗口宽度小于初始宽度的一半时，设置 collapsed 为 true
      this.collapsed = this.isMobile() || windowWidth < this.initialWindowWidth / 2;
    },
    isMobile() {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileAgents = ['android', 'iphone', 'ipad', 'ipod', 'windows phone', 'mobile'];
      return mobileAgents.some(agent => userAgent.includes(agent));
    }
  },
  created() {
    initLoginOrRegister();
  },
  mounted() {
    for (let item in this.navArr) {
      this.options.push({content: this.navArr[item].title, value: this.navArr[item].path});
    }
    this.changeStatus();
    // 记录初始窗口宽度
    this.initialWindowWidth = screen.width;
    // 初始化时检查一次
    this.handleResize();
    // 添加窗口大小变化的监听器
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    // 移除窗口大小变化的监听器
    window.removeEventListener('resize', this.handleResize);
  },
  watch: {
    $route(to, from) {
      // 当路由变化时执行的操作
      this.changeSelected();
    }
  },
};
</script>

<style scoped>
.login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: clamp(12px, 1.5vw, 18px);
  width: auto;
  padding: 0.5rem 1.5rem;
}
</style>