<template>
  <div id="search">
    <div class="search">
      <h2 class="title">
        Search
      </h2>
      <el-divider></el-divider>
      <BaseCollapse active-name="genome" :collapse-data="collapseData" :change="change" ref="loading">
        <template #genome>
          <GenomeLocation @startLoading="startLoading" @endLoading="endLoading"/>
        </template>
        <template #tissue>
          <Tissue ref="tissue"/>
        </template>
        <template #TF>
          <Tf/>
        </template>
        <template #gene>
          <Gene/>
        </template>
        <template #commonSnp>
          <CommonSnp/>
        </template>
      </BaseCollapse>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Tf from '@/views/search/Tf.vue';
import Gene from '@/views/search/Gene.vue';
import GenomeLocation from '@/views/search/GenomeLocation.vue';
import Tissue from '@/views/search/Tissue.vue';
import '@/assets/less/views/Search.less';
import BaseCollapse from '@/components/collapse/BaseCollapse.vue';
import { SEARCH_COLLAPSE_DATA } from '@/assets/ts';
import CommonSnp from '@/views/search/CommonSnp.vue';

export default defineComponent({
  name: 'Search',
  components: { CommonSnp, BaseCollapse, Tissue, GenomeLocation, Gene, Tf },
  setup() {
    const tissue = ref();
    const loading = ref();
    const change = (val: string) => {
      if (val === 'tissue') {
        tissue.value.resize();
      }
    };
    const startLoading = () => {
      loading.value.startLoading();
    };
    const endLoading = () => {
      loading.value.endLoading();
    };
    return {
      tissue,
      loading,
      change,
      collapseData: SEARCH_COLLAPSE_DATA,
      startLoading,
      endLoading
    };
  }
});
</script>
<style>
.base_collapse_template .el-collapse-item__wrap {
  border-left: 2px solid #e4e7ed;
  border-bottom: 2px solid #e4e7ed;
  border-right: 1px solid #e4e7ed;
}
</style>

