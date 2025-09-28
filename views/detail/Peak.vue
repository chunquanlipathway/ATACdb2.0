<template>
  <BaseLoading id="peak" ref="loading">
    <!-- Accessible chromatin region -->
    <SingleCard :title="peak_title">
      <BaseTable :update-new-data="regionUpdateData" :table-description="isBulk ? regionDescription : regionPesudoBulkDescription" v-show="!isMouse"/>
      <BaseTable :update-new-data="regionUpdateData" :table-description="isBulk ? regionMouseDescription : regionPesudoBulkMouseDescription" v-show="isMouse"/>
    </SingleCard>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import SingleCard from '@/components/card/SingleCard.vue';
import '@/assets/less/views/detail/RegionOverview.less';
import DetailApi from '@/api/service/detailApi';
import {
  GENOME_MOUSE_REGION_DESCRIPTION,
  GENOME_PESUDOBULK_MOUSE_REGION_DESCRIPTION,
  GENOME_PESUDOBULK_REGION_DESCRIPTION,
  GENOME_REGION_DESCRIPTION,
  STATIC_DOWNLOAD_PATH
} from '@/assets/ts';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import BaseTable from '@/components/table/BaseTable.vue';
import { Page } from '@/service/model/reponse/request';

export default defineComponent({
  name: 'Peak',
  components: { BaseTable, BaseLoading, SingleCard },
  props: {
    sampleId: {
      type: String,
      default: () => 'Sample_0001'
    }
  },
  setup(props) {
    const data = reactive({
      isMouse: false,
      isBulk: false
    });
    const getPeakDownload = () => `${STATIC_DOWNLOAD_PATH}Accessible_chromatin_region/csv/${props.sampleId}.csv`;
    const isShow = () => {
      data.isMouse = !(props.sampleId.includes('Sample_H_') || props.sampleId.includes('Sample_HP_'));
      data.isBulk = (props.sampleId.includes('Sample_H_') || props.sampleId.includes('Sample_M_'));
    };
    const regionUpdateData = (page: Page) => DetailApi.listPeakInfo(props.sampleId, { page });
    const loading = ref();
    const leftRight = ref();
    onMounted(() => {
      isShow();
    });
    return {
      ...toRefs(data),
      loading,
      isShow,
      leftRight,
      regionUpdateData,
      regionDescription: GENOME_REGION_DESCRIPTION,
      regionPesudoBulkDescription: GENOME_PESUDOBULK_REGION_DESCRIPTION,
      regionMouseDescription: GENOME_MOUSE_REGION_DESCRIPTION,
      regionPesudoBulkMouseDescription: GENOME_PESUDOBULK_MOUSE_REGION_DESCRIPTION,
      peak_title: {
        icon: 'fas fa-list',
        // eslint-disable-next-line global-require,max-len
        content: `Accessible chromatin region of ${props.sampleId} <a class="margin_left_right" href='${getPeakDownload()}' target="_blank"><img alt="peak_download" src="${require('@/assets/img/detail/download.png')}" class="log_download"></a>`
      }
    };
  }
});
</script>
<style>
.title {
  img {
    width: 3%;
    float: right;
  }
}
#peak .el-button path {
  display: inline-flex;
  align-items: center;
  color: black;
}
</style>
