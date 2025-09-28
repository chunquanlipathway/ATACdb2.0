<template>
  <div id="environment">
    <p>
      The ATACdb website runs on a Linux-based Apache Web server 2.4.6 (http://www.apache.org). The database was developed using
      MySQL 5.7.27 (http://www.mysql.com). PHP 5.6.40 (http://www.php.net) was used for server-side scripting. The ATACdb web
      interface was built using Bootstrap v3.3.7 (https://v3.bootcss.com) and JQuery v2.1.1 (http://jquery.com).
      ECharts (http://echarts.baidu.com) was used to be a graphical visualization framework. This database has been tested using
      Mozilla Firefox, Google Chrome and Internet Explorer web browsers.
    </p>
    <p>
      ATACdb is freely available to the research community at (http://www.licpathway.net/ATACdb) and quires no registration or login.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import '@/assets/less/views/help/Environment.less';

export default defineComponent({
  name: 'Environment',
  props: {
    active: {
      type: String,
      default: () => '7'
    }
  },
  components: {},
  emits: ['changeActive'],
  setup(props, content) {
    // 获取父组件方法并将路由过来的值赋值给父组件中的变量
    const parent = { ...content };
    onMounted(() => parent.emit('changeActive', props.active));
    return {};
  }
});
</script>

<style scoped>

</style>
