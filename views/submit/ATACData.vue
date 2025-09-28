<template>
  <div id="ATAC_data">
    <h3>ATAC-seq data Information</h3>
    <BaseInput title="Links to Data Source" placeholder="It is necessary,eg.https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE121755" ref="dataSource"/>
    <BaseInput title="Pubmed ID" placeholder="Non-essential option,eg.30718506." ref="pubmedId"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import BaseInput from '@/components/input/BaseInput.vue';
import '@/assets/less/views/submit/ATACData.less';

export default defineComponent({
  name: 'ATACData',
  components: { BaseInput },
  setup() {
    const dataSource = ref();
    const pubmedId = ref();
    const setDataSource = (value = '') => {
      dataSource.value.input = value;
    };
    const setPubmedId = (value = '') => {
      pubmedId.value.input = value;
    };
    return {
      dataSource,
      pubmedId,
      setDataSource,
      setPubmedId,
      getDataSource: () => dataSource.value.input,
      getPubmedId: () => pubmedId.value.input
    };
  }
});
</script>
