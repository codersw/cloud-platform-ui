<template>
  <vue-iframe :src="href"></vue-iframe>
</template>
<script>
  import vueIframe from '../../../components/iframe/index';
  export default {
    components: {
      vueIframe
    },
    name: "service",
    data() {
      return {
        href: "http://nw.sy-metro.com:9061/wallboard"
      }
    }
  }
</script>
