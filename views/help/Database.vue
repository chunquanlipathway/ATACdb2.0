<template>
  <div id="database">
    <p>
      ATACdb provides the comprehensive chromatin accessibility regions about human ATAC-seq data.
      ATACdb also provides quality control report and other detailed (epi) genetic information,
      including super-enhancers, typical enhancers, common SNPs, risk SNPs, eQTLs, LD SNPs, methylation sites,
      3D chromatin interactions and TADs. Furthermore, ATACdb includes analytical tools and personalized genome
      browser to discover potential biological effects of chromatin accessible regions.
    </p>
    <BaseImage :url="url"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import '@/assets/less/views/help/Database.less';
import BaseImage from '@/components/image/BaseImage.vue';

const url = require('@/assets/img/help/help_liuchen.png');

export default defineComponent({
  name: 'Database',
  props: {
    active: {
      type: String,
      default: () => '3'
    }
  },
  components: { BaseImage },
  emits: ['changeActive'],
  setup(props, content) {
    // 获取父组件方法并将路由过来的值赋值给父组件中的变量
    const parent = { ...content };
    onMounted(() => parent.emit('changeActive', props.active));
    return {
      url
    };
  }
});
</script>
