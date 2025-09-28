<template>
  <div id="samples">
    <p>
      The current version of ATACdb documented a total of <span class="font_red">52,078,883</span> regions from <span class="font_red">over 1400</span> chromatin accessibility ATAC-seq samples.
      These samples have been manually curated and classified from NCBI GEO/SRA.
      Accessible chromatin regions were identified by using a unified system environment and software parameters.
      ATACdb provides a conveniently user-friendly interface to query, browse, analyze and download chromatin accessible regions and their related annotation information.
      For more detailed statistics, please see the "<span class="font_blue">Statistics</span>" page.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import '@/assets/less/views/help/Samples.less';

export default defineComponent({
  name: 'Samples',
  props: {
    active: {
      type: String,
      default: () => '2'
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
