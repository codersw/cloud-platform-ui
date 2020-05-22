<template>
  <el-tooltip :content="isFullscreen?`取消全屏`:`全屏`" effect="dark" placement="bottom">
    <icon-svg :icon-class="'full-screen'"></icon-svg>
  </el-tooltip>
</template>

<script>
  import screenfull from 'screenfull'
  export default{
    data() {
      return {
        isFullscreen: false
      }
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      this.destroy()
    },
    methods: {
      handleFullScreen() {
        if (!screenfull.enabled) {
          this.$message({
            message: 'you browser can not work',
            type: 'warning'
          })
          return false
        }
        screenfull.toggle()
      },
      change() {
        this.isFullscreen = screenfull.isFullscreen
      },
      init() {
        if (screenfull.enabled) {
          screenfull.on('change', this.change)
        }
      },
      destroy() {
        if (screenfull.enabled) {
          screenfull.off('change', this.change)
        }
      }
    }
  }
</script>

<style scoped>

</style>
