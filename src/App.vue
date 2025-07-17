<template>
  <div>
    <!-- 页面主内容 -->
    <TopBarElement v-if="commonComponent" />
    <router-view :key="$route.fullPath" />

    <!-- 悬浮 DeepSeek 聊天窗 -->
    <DeepSeekChat />
  </div>
</template>

<script>
import TopBarElement from '@/components/element/TopBarElement'
import DeepSeekChat from '@/components/DeepSeekChat.vue'

export default {
  name: 'App',
  components: {
    TopBarElement,
    DeepSeekChat,
  },
  mounted() {
    $('script[src="/test.js"]').remove()
  },
  computed: {
    commonComponent() {
      return this.$route.meta.commonComponent
    },
    selectBar() {
      return this.$route.meta.selectBar
    },
  },
}
</script>
