<template>
  <div id="analysis">
    <div class="analysis">
      <h2 class="title">
        Analysis
      </h2>
      <el-divider></el-divider>
      <BaseCollapse active-name="sampleSimilar" :collapse-data="collapseData" ref="loading">
        <template #sampleSimilar>
          <SampleSimilar @startLoading="startLoading" @endLoading="endLoading"/>
        </template>
        <template #tfBound>
          <TfBound/>
        </template>
        <template #enrichment>
          <Enrichment @startLoading="startLoading" @endLoading="endLoading"/>
        </template>
        <template #geneScore>
          <GeneScore @startLoading="startLoading" @endLoading="endLoading"/>
        </template>
      </BaseCollapse>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import BaseCollapse from '@/components/collapse/BaseCollapse.vue';
import { ANALYSIS_COLLAPSE_DATA } from '@/assets/ts';
import SampleSimilar from '@/views/analysis/SampleSimilar.vue';
import TfBound from '@/views/analysis/TfBound.vue';
import Enrichment from '@/views/analysis/Enrichment.vue';
import '@/assets/less/views/Analysis.less';
import GeneScore from '@/views/analysis/GeneScore.vue';

export default defineComponent({
  name: 'Analysis',
  components: { GeneScore, TfBound, Enrichment, SampleSimilar, BaseCollapse },
  setup() {
    const loading = ref();
    const startLoading = () => {
      loading.value.startLoading();
    };
    const endLoading = () => {
      loading.value.endLoading();
    };
    return {
      loading,
      collapseData: ANALYSIS_COLLAPSE_DATA,
      startLoading,
      endLoading
    };
  }
});
</script>
<style>
#sample_similar .left .sample1 {
  color: #FFF;
  padding: 5px 10px;
  margin-bottom: 5px;
  display: inline-block;
  font-size: 13px;
  font-weight: bold;
  border-radius: 5px;
  background-color: #706acc;
}
#sample_similar .left .sample2 {
  color: #FFF;
  padding: 5px 10px;
  margin-bottom: 5px;
  display: inline-block;
  font-size: 13px;
  font-weight: bold;
  border-radius: 5px;
  background-color: #ea6767;
  margin-top: 20px;
}
.el-radio-button__original-radio:checked + .el-radio-button__inner {
  color: var(--el-radio-button-checked-text-color,var(--el-color-white));
  background-color: #706acc;
  border-color:  #706acc;
  box-shadow: -1px 0 0 0 var(#706acc,var(--el-color-primary));
}
.base_collapse_template .el-collapse-item__wrap {
  border-left: 2px solid #e4e7ed;
  border-bottom: 2px solid #e4e7ed;
  border-right: 1px solid #e4e7ed;
}
</style>
