<template>
  <vue-iframe :src="$route.query.href"></vue-iframe>
</template>
<script>
  import vueIframe from '../../../components/iframe/index';
  export default {
    components: {
      vueIframe
    },
    name: "doc"
  }
</script>
