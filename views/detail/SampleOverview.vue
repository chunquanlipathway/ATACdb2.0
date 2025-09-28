<template>
  <BaseLoading id="region_overview" ref="loading">
    <SingleCard :title="{ icon: 'fas fa-th-large', content: 'Sample overview' }" style="height: 65%">
      <LeftRight ref="leftRight">
        <template #left>
          <ArrayTable :table-data="overviewTableData" ref="overviewArrayTable"/>
        </template>
        <template #right>
          <BaseTabs active="cd" :tabs-data="sampleId.includes('Sample_HP') || sampleId.includes('Sample_MP') ? annotationTabs : annotationQCTabs">
            <template #cd>
              <Echarts :resize-value="resizeData" ref="overviewEcharts"/>
            </template>
            <template #qc>
              <table class="table table-hover table-striped">
                <tbody>
                <tr>
                  <td>Mean insert size:</td>
                  <td>{{ meanInsertSize }}</td>
                </tr>
                <tr>
                  <td>Standard deviation:</td>
                  <td>{{ standardDeviation }}</td>
                </tr>
                <tr>
                  <td>TSS enrichment score:</td>
                  <td>{{ tssEnrichmentScore }}</td>
                </tr>
                <tr>
                  <td>FRiP:</td>
                  <td>{{ frip }}</td>
                </tr>
                <tr>
                  <td colspan="2">Diasgnostic plot:</td>
                </tr>
                <tr>
                  <td colspan="2">
                    <BaseImage :url="insertSizeImage"/>
                  </td>
                </tr>
                </tbody>
              </table>
            </template>
            <template #gkmQC>
              <table class="table table-hover table-striped">
                <tbody>
                <tr>
                  <td>gkmQC score:</td>
                  <td>{{ gkmQC }}</td>
                </tr>
                <tr>
                  <td>Average AUC:</td>
                  <td>{{ averageAuc }}</td>
                </tr>
                <tr>
                  <td>Max AUC:</td>
                  <td>{{ maxAuc }}</td>
                </tr>
                <tr>
                  <td>Min AUC:</td>
                  <td>{{ minAuc }}</td>
                </tr>
                <tr>
                  <td colspan="2">gkmQC plot:</td>
                </tr>
                <tr>
                  <td colspan="2">
                    <BaseImage :url="gkmQCSizeImage"/>
                  </td>
                </tr>
                </tbody>
              </table>
            </template>
          </BaseTabs>
        </template>
      </LeftRight>
    </SingleCard>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import SingleCard from '@/components/card/SingleCard.vue';
import '@/assets/less/views/detail/RegionOverview.less';
import DetailApi from '@/api/service/detailApi';
import ArrayTable from '@/components/table/ArrayTable.vue';
import { KeyValue } from '@/service/model/data';
import ArrayUtil from '@/service/util/base/array';
import LeftRight from '@/components/layout/LeftRight.vue';
import {
  genomeOverviewOption, getGEOLink,
  getGSMLink,
  getPubmedLink, getQCHtml,
  getSRRLink,
  STATIC_DETAIL_PATH
} from '@/assets/ts';
import Echarts from '@/components/echarts/Echarts.vue';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import Time from '@/service/util/base/time';
import { TabsBase } from '@/service/model/components/tabs';
import BaseTabs from '@/components/tabs/BaseTabs.vue';
import BaseImage from '@/components/image/BaseImage.vue';

const img = require('@/assets/img/detail/fastqc.png');

export default defineComponent({
  name: 'SampleOverview',
  components: { BaseImage, BaseTabs, BaseLoading, Echarts, LeftRight, ArrayTable, SingleCard },
  props: {
    sampleId: {
      type: String,
      default: () => 'Sample_H_0001'
    }
  },
  setup(props) {
    const loading = ref();
    const leftRight = ref();
    const overviewArrayTable = ref();
    const overviewEcharts = ref();
    const data = reactive({
      overviewTableData: [] as Array<KeyValue>,
      annotationQCTabs: [
        {
          name: 'cd',
          title: 'Chromosome distribution'
        },
        {
          name: 'qc',
          title: 'Quality control'
        },
        {
          name: 'gkmQC',
          title: 'gkmQC'
        }
      ] as Array<TabsBase>,
      annotationTabs: [
        {
          name: 'cd',
          title: 'Chromosome distribution'
        }
      ] as Array<TabsBase>,
      resizeData: {
        width: 580,
        height: 610
      },
      meanInsertSize: '',
      gkmQC: '',
      averageAuc: '',
      maxAuc: '',
      minAuc: '',
      standardDeviation: '',
      tssEnrichmentScore: '',
      frip: '',
      insertSizeImage: '',
      gkmQCSizeImage: '',
      visualizationPlotA: '',
      visualizationPlotB: ''
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
      if (props.sampleId.includes('Sample_H_')) {
        DetailApi.getSampleOverview(props.sampleId).then((res: any) => {
          loading.value.loading = false;
          // Region overview
          data.overviewTableData.push({ key: 'Sample ID:', value: res.sampleId });
          data.overviewTableData.push({ key: 'Species:', value: res.species });
          data.overviewTableData.push({ key: 'Biosample name:', value: res.biosampleName });
          data.overviewTableData.push({ key: 'Biosample type:', value: res.biosampleType });
          data.overviewTableData.push({ key: 'Cell Type:', value: res.cellName });
          data.overviewTableData.push({ key: 'Tissue type:', value: res.tissueType });
          data.overviewTableData.push({ key: 'Disease:', value: res.diseaseType });
          data.overviewTableData.push({ key: 'Region number:', value: res.regionNumber });
          data.overviewTableData.push({ key: 'Base size:', value: `${res.baseSize} bp` });
          data.overviewTableData.push({ key: 'GEO:', value: getGEOLink(res.geoId) });
          data.overviewTableData.push({ key: 'GSM:', value: getGSMLink(res.gsmId) });
          data.overviewTableData.push({ key: 'SRR ID:', value: getSRRLink(res.srrId) });
          data.overviewTableData.push({ key: 'Pubmed ID:', value: getPubmedLink(res.pmId) });
          data.overviewTableData.push({ key: 'knock or Overexpression:', value: res.koncOverexp });
          data.overviewTableData.push({ key: 'Treatment:', value: res.treatment });
          data.overviewTableData.push({ key: 'Time:', value: res.time });
          data.overviewTableData.push({ key: '<img src="https://bio.liclab.net/ATACdb_static/images/fastqc.png" style="width: 35%; height: 15%" alt="000"/>', value: getQCHtml(res) });
          overviewArrayTable.value.formatTable();
          data.meanInsertSize = res.meanInsertSize;
          data.standardDeviation = res.sd;
          data.tssEnrichmentScore = res.tssEnrichmentScore;
          data.frip = res.frip;
          data.gkmQC = res.gkmQC;
          data.averageAuc = res.averageAUC;
          data.maxAuc = res.maxAUC;
          data.minAuc = res.minAUC;
          data.insertSizeImage = `${STATIC_DETAIL_PATH}insert_size/${res.srrId}.insert_size_histogram.png`;
          data.visualizationPlotA = `${STATIC_DETAIL_PATH}peak_annotation/plotA/${res.srrId}_peak_plotAnnoPie.png`;
          data.visualizationPlotB = `${STATIC_DETAIL_PATH}peak_annotation/plotB/${res.srrId}_peak_tagHeatmap.png`;
          data.gkmQCSizeImage = `${STATIC_DETAIL_PATH}gkmQC/${res.sampleId}.gkmqc.curve.png`;
        });
      }
      if (props.sampleId.includes('Sample_M_')) {
        DetailApi.getMouseSampleOverview(props.sampleId).then((res: any) => {
          loading.value.loading = false;
          // Region overview
          data.overviewTableData.push({ key: 'Sample ID:', value: res.sampleId });
          data.overviewTableData.push({ key: 'Species:', value: res.species });
          data.overviewTableData.push({ key: 'Biosample name:', value: res.biosampleName });
          data.overviewTableData.push({ key: 'Biosample type:', value: res.biosampleType });
          data.overviewTableData.push({ key: 'Cell Type:', value: res.cellName });
          data.overviewTableData.push({ key: 'Tissue type:', value: res.tissueType });
          data.overviewTableData.push({ key: 'Disease:', value: res.diseaseType });
          data.overviewTableData.push({ key: 'Region number:', value: res.regionNumber });
          data.overviewTableData.push({ key: 'Base size:', value: `${res.baseSize} bp` });
          data.overviewTableData.push({ key: 'GEO:', value: getGEOLink(res.geoId) });
          data.overviewTableData.push({ key: 'GSM:', value: getGSMLink(res.gsmId) });
          data.overviewTableData.push({ key: 'SRR ID:', value: getSRRLink(res.srrId) });
          data.overviewTableData.push({ key: 'Pubmed ID:', value: getPubmedLink(res.pmId) });
          data.overviewTableData.push({ key: 'knock or Overexpression:', value: res.koncOverexp });
          data.overviewTableData.push({ key: 'Treatment:', value: res.treatment });
          data.overviewTableData.push({ key: 'Time:', value: res.time });
          data.overviewTableData.push({ key: '<img src="https://bio.liclab.net/ATACdb_static/images/fastqc.png" style="width: 35%; height: 15%" alt="000"/>', value: getQCHtml(res) });
          overviewArrayTable.value.formatTable();

          data.meanInsertSize = res.meanInsertSize;
          data.standardDeviation = res.sd;
          data.tssEnrichmentScore = res.tssEnrichmentScore;
          data.frip = res.frip;
          data.gkmQC = res.gkmQC;
          data.averageAuc = res.averageAUC;
          data.maxAuc = res.maxAUC;
          data.minAuc = res.minAUC;
          data.insertSizeImage = `${STATIC_DETAIL_PATH}insert_size/${res.srrId}.insert_size_histogram.png`;
          data.visualizationPlotA = `${STATIC_DETAIL_PATH}peak_annotation/plotA/${res.srrId}_peak_plotAnnoPie.png`;
          data.visualizationPlotB = `${STATIC_DETAIL_PATH}peak_annotation/plotB/${res.srrId}_peak_tagHeatmap.png`;
          data.gkmQCSizeImage = `${STATIC_DETAIL_PATH}gkmQC/${res.sampleId}.gkmqc.curve.png`;
        });
      } else {
        DetailApi.getPseudoBulkSampleOverview(props.sampleId).then((res: any) => {
          loading.value.loading = false;
          // Region overview
          data.overviewTableData.push({ key: 'Sample ID:', value: res.sampleId });
          data.overviewTableData.push({ key: 'Species:', value: res.species });
          data.overviewTableData.push({ key: 'Biosample name:', value: res.biosampleName });
          data.overviewTableData.push({ key: 'Biosample type:', value: res.biosampleType });
          data.overviewTableData.push({ key: 'Tissue type:', value: res.tissueType });
          data.overviewTableData.push({ key: 'Disease:', value: res.diseaseType });
          data.overviewTableData.push({ key: 'Region number:', value: res.regionNumber });
          data.overviewTableData.push({ key: 'GEO:', value: getGEOLink(res.geoId) });
          data.overviewTableData.push({ key: 'Pubmed ID:', value: getPubmedLink(res.pmId) });
          overviewArrayTable.value.formatTable();

          data.gkmQC = res.gkmQC;
          data.averageAuc = res.averageAUC;
          data.maxAuc = res.maxAUC;
          data.minAuc = res.minAUC;
          data.gkmQCSizeImage = `${STATIC_DETAIL_PATH}gkmQC/${res.sampleId}.gkmqc.curve.png`;
          data.visualizationPlotA = `${STATIC_DETAIL_PATH}peak_annotation/plotA/${res.srrId}_peak_plotAnnoPie.png`;
          data.visualizationPlotB = `${STATIC_DETAIL_PATH}peak_annotation/plotB/${res.srrId}_peak_tagHeatmap.png`;
        });
      }
      overviewEcharts.value.startLoading();
      DetailApi.getChromosomeDistribution(props.sampleId).then((res: any) => {
        overviewEcharts.value.endLoading();
        overviewEcharts.value.drawEcharts(genomeOverviewOption(res));
      });
    };
    onMounted(() => {
      getRegionOverview();
    });
    return {
      ...toRefs(data),
      loading,
      img,
      leftRight,
      overviewArrayTable,
      overviewEcharts,
      resize
    };
  }
});
</script>

