<template>
  <div id="search_gene">
    <div class="search_gene">
      <!-- Gene overview -->
      <SingleCard :title="{ icon: 'fas fa-th-list', content: 'Gene overview' }" ref="overviewLoading">
        <LeftRight ref="overviewLeftRight">
          <template #left>
            <ArrayTable :table-data="overviewTableData" :column-pair="1" ref="overviewArrayTable"/>
          </template>
          <template #right>
            <Echarts :resize-value="overviewResizeData" ref="overviewEcharts"/>
          </template>
        </LeftRight>
      </SingleCard>
      <br/>
      <!-- Accessible chromatin region -->
      <SingleCard :title="{ icon: 'fas fa-list', content: 'Accessible chromatin region' }" ref="regionLoading">
          <BaseTable :table-data="sampleTableData"
                     :is-service-paging="false"
                     :table-description="regionDescription"
                     :page-sizes="[7, 10, 15, 25, 30, 40, 50, 100]"
                     layout="total, prev, pager, next"
                     :page-event="samplePageEvent"
                     :sort-change="samplePageEvent"
                     is-selection
                     :selection-change="sampleSelectionChange"
                     :is-select-change="sampleIsSelectChange"
                     ref="sampleTable">
          </BaseTable>
          <BaseTable :table-data="geneMapperTableData" :is-service-paging="false" :table-description="mapperDescription" ref="regionTable"/>
      </SingleCard>
      <br/>
      <!-- Disease information of Gene Name -->
      <SingleCard :title="{ icon: 'fas fa-list', content: `Disease information of ${geneName}` }" ref="regionLoading">
        <BaseTable :table-data="diseaseData" :is-service-paging="false" :table-description="diseaseDescription"/>
      </SingleCard>
      <br/>
      <!-- Expression of Gene Name -->
      <SingleCard :title="{ icon: 'fas fa-chart-bar', content: `Expression of ${geneName}` }" ref="expressionSingleCard">
        <BaseButton :content="buttonContent" :button-click="buttonClick"/>
        <Echarts :resize-value="expressionResizeData" ref="expressionEcharts"/>
      </SingleCard>
      <br/>
      <!-- Software and parameters used -->
      <SingleCard :title="{ icon: 'fas fa-th-list', content: 'Software and parameters used' }">
        <ArrayTable :table-data="softwareTableData" :column-pair="1"/>
      </SingleCard>
      <br/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import '@/assets/less/views/searchResult/SearchGene.less';
import SingleCard from '@/components/card/SingleCard.vue';
import LeftRight from '@/components/layout/LeftRight.vue';
import ArrayTable from '@/components/table/ArrayTable.vue';
import Echarts from '@/components/echarts/Echarts.vue';
import { KeyValue } from '@/service/model/data';
import Base from '@/service/util/base/base';
import Jump from '@/service/util/base/jump';
import Message from '@/service/util/base/message';
import SearchApi from '@/api/service/searchApi';
import ArrayUtil from '@/service/util/base/array';
import {
  BUTTON_CONTENT,
  SOFTWARE_TABLE_DATA,
  expressionOption,
  overviewOption,
  GENE_DISEASE_DESCRIPTION,
  SEARCH_SAMPLE_TABLE_DESCRIPTION,
  GENE_MAPPER_DESCRIPTION
} from '@/assets/ts';
import BaseTable from '@/components/table/BaseTable.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import { ButtonBase } from '@/service/model/components/button';
import Time from '@/service/util/base/time';
import { ElNotification } from 'element-plus';

export default defineComponent({
  name: 'SearchGene',
  components: { BaseButton, BaseTable, Echarts, ArrayTable, LeftRight, SingleCard },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const sampleTable = ref();
    const regionTable = ref();
    const overviewLoading = ref();
    const overviewLeftRight = ref();
    const overviewArrayTable = ref();
    const overviewEcharts = ref();
    const regionLoading = ref();
    const expressionSingleCard = ref();
    const expressionEcharts = ref();
    const data = reactive({
      geneName: '',
      sampleId: '' as string,
      overviewTableData: [] as Array<KeyValue>,
      sampleTableData: [] as any,
      geneMapperTableData: [] as Array<KeyValue>,
      diseaseData: [] as Array<any>,
      sampleIsSelectChange: true as boolean,
      overviewResizeData: {
        width: 650,
        height: 600
      },
      expressionResizeData: {
        width: 1200,
        height: 600
      }
    });
    // 得到基因信息
    const getGeneInformation = () => {
      // 开启加载动画
      overviewLoading.value.startLoading();
      SearchApi.getGeneInformation(String(route.query.speciesType), data.geneName).then((res: any) => {
        ArrayUtil.clear(data.overviewTableData);
        data.overviewTableData.push({ key: 'Gene name:', value: res.geneName });
        data.overviewTableData.push({ key: 'Gene ensembl ID:', value: res.ensembl });
        data.overviewTableData.push({ key: 'Strand:', value: res.strand });
        data.overviewTableData.push({ key: 'Gene chr:', value: res.chr });
        data.overviewTableData.push({ key: 'Gene start:', value: res.start });
        data.overviewTableData.push({ key: 'Gene end:', value: res.end });
        overviewArrayTable.value.formatTable();
      });
    };
    const samplePageEvent = () => {
      const sampleShowData = sampleTable.value.showData.filter((item: any) => item.sampleId === data.sampleId);
      if (Base.noNull(sampleShowData)) {
        Time.delay(() => {
          sampleTable.value.selectionToggleChange(sampleShowData);
        }, 300);
      }
    };
    // 自适应 Echarts 大小
    const overviewResize = () => {
      Time.awaitPromise(data.overviewTableData, 100, 10000, () => overviewLeftRight.value.getLeftLabel().offsetHeight > 0).then(() => {
        // 设置 echarts 大小
        data.overviewResizeData = {
          width: overviewLeftRight.value.getRightLabel().offsetWidth,
          height: overviewLeftRight.value.getLeftLabel().offsetHeight
        };
      });
    };
    // 得到 Tissue type 的数量信息
    const countTissueTypeByGeneName = () => {
      SearchApi.getTissueTypeEchartsDataByGeneName(String(route.query.speciesType), String(route.query.geneAlgorithm), String(route.query.geneName)).then((res: any) => {
        // 关闭加载动画
        overviewLoading.value.endLoading();
        // echarts
        overviewEcharts.value.drawEcharts(overviewOption(res.xdata, res.ydata));
        overviewResize();
      });
    };

    // 得到 region 信息
    const regionUpdateData = () => {
      regionTable.value.startLoading();
      SearchApi.listRegionByGeneName(String(route.query.speciesType), String(route.query.geneAlgorithm), String(route.query.geneName), data.sampleId).then((res: any) => {
        data.geneMapperTableData = res;
        regionTable.value.endLoading();
      });
    };

    const getSampleData = () => {
      sampleTable.value.startLoading();
      SearchApi.listSampleByGeneName(String(route.query.speciesType), String(route.query.geneAlgorithm), String(route.query.geneName)).then((res: any) => {
        data.sampleTableData = res;
        data.sampleId = data.sampleTableData[0].sampleId;
        sampleTable.value.endLoading();
        regionUpdateData();
        Time.delay(() => {
          sampleTable.value.selectionToggleChange([data.sampleTableData[0]]);
        }, 300);
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
      regionUpdateData();
    };
    // 得到疾病信息
    const getDisease = () => {
      SearchApi.listDiseaseByName(String(route.query.geneName)).then((res: any) => {
        data.diseaseData = res as Array<any>;
      });
    };
    // 自适应 Echarts 大小
    const expressionResize = () => {
      Time.sleep(100).then(() => {
        // 设置 echarts 大小
        data.expressionResizeData = {
          width: expressionSingleCard.value.getContentWidth(),
          height: 600
        };
      });
    };
    // 得到表达信息
    const getGeneNameExpression = (id: string, content: ButtonBase) => {
      expressionSingleCard.value.startLoading();
      SearchApi.getNameExpression(id, String(route.query.geneName)).then((res: any) => {
        expressionSingleCard.value.endLoading();
        const { description } = content;
        // echarts, 此步一定为 true
        if (description) {
          expressionEcharts.value.drawEcharts(expressionOption(description, res.xdata, res.ydata));
          expressionResize();
        }
      });
    };
    onMounted(() => {
      ElNotification({
        title: 'Wishing you a pleasant browsing experience!',
        message: 'Due to the large volume of data, the results may take some time to load. Thank you for your patience!',
        type: 'success'
      });
      if (Base.isNull(route.query.geneAlgorithm) || Base.isNull(route.query.geneName)) {
        Jump.routerDefault(router, '/');
        Message.warning(`${route.fullPath}: The path is not feasible!`);
      }
      data.geneName = String(route.query.geneName);
      getGeneInformation();
      countTissueTypeByGeneName();
      getDisease();
      const buttonElement = BUTTON_CONTENT[0];
      getGeneNameExpression(buttonElement.id, buttonElement);
      window.onresize = () => {
        overviewResize();
        expressionResize();
      };
      getSampleData();
    });
    const buttonClick = (id: string, content: ButtonBase) => {
      getGeneNameExpression(id, content);
    };
    return {
      ...toRefs(data),
      regionTable,
      overviewLoading,
      sampleTable,
      overviewLeftRight,
      overviewArrayTable,
      overviewEcharts,
      regionLoading,
      expressionSingleCard,
      expressionEcharts,
      samplePageEvent,
      sampleSelectionChange,
      regionUpdateData,
      buttonClick,
      regionDescription: SEARCH_SAMPLE_TABLE_DESCRIPTION,
      mapperDescription: GENE_MAPPER_DESCRIPTION,
      diseaseDescription: GENE_DISEASE_DESCRIPTION,
      buttonContent: BUTTON_CONTENT,
      softwareTableData: SOFTWARE_TABLE_DATA
    };
  }
});
</script>
