<template>
  <div id="analysis_enrichment">
    <BaseLoading class="analysis_enrichment">
      <SingleCard :title="{ icon: 'fas fa-list', content: 'Analysis results of genomic region enrichment' }" ref="loading">
      <BaseTable :table-data="tableData" :is-service-paging="false" :table-description="tableDescription">
      </BaseTable>
      </SingleCard>
    </BaseLoading>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import AnalysisApi from '@/api/service/analysisApi';
import BaseTable from '@/components/table/BaseTable.vue';
import {
  ANALYSIS_ENRICHMENT_TABLE_DESCRIPTION,
  analysisEnrichmentBarOption,
  analysisEnrichmentScatterOption
} from '@/assets/ts';
import '@/assets/less/views/analysisResult/AnalysisEnrichment.less';
import { ButtonBase } from '@/service/model/components/button';
import { ElNotification } from 'element-plus';
import SingleCard from '@/components/card/SingleCard.vue';

export default defineComponent({
  name: 'AnalysisEnrichment',
  components: { SingleCard, BaseTable, BaseLoading },
  setup() {
    const route = useRoute();
    const loading = ref();
    const drawer = ref();
    const echarts = ref();
    const data = reactive({
      tableData: [] as Array<any>,
      subTableData: [] as Array<any>,
      echartsData: undefined,
      echartsTitle: ''
    });
    const getEnrichmentData = () => {
      loading.value.startLoading();
      AnalysisApi.analysisEnrichment(route.query).then((res: any) => {
        loading.value.endLoading();
        const { echartsData, enrichmentTableVOList } = res;
        data.echartsData = echartsData;
        data.tableData = enrichmentTableVOList;
      });
    };
    onMounted(() => {
      ElNotification({
        title: 'Wishing you a pleasant browsing experience!',
        message: 'Due to the large volume of data, the results may take some time to load. Thank you for your patience!',
        type: 'success'
      });
      getEnrichmentData();
    });
    const buttonClick = (id: string, item: ButtonBase) => {
      drawer.value.drawer = true;
      data.echartsTitle = item.title;
      const option = id === 'scatter' ? analysisEnrichmentScatterOption(data.echartsData) : analysisEnrichmentBarOption(data.echartsData);
      drawer.value.open().then(() => {
        echarts.value.drawEcharts(option);
      });
    };
    return {
      ...toRefs(data),
      loading,
      drawer,
      echarts,
      buttonClick,
      tableDescription: ANALYSIS_ENRICHMENT_TABLE_DESCRIPTION
    };
  }
});
</script>

