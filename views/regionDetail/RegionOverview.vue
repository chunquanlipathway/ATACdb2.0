<template>
  <BaseLoading id="region_overview" ref="loading">
    <SingleCard :title="{ icon: 'fas fa-th-large', content: 'Region overview' }">
      <LeftRight ref="leftRight">
        <template #left>
          <ArrayTable :table-data="overviewTableData" ref="overviewArrayTable"/>
        </template>
        <template #right>
          <Echarts :resize-value="resizeData" ref="overviewEcharts"/>
        </template>
      </LeftRight>
    </SingleCard>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import SingleCard from '@/components/card/SingleCard.vue';
import '@/assets/less/views/detail/RegionOverview.less';
import ArrayTable from '@/components/table/ArrayTable.vue';
import { KeyValue } from '@/service/model/data';
import ArrayUtil from '@/service/util/base/array';
import LeftRight from '@/components/layout/LeftRight.vue';
import { ATACdbUrl, overviewGraphOption, UCSCurl } from '@/assets/ts';
import Echarts from '@/components/echarts/Echarts.vue';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import Time from '@/service/util/base/time';
import RegionDetailApi from '@/api/service/regionDetailApi';

export default defineComponent({
  name: 'RegionOverview',
  components: { BaseLoading, Echarts, LeftRight, ArrayTable, SingleCard },
  props: {
    sampleId: {
      type: String,
      default: () => 'Sample_0001'
    },
    regionId: {
      type: String,
      default: () => 'Sample_0001'
    }
  },
  setup(props) {
    const loading = ref();
    const leftRight = ref();
    const overviewArrayTable = ref();
    const overviewEcharts = ref();
    const data = reactive({
      overviewTableData: [] as Array<KeyValue>,
      resizeData: {
        width: 680,
        height: 400
      }
    });
    const resize = () => {
      Time.sleep(100).then(() => {
        data.resizeData = {
          width: leftRight.value.getRightLabel().offsetWidth,
          height: leftRight.value.getLeftLabel().offsetHeight
        };
      });
    };
    const getRegionOverview = () => {
      loading.value.loading = true;
      ArrayUtil.clear(data.overviewTableData);
      RegionDetailApi.getRegionOverview(props.sampleId, props.regionId).then((res: any) => {
        if (props.sampleId.includes('Sample_H_') || props.sampleId.includes('Sample_M_')) {
          loading.value.loading = false;
          const { sampleOverview } = res;
          // Region overview
          data.overviewTableData.push({ key: 'Region ID:', value: `${res.sampleId}_${res.regionId}` });
          data.overviewTableData.push({ key: 'Biosample name:', value: sampleOverview.biosampleName });
          data.overviewTableData.push({ key: 'Tissue type:', value: sampleOverview.tissueType });
          data.overviewTableData.push({ key: 'Genomic region:', value: `${res.chr}:${res.start}-${res.end}` });
          data.overviewTableData.push({ key: 'Region length:', value: `${res.size} bp` });
          data.overviewTableData.push({ key: 'Fold change:', value: res.foldChange });
          data.overviewTableData.push({ key: '-Log10Pvalue:', value: res.pvalue });
          data.overviewTableData.push({ key: '-Log10Qvalue:', value: res.qvalue });
          const ucscHref = `<a href="${UCSCurl(sampleOverview.region)}" target="_blank" class="UCSC_style">UCSC</a>`;
          const loc = `${res.chr}:${res.start}..${res.end}`;
          const Track = `${res.sampleId}.bed`;
          const ATACdbHref = `<a href="${ATACdbUrl(loc, Track)}" target="_blank" class="ATACdb_style">ATACdb</a>`;
          data.overviewTableData.push({
            key: 'Genome browser <i class="fas fa-question-circle" title="human reference genome (hg19)"></i> :',
            value: ucscHref + ATACdbHref
          });
          overviewArrayTable.value.formatTable();
        } else {
          loading.value.loading = false;
          const { pseudoBulkOverview } = res;

          // Region overview
          data.overviewTableData.push({ key: 'Region ID:', value: `${res.sampleId}_${res.regionId}` });
          data.overviewTableData.push({ key: 'Biosample name:', value: pseudoBulkOverview.biosampleName });
          data.overviewTableData.push({ key: 'Tissue type:', value: pseudoBulkOverview.tissueType });
          data.overviewTableData.push({ key: 'Genomic region:', value: `${res.chr}:${res.start}-${res.end}` });
          data.overviewTableData.push({ key: 'Region length:', value: `${res.size} bp` });
          const ucscHref = `<a href="${UCSCurl(pseudoBulkOverview.region)}" target="_blank" class="UCSC_style">UCSC</a>`;
          const loc = `${res.chr}:${res.start}..${res.end}`;
          const Track = `${res.sampleId}.bed`;
          const ATACdbHref = `<a href="${ATACdbUrl(loc, Track)}" target="_blank" class="ATACdb_style">ATACdb</a>`;
          data.overviewTableData.push({
            key: 'Genome browser <i class="fas fa-question-circle" title="human reference genome (hg19)"></i> :',
            value: ucscHref + ATACdbHref
          });
          overviewArrayTable.value.formatTable();
        }
      });
      RegionDetailApi.getRegionTfGeneGraph(props.sampleId, props.regionId).then((res: any) => {
        const graphOption = overviewGraphOption(res);
        overviewEcharts.value.drawEcharts(graphOption);
      });
    };
    onMounted(() => {
      getRegionOverview();
    });
    return {
      ...toRefs(data),
      loading,
      leftRight,
      overviewArrayTable,
      overviewEcharts,
      resize
    };
  }
});
</script>

