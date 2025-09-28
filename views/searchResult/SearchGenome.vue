<template>
  <div id="search_genome">
    <div class="search_genome">
      <!-- Region overview -->
      <SingleCard :title="{ icon: 'fas fa-th-list', content: 'Region overview' }" ref="overviewLoading">
        <LeftRight ref="overviewLeftRight">
          <template #left>
            <ArrayTable :table-data="overviewTableData" :column-pair="1" ref="overviewArrayTable"/>
          </template>
          <template #right>
            <BaseTabs :tabs-data="annotationQCTabs" active="cd" v-if="isPaused">
              <template #cd>
                <Echarts :resize-value="overviewResizeData" ref="overviewEcharts"/>
              </template>
              <template #qc>
                <ArrayTable :table-data="qualityTableData" :column-pair="1" ref="qualityArrayTable"/>
                <BaseImage :url="insertSizeImage"/>
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
            </BaseTabs >
            <BaseTabs :tabs-data="annotationTabs" active="cd" v-if="!isPaused">
              <template #cd>
                <Echarts :resize-value="overviewResizeData" ref="overviewEcharts"/>
              </template>
            </BaseTabs>
          </template>
        </LeftRight>
      </SingleCard>
      <br/>
      <!-- Accessible chromatin region -->
      <SingleCard :title="{ icon: 'fas fa-list', content: 'Accessible chromatin region' }">
        <BaseTable :update-new-data="regionUpdateData" :table-description="regionDescription"/>
      </SingleCard>
      <br/>
      <!-- TF footprint of Biosample name -->
      <SingleCard :title="{ icon: 'fas fa-image', content: `TF footprint of ${biosampleName}` }" ref="footprintLoading" v-show="isPaused">
        <!-- TF footprint of Biosample name-参数 -->
        <div class="footprint_limit">
          <div>
            <BaseSelect title="Number of binding sites threshold: " width="40%" :select-data="sitesThresholdData" is-line ref="sitesThreshold" :change-event="footprintChangeEvent"/>
            <BaseSelect title="Number of binding sites rank: " width="40%" :select-data="sitesRankData" is-line ref="sitesRank" :change-event="sitesRankChangeEvent"/>
          </div>
          <div>
            <BaseSelect title="Protection score threshold: " width="40%" :select-data="scoreThresholdData" is-line ref="scoreThreshold" :change-event="footprintChangeEvent"/>
            <BaseSelect title="Protection score rank: " width="40%" :select-data="scoreRankData" is-line ref="scoreRank" :change-event="scoreRankChangeEvent"/>
          </div>
          <div>
            <BaseSelect title="TC threshold: " width="40%" :select-data="tcThresholdData" is-line ref="tcThreshold" :change-event="footprintChangeEvent"/>
            <BaseSelect title="TC rank: " width="40%" :select-data="tcRankData" is-line ref="tcRank" :change-event="tcRankChangeEvent"/>
          </div>
        </div>
        <!-- TF footprint of Biosample name-信息内容 -->
            <span class="footprint_little_title">Footprint statistics</span>
            <BaseTable :table-data="genomeFootprintTableData" :is-service-paging="false" :pager-count="5" :table-description="genomeFootprintDescription">
              <template #default>
                <!-- Footprint logo -->
                <el-table-column stripe>
                  <template #header>
                    <span style="margin-left: 35%">Logo</span>
                    <BaseTooltip placement="top" content="Footprint logo.">
                      <i class="fas fa-question-circle"></i>
                    </BaseTooltip>
                  </template>
                  <template #default="scope">
                    <img :src="footprintLogoImage(srrId, scope.row.motifName)"
                         @click="showImage(srrId, scope.row.motifName)"
                         alt="Footprint logo"
                         style="height: 100px;width: 100px; margin-left: 22.5%" ref="sampleId">
                  </template>
                </el-table-column>
              </template>
            </BaseTable>
            <span class="footprint_little_title">TC rank</span>
            <Echarts :resize-value="genomeFootprintResizeData" ref="genomeFootprintEcharts"/>
            <div class="notes">
              <div v-for="(item, i) in genomeFootprintEchartsNotes" :key="i">
                <span v-text="item.key"></span>: <span v-text="item.value"></span>
              </div>
            </div>
      </SingleCard>
      <br/>
      <!-- Expression of region associated closest genes (TOP 50) -->
      <SingleCard :title="{ icon: 'fas fa-chart-area', content: 'Expression of region associated closest genes (TOP 50)' }">
        <BaseButton :content="genomeButtonContent" :button-click="buttonClick"/>
        <div class="expression_head_map" ref="expressionHeadMap">
          <canvas id="expression_canvas" width="950" height="600"></canvas>
        </div>
      </SingleCard>
      <br/>
      <!-- Peak annotation visualization of Biosample Name -->
      <PeakAnnotation :sample-id="String(this.$route.query.sampleId)"/>
      <br/>
      <!-- Software and parameters used -->
      <ParamInfo/>
      <br/>
    </div>
  </div>
  <BaseDrawer direction="rtl" ref="drawer">
    <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; font-size: 30px">
      <img :src="img" alt="Drawer Picture" style="width: 80%;height: 70%">
    </div>
  </BaseDrawer>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import '@/assets/less/views/searchResult/SearchGenome.less';
import LeftRight from '@/components/layout/LeftRight.vue';
import ArrayTable from '@/components/table/ArrayTable.vue';
import SingleCard from '@/components/card/SingleCard.vue';
import BaseTabs from '@/components/tabs/BaseTabs.vue';
import { KeyValue } from '@/service/model/data';
import {
  GENOME_REGION_DESCRIPTION,
  GENOME_SITES_THRESHOLD,
  GENOME_SITES_RANK,
  GENOME_SCORE_RANK,
  GENOME_TC_RANK,
  GENOME_SCORE_THRESHOLD,
  GENOME_TC_THRESHOLD,
  GENOME_FOOTPRINT_DESCRIPTION,
  genomeFootprintOption,
  GENOME_FOOTPRINT_ECHARTS_NOTES,
  SOFTWARE_TABLE_DATA,
  GENOME_BUTTON_CONTENT,
  STATIC_DETAIL_PATH,
  getGEOLink,
  getGSMLink,
  getSRRLink,
  getPubmedLink,
  genomeSearchDetialOverviewOption, getQCHtml
} from '@/assets/ts';
import Echarts from '@/components/echarts/Echarts.vue';
import SearchApi from '@/api/service/searchApi';
import ArrayUtil from '@/service/util/base/array';
import BaseImage from '@/components/image/BaseImage.vue';
import BaseTable from '@/components/table/BaseTable.vue';
import { Page } from '@/service/model/reponse/request';
import BaseSelect from '@/components/input/BaseSelect.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import BaseTooltip from '@/components/tooltip/BaseTooltip.vue';
import '@/plugins/canvasxpress';
import Json from '@/service/util/base/json';
import Time from '@/service/util/base/time';
import DetailApi from '@/api/service/detailApi';
import PeakAnnotation from '@/views/detail/PeakAnnotation.vue';
import ParamInfo from '@/views/detail/ParamInfo.vue';
import BaseDrawer from '@/components/drawer/BaseDrawer.vue';
import { TabsBase } from '@/service/model/components/tabs';

export default defineComponent({
  name: 'SearchGenome',
  components: {
    BaseDrawer,
    ParamInfo,
    PeakAnnotation,
    BaseTooltip,
    BaseButton,
    BaseSelect,
    BaseTable,
    BaseImage,
    Echarts,
    BaseTabs,
    SingleCard,
    ArrayTable,
    LeftRight
  },
  setup() {
    const route = useRoute();
    const drawer = ref();
    const overviewLeftRight = ref();
    const overviewArrayTable = ref();
    const overviewEcharts = ref();
    const qualityArrayTable = ref();
    const overviewLoading = ref();
    // TF footprint
    const footprintLoading = ref();
    const sitesThreshold = ref();
    const sitesRank = ref();
    const scoreThreshold = ref();
    const scoreRank = ref();
    const tcThreshold = ref();
    const tcRank = ref();
    const genomeFootprintLeftRight = ref();
    const genomeFootprintEcharts = ref();
    const expressionHeadMap = ref();
    // 响应式数据
    const data = reactive({
      srrId: '',
      img: '',
      genome: {
        sampleId: String(route.query.sampleId),
        chr: String(route.query.chromosome),
        start: Number(route.query.startPosition),
        end: Number(route.query.endPosition),
        page: {
          field: 'TC_score'
        }
      },
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
      biosampleName: '',
      overviewTableData: [] as Array<KeyValue>,
      qualityTableData: [] as Array<KeyValue>,
      genomeFootprintTableData: [] as Array<KeyValue>,
      isPaused: true,
      qualityImage: '',
      gkmQC: '',
      averageAuc: '',
      maxAuc: '',
      minAuc: '',
      gkmQCSizeImage: '',
      insertSizeImage: '',
      visualizationPlotA: '',
      visualizationPlotB: '',
      overviewResizeData: {
        width: 580,
        height: 610
      },
      genomeFootprintResizeData: {
        width: 1000,
        height: 600
      }
    });
    const isShow = () => {
      if (data.genome.sampleId.includes('Sample_HP') || data.genome.sampleId.includes('Sample_MP')) {
        data.isPaused = !data.isPaused;
      }
    };
    // 自适应 Echarts 大小
    const overviewResize = () => {
      Time.sleep(100).then(() => {
        // 设置 echarts 大小
        data.overviewResizeData = {
          width: overviewLeftRight.value.getRightLabel().offsetWidth,
          height: overviewLeftRight.value.getLeftLabel().offsetHeight
        };
      });
    };
    // 得到信息
    const getRegionOverview = () => {
      const sampleId = String(route.query.sampleId);
      if (sampleId.includes('Sample_H_') || sampleId.includes('Sample_M_')) {
        overviewLoading.value.startLoading();
        DetailApi.getSampleOverview(data.genome.sampleId).then((res: any) => {
          overviewLoading.value.endLoading();
          data.srrId = res.srrId as string;
          data.biosampleName = res.biosampleName as string;
          // 添加 Region overview
          ArrayUtil.clear(data.overviewTableData);
          data.overviewTableData.push({ key: 'Sample ID:', value: res.sampleId });
          data.overviewTableData.push({ key: 'Species:', value: res.species });
          data.overviewTableData.push({ key: 'Biosample name:', value: res.biosampleName });
          data.overviewTableData.push({ key: 'Biosample type:', value: res.biosampleType });
          data.overviewTableData.push({ key: 'Cell Type:', value: res.cellName });
          data.overviewTableData.push({ key: 'Tissue type:', value: res.tissueType });
          data.overviewTableData.push({ key: 'Disease:', value: res.diseaseType });
          data.overviewTableData.push({ key: 'Region number:', value: res.regionNumber });
          data.overviewTableData.push({ key: 'Base size:', value: `${res.baseSize} bp` });
          data.overviewTableData.push({ key: 'Chr:', value: data.genome.chr === 'All' ? 'All Chr' : data.genome.chr });
          data.overviewTableData.push({ key: 'Start position:', value: data.genome.start === -1 ? 'Full Sequence' : data.genome.start });
          data.overviewTableData.push({ key: 'End position:', value: data.genome.end === -1 ? 'Full Sequence' : data.genome.end });
          data.overviewTableData.push({ key: 'GEO:', value: getGEOLink(res.geoId) });
          data.overviewTableData.push({ key: 'GSM:', value: getGSMLink(res.gsmId) });
          data.overviewTableData.push({ key: 'SRR ID:', value: getSRRLink(res.srrId) });
          data.overviewTableData.push({ key: 'Pubmed ID:', value: getPubmedLink(res.pmId) });
          data.overviewTableData.push({ key: 'knock or Overexpression:', value: res.koncOverexp });
          data.overviewTableData.push({ key: 'Treatment:', value: res.treatment });
          data.overviewTableData.push({ key: 'Time:', value: res.time });
          overviewArrayTable.value.formatTable();
          // 添加 Quality control
          ArrayUtil.clear(data.qualityTableData);
          data.gkmQC = res.gkmQC;
          data.averageAuc = res.averageAUC;
          data.maxAuc = res.maxAUC;
          data.minAuc = res.minAUC;
          data.qualityTableData.push({ key: 'Mean insert size:', value: res.meanInsertSize });
          data.qualityTableData.push({ key: 'Standard deviation:', value: res.sd });
          data.qualityTableData.push({ key: 'TSS enrichment score:', value: res.tssEnrichmentScore });
          data.qualityTableData.push({ key: 'FRiP:', value: res.frip });
          if (res.qc > 0) {
            data.overviewTableData.push({ key: '<img src="https://bio.liclab.net/ATACdb_static/images/fastqc.png" style="width: 35%; height: 15%" alt="000"/>', value: getQCHtml(res) });
          }
          qualityArrayTable.value.formatTable();
          // 照片
          data.insertSizeImage = `${STATIC_DETAIL_PATH}insert_size/${res.srrId}.insert_size_histogram.png`;
          data.visualizationPlotA = `${STATIC_DETAIL_PATH}peak_annotation/plotA/${res.srrId}_peak_plotAnnoPie.png`;
          data.visualizationPlotB = `${STATIC_DETAIL_PATH}peak_annotation/plotB/${res.srrId}_peak_tagHeatmap.png`;
          data.gkmQCSizeImage = `${STATIC_DETAIL_PATH}gkmQC/${res.sampleId}.gkmqc.curve.png`;
        });
      } else {
        DetailApi.getPseudoBulkSampleOverview(data.genome.sampleId).then((res: any) => {
          overviewLoading.value.loading = false;
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
      DetailApi.getChromosomeDistribution(data.genome.sampleId, data.genome).then((res: any) => {
        overviewEcharts.value.endLoading();
        overviewEcharts.value.drawEcharts(genomeSearchDetialOverviewOption(res));
      });
    };
    // 得到 region 信息
    const regionUpdateData = (page: Page) => DetailApi.listPeakInfo(String(route.query.sampleId), {
      sampleId: String(route.query.sampleId),
      chr: String(route.query.chromosome),
      start: Number(route.query.startPosition),
      end: Number(route.query.endPosition),
      page
    });
    const footprintLogoImage = (srrId: string, motifName: string) => `${STATIC_DETAIL_PATH}tf_footprint/footprint/${srrId}/${motifName}.png`;
    const showImage = (srrId: string, motifName: string) => {
      drawer.value.drawer = true;
      data.img = footprintLogoImage(srrId, motifName);
    };
    const genomeFootprintResize = () => {
      Time.sleep(100).then(() => {
        // 设置 echarts 大小
        if (genomeFootprintLeftRight.value) {
          data.genomeFootprintResizeData = {
            width: genomeFootprintLeftRight.value.getRightLabel().offsetWidth,
            height: genomeFootprintLeftRight.value.getLeftLabel().offsetHeight - 235
          };
        }
      });
    };
    // 得到 footprint 信息
    const genomeFootprintResult = (limitCount: number, field = 'f_tc_score') => {
      footprintLoading.value.startLoading();
      // 添加字段
      Json.addItem(data.genome, 'page', {
        field
      });
      DetailApi.genomeFootprintResult(data.genome.sampleId, {
        genomeVO: data.genome,
        sitesThreshold: sitesThreshold.value.select,
        sitesRank: sitesRank.value.select,
        scoreThreshold: scoreThreshold.value.select,
        scoreRank: scoreRank.value.select,
        tcThreshold: tcThreshold.value.select,
        tcRank: tcRank.value.select,
        limitCount
      }).then((res: any) => {
        const { tfFootprintList, echartsData } = res;
        footprintLoading.value.endLoading();
        data.genomeFootprintTableData = tfFootprintList;
        // echarts 图
        genomeFootprintEcharts.value.drawEcharts(genomeFootprintOption(echartsData));
        genomeFootprintResize();
      });
    };
    // 画热图
    const plotHeatMap = (data: any) => {
      // 需要先重新添加
      expressionHeadMap.value.innerHTML = '<canvas id="expression_canvas" width="950" height="600"></canvas>';
      // @ts-ignore CanvasXpress 这个在 ts 中报错, 忽略下一行一切错误
      // eslint-disable-next-line no-undef,no-new
      new CanvasXpress('expression_canvas', {
        x: {
          names: data.ylabelList
        },
        y: {
          data: data.data,
          vars: data.xlabelList,
          smps: data.ylabelList
        }
      }, {
        clusterAxis: 'variables',
        colorSpectrum: [
          'white',
          'blue',
          'red'
        ],
        graphType: 'Heatmap',
        heatmapIndicatorHeight: 50,
        heatmapIndicatorHistogram: true,
        heatmapIndicatorPosition: 'topLeft',
        heatmapIndicatorWidth: 80,
        samplesClustered: true,
        variablesClustered: true,
        xAxisTitle: 'FPKM range',
        highlightVar: ['DBP']
      });
    };
    // 得到 footprint 信息
    const closestGenesExpression = (table: string) => {
      SearchApi.closestGenesExpression(String(route.query.sampleId), table, 50, data.genome).then((res: any) => {
        plotHeatMap(res);
      });
    };
    onMounted(() => {
      isShow();
      data.genome = {
        sampleId: String(route.query.sampleId),
        chr: String(route.query.chromosome),
        start: Number(route.query.startPosition),
        end: Number(route.query.endPosition),
        page: {
          field: 'f_tc_score'
        }
      };
      sitesThreshold.value.select = GENOME_SITES_THRESHOLD[0].value;
      scoreThreshold.value.select = GENOME_SCORE_THRESHOLD[0].value;
      tcThreshold.value.select = GENOME_TC_THRESHOLD[0].value;
      sitesRank.value.select = GENOME_SITES_RANK[0].value;
      scoreRank.value.select = GENOME_SCORE_RANK[0].value;
      tcRank.value.select = GENOME_TC_RANK[0].value;
      getRegionOverview();
      genomeFootprintResult(-1);
      // plotHeatMap(null);
      closestGenesExpression(GENOME_BUTTON_CONTENT[0].id);
      window.onresize = () => {
        overviewResize();
        genomeFootprintResize();
      };
    });
    // 印记信息
    const footprintChangeEvent = () => {
      if (sitesRank.value.select !== -1) {
        genomeFootprintResult(sitesRank.value.select, 'f_number');
      } else if (scoreRank.value.select !== -1) {
        genomeFootprintResult(scoreRank.value.select, 'f_protection_score');
      } else if (tcRank.value.select !== -1) {
        genomeFootprintResult(tcRank.value.select, 'f_tc_score');
      } else {
        genomeFootprintResult(-1, 'f_tc_score');
      }
    };
    const sitesRankChangeEvent = (value: number) => {
      scoreRank.value.select = -1;
      tcRank.value.select = -1;
      genomeFootprintResult(value, 'f_number');
    };
    const scoreRankChangeEvent = (value: number) => {
      sitesRank.value.select = -1;
      tcRank.value.select = -1;
      genomeFootprintResult(value, 'f_protection_score');
    };
    const tcRankChangeEvent = (value: number) => {
      sitesRank.value.select = -1;
      scoreRank.value.select = -1;
      genomeFootprintResult(value, 'f_tc_score');
    };
    // 热图信息
    const buttonClick = (id: string) => {
      closestGenesExpression(id);
    };
    return {
      ...toRefs(data),
      drawer,
      overviewLeftRight,
      overviewArrayTable,
      overviewEcharts,
      qualityArrayTable,
      overviewLoading,
      footprintLoading,
      sitesThreshold,
      sitesRank,
      scoreThreshold,
      scoreRank,
      tcThreshold,
      tcRank,
      genomeFootprintLeftRight,
      genomeFootprintEcharts,
      expressionHeadMap,
      isShow,
      showImage,
      regionUpdateData,
      footprintLogoImage,
      buttonClick,
      footprintChangeEvent,
      sitesRankChangeEvent,
      scoreRankChangeEvent,
      tcRankChangeEvent,
      regionDescription: GENOME_REGION_DESCRIPTION,
      sitesThresholdData: GENOME_SITES_THRESHOLD,
      sitesRankData: GENOME_SITES_RANK,
      scoreThresholdData: GENOME_SCORE_THRESHOLD,
      scoreRankData: GENOME_SCORE_RANK,
      tcThresholdData: GENOME_TC_THRESHOLD,
      tcRankData: GENOME_TC_RANK,
      genomeFootprintDescription: GENOME_FOOTPRINT_DESCRIPTION,
      genomeFootprintEchartsNotes: GENOME_FOOTPRINT_ECHARTS_NOTES,
      genomeButtonContent: GENOME_BUTTON_CONTENT,
      softwareTableData: SOFTWARE_TABLE_DATA
    };
  }
});
</script>
