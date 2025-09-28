<template>
  <div id="available">
    <p>
      <span class="font_red">Accessible chromatin</span> is a highly informative structural feature for identifying regulatory elements,
      which provides a large amount of information about transcriptional activity and gene regulatory mechanisms, and is closely associated with various biological processes and human diseases.
      <span class="font_red">Human ATAC-seq datasets</span> are accumulating rapidly, it is necessary to collect and process these datasets.
      More importantly, a large number of researches showed that chromatin accessible regions, as well as the related SNPs and TFs,
      have a strong influence on human diseases and biological processes.
    </p>
    <p>
      Here, we developed a comprehensive human chromatin accessibility database (ATACdb, <a href="http://www.licpathway.net/ATACdb" target="_blank">http://www.licpathway.net/ATACdb</a>),
      which aims to provide a large number of available resources on human chromatin accessibility data.
      ATACdb provides <span class="font_red">a quality assurance process</span> including four quality control (QC) metrics.
      ATACdb provides other detailed (epi) genetic annotation information in chromatin accessibility regions,
      including <span class="font_red">super-enhancers, typical enhancers, TFs, common SNPs, risk SNPs, eQTLs, LD SNPs, DNA methylation sites, 3D chromatin interactions and TADs</span>.
      ATACdb provides accurate inference of <span class="font_red">TF footprint</span> within chromatin accessibility regions. ATACdb is a powerful
      platform that provides the most comprehensive accessible chromatin data, quality control report, TF footprint and various other annotation information for users.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import '@/assets/less/views/help/Available.less';

export default defineComponent({
  name: 'Available',
  props: {
    active: {
      type: String,
      default: () => '1'
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
