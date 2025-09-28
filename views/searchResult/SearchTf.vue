<template>
  <div id="search_tf">
    <div class="search_tf">
      <!-- TF overview -->
      <SingleCard :title="{ icon: 'fas fa-th-list', content: 'TF overview' }" ref="overviewLoading">
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
      <!-- TF footprint -->
      <SingleCard :title="{ icon: 'fas fa-list', content: 'TF footprint' }" ref="tfFootprintTableLoading">
        <BaseTable :table-data="tfFootprintData" :is-service-paging="false" :table-description="tfFootprintDescription">
          <el-table-column label="Tissue type" stripe align="center">
            <template #default="scope">
              {{ scope.row.sampleOverview.tissueType }}
            </template>
          </el-table-column>
          <el-table-column label="Disease" stripe align="center">
            <template #default="scope">
              {{ scope.row.sampleOverview.diseaseType }}
            </template>
          </el-table-column>
        </BaseTable>
      </SingleCard>
      <br/>
      <!-- The chromatin accessible regions tf_bound by TF name -->
      <SingleCard :title="{ icon: 'fas fa-list', content: `The chromatin accessible regions bound by ${tfName}` }" ref="tfFootprintLoading">
        <BaseTable :table-data="motifData" :is-service-paging="false" :table-description="motifDescription"/>
      </SingleCard>
      <br/>
      <!-- Disease information of TF name -->
      <SingleCard :title="{ icon: 'fas fa-list', content: `Disease information of ${tfName}` }" ref="diseaseLoading" v-show="isMouse">
        <BaseTable :table-data="diseaseData" :is-service-paging="false" :table-description="diseaseDescription"/>
      </SingleCard>
      <br/>
      <!-- Expression of TF name -->
      <SingleCard :title="{ icon: 'fas fa-chart-bar', content: `Expression of ${tfName}` }" ref="expressionSingleCard">
        <BaseButton :content="buttonContent" :button-click="buttonClick"/>
        <Echarts :resize-value="expressionResizeData" ref="expressionEcharts"/>
      </SingleCard>
      <br/>
      <ParamInfo/>
      <br/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import '@/assets/less/views/searchResult/SearchTf.less';
import SingleCard from '@/components/card/SingleCard.vue';
import LeftRight from '@/components/layout/LeftRight.vue';
import SearchApi from '@/api/service/searchApi';
import Base from '@/service/util/base/base';
import Jump from '@/service/util/base/jump';
import Message from '@/service/util/base/message';
import ArrayTable from '@/components/table/ArrayTable.vue';
import { KeyValue } from '@/service/model/data';
import ArrayUtil from '@/service/util/base/array';
import Echarts from '@/components/echarts/Echarts.vue';
import { BUTTON_CONTENT, DISEASE_DESCRIPTION, MOTIF_DESCRIPTION, TF_FOOTPRINT_DESCRIPTION, expressionOption, overviewOption } from '@/assets/ts';
import BaseTable from '@/components/table/BaseTable.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import { ButtonBase } from '@/service/model/components/button';
import Time from '@/service/util/base/time';
import Boolean from '@/service/util/base/boolean';
import ParamInfo from '@/views/detail/ParamInfo.vue';
import BaseSelect from '@/components/input/BaseSelect.vue';
import { InputSelect } from '@/service/model/components/input';
import { ElNotification } from 'element-plus';

export default defineComponent({
  name: 'SearchTf',
  components: {
    BaseSelect, ParamInfo, BaseButton, BaseTable, Echarts, ArrayTable, LeftRight, SingleCard
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const overviewLeftRight = ref();
    const overviewArrayTable = ref();
    const overviewEcharts = ref();
    const expressionSingleCard = ref();
    const expressionEcharts = ref();
    const overviewLoading = ref();
    const diseaseLoading = ref();
    const sampleIdSelect = ref();
    const tfFootprintLoading = ref();
    const tfFootprintTableLoading = ref();
    const data = reactive({
      tfName: '',
      sampleIdList: [] as Array<InputSelect>,
      motifData: [] as Array<any>,
      overviewTableData: [] as Array<KeyValue>,
      tfFootprintData: [] as Array<any>,
      diseaseData: [] as Array<any>,
      overviewResizeData: {
        width: 680,
        height: 185
      },
      expressionResizeData: {
        width: 1200,
        height: 600
      },
      isMouse: false
    });
    let judgeTf = false;
    let judgeEcharts = false;
    const getTfInformation = () => {
      overviewLoading.value.startLoading();
      SearchApi.getTfInformation(String(route.query.speciesType), data.tfName).then((res: any) => {
        judgeTf = true;
        if (Boolean.judgeMore(judgeTf, judgeEcharts)) {
          overviewLoading.value.endLoading();
        }
        ArrayUtil.clear(data.overviewTableData);
        data.overviewTableData.push({ key: 'TF name:', value: res.tfName });
        data.overviewTableData.push({ key: 'TF family:', value: res.tfFamily });
        data.overviewTableData.push({ key: 'TF ensembl ID:', value: res.ensemblId });
        data.overviewTableData.push({ key: 'TF entrez ID:', value: res.tfEntrezId });
        overviewArrayTable.value.formatTable();
      });
    };

    const overviewResize = () => {
      Time.awaitPromise(data.overviewTableData, 100, 10000, () => overviewLeftRight.value.getLeftLabel().offsetHeight > 0).then(() => {
        data.overviewResizeData = {
          width: overviewLeftRight.value.getRightLabel().offsetWidth,
          height: overviewLeftRight.value.getLeftLabel().offsetHeight
        };
      });
    };

    const countTissueTypeByTfName = () => {
      SearchApi.getTissueTypeEchartsDataByTfName(String(route.query.speciesType), String(route.query.tfName)).then((res: any) => {
        judgeEcharts = true;
        if (Boolean.judgeMore(judgeTf, judgeEcharts)) {
          overviewLoading.value.endLoading();
        }
        // echarts
        overviewEcharts.value.drawEcharts(overviewOption(res.xdata, res.ydata));
        overviewResize();
      });
    };

    const motifUpdateData = () => {
      tfFootprintLoading.value.startLoading();
      SearchApi.listMotifByTfName(String(route.query.speciesType), String(route.query.tfName)).then((res: any) => {
        tfFootprintLoading.value.endLoading();
        data.motifData = res as Array<any>;
      });
    };

    const getTfFootprint = () => {
      tfFootprintTableLoading.value.startLoading();
      return SearchApi.listTfFootprint(String(route.query.speciesType), String(route.query.tfName)).then((res: any) => {
        tfFootprintTableLoading.value.endLoading();
        data.tfFootprintData = res as Array<any>;
        (data.tfFootprintData as Array<string>).forEach((item: any) => {
          data.sampleIdList.push({ label: item.sampleId, value: item.sampleId.toLowerCase() });
        });
      });
    };

    const getDisease = () => {
      diseaseLoading.value.startLoading();
      SearchApi.listDiseaseByName(String(route.query.tfName)).then((res: any) => {
        diseaseLoading.value.endLoading();
        data.diseaseData = res as Array<any>;
      });
    };

    const expressionResize = () => {
      Time.sleep(100).then(() => {
        data.expressionResizeData = {
          width: expressionSingleCard.value.getContentWidth() - 50,
          height: 600
        };
      });
    };

    const getTfNameExpression = (id: string, content: ButtonBase) => {
      expressionSingleCard.value.startLoading();
      SearchApi.getNameExpression(id, String(route.query.tfName)).then((res: any) => {
        expressionSingleCard.value.endLoading();
        const { description } = content;
        // echarts
        if (description) {
          expressionEcharts.value.drawEcharts(expressionOption(description, res.xdata, res.ydata));
          expressionResize();
        }
      });
    };
    onMounted(() => {
      if (String(route.query.speciesType) === 'Human') {
        data.isMouse = true;
      }
      ElNotification({
        title: 'Wishing you a pleasant browsing experience!',
        message: 'Due to the large volume of data, the results may take some time to load. Thank you for your patience!',
        type: 'success'
      });
      if (Base.isNull(route.query.tfName)) {
        Jump.routerDefault(router, '/');
        Message.warning(`${route.fullPath}: The path is not feasible!`);
      }
      data.tfName = String(route.query.tfName);
      motifUpdateData();
      getTfInformation();
      getTfFootprint();
      countTissueTypeByTfName();
      getDisease();
      const buttonElement = BUTTON_CONTENT[0];
      getTfNameExpression(buttonElement.id, buttonElement);
      window.onresize = () => {
        overviewResize();
        expressionResize();
      };
    });
    const buttonClick = (id: string, content: ButtonBase) => {
      getTfNameExpression(id, content);
    };
    return {
      ...toRefs(data),
      overviewLeftRight,
      overviewArrayTable,
      overviewEcharts,
      expressionSingleCard,
      expressionEcharts,
      overviewLoading,
      diseaseLoading,
      sampleIdSelect,
      tfFootprintLoading,
      tfFootprintTableLoading,
      motifUpdateData,
      buttonClick,
      getTfFootprint,
      tfFootprintDescription: TF_FOOTPRINT_DESCRIPTION,
      motifDescription: MOTIF_DESCRIPTION,
      diseaseDescription: DISEASE_DESCRIPTION,
      buttonContent: BUTTON_CONTENT
    };
  }
});
</script>

