<template>
  <iframe :src="url" class="iframe" ref="iframe"></iframe>
</template>
<script>
  import NProgress from "nprogress";
  import { mapGetters } from "vuex";
  export default {
    name: "vueIframe",
    props: {
      url: ''
    },
    created () {
      NProgress.configure({ showSpinner: false })
    },
    mounted () {
      this.load();
      this.resize()
    },
    components: {
      ...mapGetters(['screen']),
    },
    methods: {
      // 显示等待框
      show () {
        NProgress.start()
      },
      // 隐藏等待狂
      hide () {
        NProgress.done()
      },
      // 加载浏览器窗口变化自适应
      resize () {
        window.onresize = () => {
          this.iframeInit()
        }
      },
      // 加载组件
      load () {
        this.show();
        this.iframeInit();
      },
      //iframe窗口初始化
      iframeInit () {
        const iframe = this.$refs.iframe
        const clientHeight = document.documentElement.clientHeight - (screen > 1 ? 200 : 130);
        iframe.style.height = `${clientHeight}px`
        if (iframe.attachEvent) {
          iframe.attachEvent('onload', () => {
            this.hide()
          })
        } else {
          iframe.onload = () => {
            this.hide()
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  .iframe {
    width: 100%;
    height: 100%;
    border: 0;
    overflow: hidden;
    box-sizing: border-box;
  }
</style>
