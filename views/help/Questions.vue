<template>
  <div id="questions">
    <BaseCard title="Why are showing no results available somewhere?">
      Reply: Because there is no corresponding functional annotation or no significant annotation results for this TF/gene.
    </BaseCard>
    <BaseCard title="How to understand measure scores of the quality control report in ATACdb?">
      Reply: We provided four different QC metrics of ATAC-seq samples, including mean insert size and corresponding standard
      deviation of paired-end libraries using Picard, TSS enrichment score and FRiP using the ENCODE consortium. We preferred
      the mean insert size as a superior metric of quality assessment, because it was estimated after trimming off the outliers
      in from the original insert-size distribution. The TSS enrichment score indicated the average depth of the TSS of genes and
      the FRiP indicated fraction of mapped reads falling into the peak regions.
    </BaseCard>
    <BaseCard title="Why might web pages load slowly?">
      Reply: ATACdb has advanced storage technology and sufficient bandwidth to meet the needs of most users for the speed of web
      page loading. However, it is not excluded that few users have poor user experience due to network reasons.
    </BaseCard>
    <BaseCard title="What are the respective characteristics of motif scan and TF footprint analysis to identify TFs in chromatin accessible regions?">
      Reply: Motif scan can be used to scan sequences of interest to predict TF binding sites. TF footprints analysis reveals the
      presence of the DNA binding protein at each site, analogous to DNase digestion footprints. Compared to motif scan, footprint
      identification is an accurate way to identify TFs associated with the chromatin accessible regions.
    </BaseCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import BaseCard from '@/components/card/BaseCard.vue';
import '@/assets/less/views/help/Questions.less';

export default defineComponent({
  name: 'Questions',
  props: {
    active: {
      type: String,
      default: () => '6'
    }
  },
  components: { BaseCard },
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
