<template>
  <div id="sample">
    <h3>Sample classification</h3>
    <BaseInput title="Biosample type" placeholder="It is necessary,eg.Cell Line." ref="bioSampleType"/>
    <BaseInput title="Tissue type" placeholder="It is necessary,eg.Lung." ref="tissueType"/>
    <BaseInput title="Biosample name" placeholder="It is necessary,eg.H1703." ref="bioSampleName"/>
    <BaseInput title="Cancer type" placeholder="It is necessary,eg.Lung cancer." ref="cancerType"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import BaseInput from '@/components/input/BaseInput.vue';
import '@/assets/less/views/submit/Sample.less';

export default defineComponent({
  name: 'Sample',
  components: { BaseInput },
  setup() {
    const bioSampleType = ref();
    const tissueType = ref();
    const cancerType = ref();
    const bioSampleName = ref();
    const setBioSampleType = (value = '') => {
      bioSampleType.value.input = value;
    };
    const setTissueType = (value = '') => {
      tissueType.value.input = value;
    };
    const setCancerType = (value = '') => {
      cancerType.value.input = value;
    };
    const setBioSampleName = (value = '') => {
      bioSampleName.value.input = value;
    };
    return {
      bioSampleType,
      tissueType,
      cancerType,
      bioSampleName,
      setBioSampleType,
      setTissueType,
      setCancerType,
      setBioSampleName,
      getBioSampleType: () => bioSampleType.value.input,
      getTissueType: () => tissueType.value.input,
      getCancerType: () => cancerType.value.input,
      getBioSampleName: () => bioSampleName.value.input
    };
  }
});
</script>
