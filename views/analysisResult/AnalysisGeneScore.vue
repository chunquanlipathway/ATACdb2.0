<template>
  <div id="analysis_gene_score">
    <BaseLoading class="analysis_gene_score" ref="loading">
      <!-- gene_body_car -->
      <SingleCard :title="{ icon: 'fas fa-list', content: 'Gene body car' }">
        <BaseTable :table-data="sampleTableData"
                   :is-service-paging="false"
                   :table-description="sampleDescription"
                   :page-sizes="[7, 10, 15, 25, 30, 40, 50, 100]"
                   layout="total, prev, pager, next"
                   :page-event="samplePageEvent"
                   :sort-change="samplePageEvent"
                   is-selection
                   :selection-change="sampleSelectionChange"
                   :is-select-change="sampleIsSelectChange"
                   ref="sampleTable">
        </BaseTable>
        <BaseTable :table-data="geneCarData" :is-service-paging="false" :table-description="geneCarDescription" ref="geneBodyCar"/>
      </SingleCard>
      <br/>
      <!-- gene_body_score -->
      <SingleCard :title="{ icon: 'fas fa-list', content: 'Gene body score' }">
        <BaseTable :table-data="geneScoreData" :is-service-paging="false" :table-description="geneScoreDescription" ref="geneBodyScore"/>
      </SingleCard>
      <br/>
      <!-- Expression of region associated genes -->
      <SingleCard :title="{ icon: 'fas fa-chart-area', content: 'Expression of region associated genes' }">
        <BaseButton :content="expressionButtonContent" :button-click="buttonClick"/>
        <div v-show="isValue" class="expression_head_map" ref="expressionHeadMap">
          <canvas id="expression_canvas" width="950" height="600"></canvas>
        </div>
        <h3 v-show="!isValue" class="gene_one">The number of coding genes are less than two，unable to draw effectively! </h3>
      </SingleCard>
    </BaseLoading>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import SingleCard from '@/components/card/SingleCard.vue';
import { useRoute, useRouter } from 'vue-router';
import Base from '@/service/util/base/base';
import Jump from '@/service/util/base/jump';
import Message from '@/service/util/base/message';
import BaseTable from '@/components/table/BaseTable.vue';
import '@/plugins/canvasxpress';
import AnalysisApi from '@/api/service/analysisApi';
import BaseButton from '@/components/button/BaseButton.vue';
import {
  ANALYSIS_GENE_CAR_DESCRIPTION,
  ANALYSIS_GENE_SCORE_DESCRIPTION,
  GENOME_BUTTON_CONTENT,
  SEARCH_SAMPLE_TABLE_DESCRIPTION
} from '@/assets/ts';
import '@/assets/less/views/analysisResult/AnalysisGeneScore.less';
import { ElNotification } from 'element-plus';
import { InputSelect } from '@/service/model/components/input';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import FileApi from '@/api/service/fileApi';
import Time from '@/service/util/base/time';

export default defineComponent({
  name: 'AnalysisGeneScore',
  components: { BaseLoading, BaseButton, BaseTable, SingleCard },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const loading = ref();
    const biosampleName = ref();
    const sampleId = ref();
    const geneBodyCar = ref();
    const geneBodyScore = ref();
    const expressionHeadMap = ref();
    const sampleTable = ref();
    const data = reactive({
      sampleId: '' as string,
      sampleTableData: [] as any,
      geneCarData: [] as any,
      geneScoreData: [] as any,
      fileId: '',
      sampleIsSelectChange: true as boolean,
      biosampleNameData: [] as Array<InputSelect>,
      sampleIdData: [] as Array<InputSelect>,
      bodyCarData: [] as Array<any>,
      bodyScoreData: [] as Array<any>,
      isValue: true,
      sampleIdValue: false
    });
    const geneCarUpdateData = () => {
      geneBodyCar.value.startLoading();
      AnalysisApi.listGeneCar(data.fileId, String(route.query.speciesType), data.sampleId).then((res: any) => {
        data.geneCarData = res;
        geneBodyCar.value.endLoading();
      });
    };
    const geneScoreUpdateData = () => {
      geneBodyScore.value.startLoading();
      AnalysisApi.listGeneScore(data.fileId, String(route.query.speciesType), data.sampleId).then((res: any) => {
        console.log(res);
        data.geneScoreData = res;
        geneBodyScore.value.endLoading();
      });
    };
    const sampleSelectionChange = (val: any) => {
      if (val.length > 1) {
        data.sampleIsSelectChange = false;
        sampleTable.value.selectionToggleChange(val.slice(0, val.length - 1));
        data.sampleIsSelectChange = true;
      } else if (val.length === 1) {
        data.sampleId = val[0].sampleId;
      }
      geneCarUpdateData();
      geneScoreUpdateData();
    };
    const samplePageEvent = () => {
      const sampleShowData = sampleTable.value.showData.filter((item: any) => item.sampleId === data.sampleId);
      if (Base.noNull(sampleShowData)) {
        Time.delay(() => {
          sampleTable.value.selectionToggleChange(sampleShowData);
        }, 300);
      }
    };

    const getSampleData = () => {
      sampleTable.value.startLoading();
      AnalysisApi.listSampleByTissueAndGene(String(route.query.speciesType), String(route.query.tissueType)).then((res: any) => {
        data.sampleTableData = res;
        data.sampleId = data.sampleTableData[0].sampleId;
        sampleTable.value.endLoading();
        geneCarUpdateData();
        geneCarUpdateData();
      });
    };

    const plotHeatMap = (data: any) => {
      expressionHeadMap.value.innerHTML = '<canvas id="expression_canvas" width="950" height="600"></canvas>';
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
    const geneExpression = (table: string) => {
      AnalysisApi.geneExpression(table, data.fileId).then((res: any) => {
        if (Base.isNull(res) || (res.data as number[][]).length < 2) {
          data.isValue = false;
        } else {
          plotHeatMap(res);
        }
      });
    };
    const changeSampleId = () => {
      geneExpression(GENOME_BUTTON_CONTENT[0].id);
    };
    onMounted(() => {
      ElNotification({
        title: 'Wishing you a pleasant browsing experience!',
        message: 'Due to the large volume of data, the results may take some time to load. Thank you for your patience!',
        type: 'success'
      });
      if (Base.isNull(route.query.fileId) && Base.isNull(route.query.content)) {
        Jump.routerDefault(router, '/');
        Message.warning(`${route.fullPath}: The path is not feasible!`);
      }

      if (Base.isNull(route.query.fileId) && Base.noNull(route.query.content)) {
        FileApi.formatFile(String(route.query.content)).then((res: any) => {
          data.fileId = res as string;
          getSampleData();
          geneExpression(GENOME_BUTTON_CONTENT[0].id);
        });
      } else {
        data.fileId = String(route.query.fileId);
        getSampleData();
        geneExpression(GENOME_BUTTON_CONTENT[0].id);
      }
      Time.delay(() => {
        sampleTable.value.selectionToggleChange([data.sampleTableData[0]]);
      }, 600);
    });
    watch(() => (sampleId.value ? sampleId.value.select : undefined), (newValue) => {
      if (newValue && newValue !== '') {
        Time.sleep(1).then(() => {
          data.sampleIdValue = true;
        });
      }
    }, {
      immediate: true,
      deep: true
    });
    const buttonClick = (id: string) => {
      geneExpression(id);
    };
    return {
      samplePageEvent,
      ...toRefs(data),
      loading,
      biosampleName,
      sampleTable,
      sampleId,
      geneBodyCar,
      geneBodyScore,
      expressionHeadMap,
      changeSampleId,
      geneCarUpdateData,
      geneScoreUpdateData,
      sampleSelectionChange,
      buttonClick,
      sampleDescription: SEARCH_SAMPLE_TABLE_DESCRIPTION,
      geneCarDescription: ANALYSIS_GENE_CAR_DESCRIPTION,
      geneScoreDescription: ANALYSIS_GENE_SCORE_DESCRIPTION,
      expressionButtonContent: GENOME_BUTTON_CONTENT
    };
  }
});
</script>

