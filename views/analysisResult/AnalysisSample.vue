<template>
  <div id="analysis_sample">
    <BaseLoading class="analysis_sample" ref="loading">
      <!-- Sample overview -->
      <SingleCard :title="{ icon: 'fas fa-th-list', content: 'Sample overview' }">
        <LeftRight ref="overviewLeftRight">
          <template #left>
            <table class="table table-hover">
              <thead></thead>
              <tbody ref="overviewTbody"></tbody>
            </table>
          </template>
          <template #right>
            <h4 class="sample_overview_echarts_title">Differential and overlapping regions statistic</h4>
            <LeftRight ref="leftRight">
              <template #left>
                <Echarts :resize-value="resizeDataA" ref="overviewEchartsA"/>
              </template>
              <template #right>
                <Echarts :resize-value="resizeDataA" ref="overviewEchartsB"/>
              </template>
            </LeftRight>
          </template>
        </LeftRight>
      </SingleCard>
      <br/>
      <!-- Differential regions -->
      <SingleCard :title="{ icon: 'fas fa-list', content: 'Differential regions' }" ref="differentialRegions">
        <div class="differential_sample">
          <span class="title">Sample 1</span>
          <span class="info" v-for="(sample, i) in sample1Info" :key="i">
            <span v-html="sample.key"></span>
            <span v-html="sample.value"></span>
          </span>
        </div>
        <BaseTable :table-data="differenceData1" :is-service-paging="false"
                   :table-description="sampleId1.includes('Sample_HP') || sampleId2.includes('Sample_MP') ? difference1PesudoBulkDescription : difference1Description">
          <template #default>
            <el-table-column label="Accessible genes" stripe align="center">
              <template #default="scope">
                <el-button @click="differenceShow(scope.row)"> View</el-button>
              </template>
            </el-table-column>
          </template>
        </BaseTable>
        <div class="differential_sample">
          <span class="title">Sample 2</span>
          <span class="info" v-for="(sample, i) in sample2Info" :key="i">
            <span v-html="sample.key"></span>
            <span v-html="sample.value"></span>
          </span>
        </div>
        <BaseTable :table-data="differenceData2" :is-service-paging="false"
                   :table-description="sampleId1.includes('Sample_HP') || sampleId2.includes('Sample_MP') ? difference2PesudoBulkDescription : difference2Description">
          <template #default>
            <el-table-column label="Accessible genes" stripe align="center">
              <template #default="scope">
                <el-button @click="differenceShow(scope.row)"> View</el-button>
              </template>
            </el-table-column>
          </template>
        </BaseTable>
      </SingleCard>
      <br/>
      <!-- Overlapping regions -->
      <SingleCard :title="{ icon: 'fas fa-list', content: 'Overlapping regions' }" ref="overlappingRegions">
        <BaseTable :table-data="overlapData" :is-service-paging="false" :table-description="overlapDescription">
          <template #default>
            <el-table-column label="Accessible genes" stripe align="center">
              <template #default="scope">
                <el-button @click="overlapShow(scope.row)"> View</el-button>
              </template>
            </el-table-column>
          </template>
        </BaseTable>
      </SingleCard>
      <br/>
      <BaseDrawer title="Gene Information" ref="sampleDifferenceGeneDrawer">
        <BaseTable :table-data="sampleGeneData" :is-service-paging="false" :is-paging="false" :table-description="sampleGeneDescription" v-if="!isMouse"/>
        <BaseTable :table-data="sampleGeneData" :is-service-paging="false" :is-paging="false" :table-description="sampleMouseGeneDescription" v-if="isMouse"/>
      </BaseDrawer>
      <BaseDrawer title="Gene Information" ref="sampleOverlapGeneDrawer">
        <BaseTable :table-data="overlapGeneData" :is-service-paging="false" :is-paging="false" :table-description="overlapGeneDescription"/>
      </BaseDrawer>
    </BaseLoading>
    <!-- MACS regions -->
    <BaseLoading class="analysis_sample_macs" ref="macsLoading">
      <SingleCard :title="{ icon: 'fas fa-list', content: 'Differential Accessibility Analysis（MACS2 bdgdiff）' }" ref="macs" v-show="isBulk">
        <div class="differential_sample">
          <span class="title">Sample 1</span>
          <span class="info" v-for="(sample, i) in sample1Info" :key="i">
            <span v-html="sample.key"></span>
            <span v-html="sample.value"></span>
          </span>
        </div>
       <BaseTable :table-data="macsData1" :is-service-paging="false" :table-description="macsDescription"/>
        <div class="differential_sample">
          <span class="title">Sample 2</span>
          <span class="info" v-for="(sample, i) in sample2Info" :key="i">
            <span v-html="sample.key"></span>
            <span v-html="sample.value"></span>
          </span>
        </div>
       <BaseTable :table-data="macsData2" :is-service-paging="false" :table-description="macsDescription"/>
      </SingleCard>
    </BaseLoading>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Base from '@/service/util/base/base';
import Jump from '@/service/util/base/jump';
import Message from '@/service/util/base/message';
import AnalysisApi from '@/api/service/analysisApi';
import LeftRight from '@/components/layout/LeftRight.vue';
import Echarts from '@/components/echarts/Echarts.vue';
import SingleCard from '@/components/card/SingleCard.vue';
import {
  ANALYSIS_DIFFERENCE_DESCRIPTION_A,
  ANALYSIS_DIFFERENCE_DESCRIPTION_B,
  ANALYSIS_OVERLAP_DESCRIPTION,
  ANALYSIS_PESUDOBLUK_DIFFERENCE_DESCRIPTION_A,
  ANALYSIS_PESUDOBLUK_DIFFERENCE_DESCRIPTION_B,
  ANALYSIS_SAMPLE_GENE_DESCRIPTION,
  ANALYSIS_SAMPLE_MOUSE_GENE_DESCRIPTION, ANALYSIS_SAMPLE_VIEW_GENE_DESCRIPTION,
  sampleOverviewOptionA,
  sampleOverviewOptionB
} from '@/assets/ts';
import { ElNotification } from 'element-plus';
import '@/assets/less/views/analysisResult/AnalysisSample.less';
import BaseTable from '@/components/table/BaseTable.vue';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import { getDetailUrlHtml } from '@/assets/ts/statusUtil';
import Time from '@/service/util/base/time';
import { KeyValue } from '@/service/model/data';
import ArrayUtil from '@/service/util/base/array';
import { TableHead } from '@/service/model/components/table';
import BaseDrawer from '@/components/drawer/BaseDrawer.vue';
import axios from 'axios';

export default defineComponent({
  name: 'AnalysisSample',
  components: { BaseDrawer, BaseLoading, BaseTable, SingleCard, Echarts, LeftRight },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const macs = ref();
    const loading = ref();
    const differentialRegions = ref();
    const overlappingRegions = ref();
    const overviewLeftRight = ref();
    const overviewTbody = ref();
    const leftRight = ref();
    const overviewEchartsA = ref();
    const overviewEchartsB = ref();
    const sampleDifferenceGeneDrawer = ref();
    const sampleOverlapGeneDrawer = ref();
    const macsLoading = ref();
    // 创建 table 下的 tr td
    const addTh = (content: string) => `<th>${content}</th>`;
    const addTd = (content: string) => `<td>${content}</td>`;
    const addTr = (content: string) => `<tr>${content}</tr>`;
    const trAddThTd = (thTds: Array<any> = []) => {
      let thString = '';
      const { length } = thTds;
      for (let i = 0; i < length; i++) {
        thString += i === 0 ? addTh(thTds[i]) : addTd(thTds[i]);
      }
      return addTr(thString);
    };
    // 响应式数据
    const data = reactive({
      isMouse: false,
      isBulk: false,
      sample1Info: [] as Array<KeyValue>,
      sample2Info: [] as Array<KeyValue>,
      differenceData1: [] as Array<any>,
      differenceData2: [] as Array<any>,
      sampleGeneData: [] as Array<any>,
      overlapData: [] as Array<any>,
      macsData1: [] as Array<any>,
      macsData2: [] as Array<any>,
      sampleId1: route.query.sampleId1 as string,
      sampleId2: route.query.sampleId2 as string,
      overlapGeneData: [{
        sample1overlapGene: '',
        sample2overlapGene: ''
      }] as Array<any>,
      overlapGeneDescription: [
        { title: 'Sample 1 overlap gene', column: 'sample1overlapGene' },
        { title: 'Sample 2 overlap gene', column: 'sample2overlapGene' }
      ] as Array<TableHead>,
      resizeDataA: {
        width: 340,
        height: 200
      },
      resizeDataB: {
        width: 340,
        height: 200
      }
    });
    const resize = () => {
      Time.sleep(100).then(() => {
        // 设置 echarts 大小
        data.resizeDataA = {
          width: leftRight.value.getRightLabel().offsetWidth,
          height: overviewLeftRight.value.getLeftLabel().offsetHeight
        };
        data.resizeDataB = {
          width: leftRight.value.getRightLabel().offsetWidth,
          height: overviewLeftRight.value.getLeftLabel().offsetHeight
        };
      });
    };
    // 得到 Sample 信息和数量
    const getSampleOverview = () => {
      loading.value.loading = true;
      AnalysisApi.sampleInfoAndCount(String(route.query.sampleId1), String(route.query.sampleId2)).then((res: any) => {
        loading.value.loading = false;
        const { sampleInfo1, sampleInfo2, overlapDifferenceCount, sampleDifferenceList1, sampleDifferenceList2, sampleOverlapList } = res;
        // 添加 Sample overview
        let tbodyHtml = trAddThTd(['Sample information:', 'Sample 1', 'Sample 2']);
        tbodyHtml += trAddThTd([
          'Sample ID:',
          getDetailUrlHtml(sampleInfo1.sampleId),
          getDetailUrlHtml(sampleInfo2.sampleId)
        ]);
        ArrayUtil.clear(data.sample1Info);
        ArrayUtil.clear(data.sample2Info);
        data.sample1Info.push({ key: 'Sample ID:', value: getDetailUrlHtml(sampleInfo1.sampleId) });
        data.sample2Info.push({ key: 'Sample ID:', value: getDetailUrlHtml(sampleInfo2.sampleId) });
        tbodyHtml += trAddThTd(['Biosample type:', sampleInfo1.biosampleType, sampleInfo2.biosampleType]);
        data.sample1Info.push({ key: 'Biosample type:', value: sampleInfo1.biosampleType });
        data.sample2Info.push({ key: 'Biosample type:', value: sampleInfo2.biosampleType });
        tbodyHtml += trAddThTd(['Biosample name:', sampleInfo1.biosampleName, sampleInfo2.biosampleName]);
        data.sample1Info.push({ key: 'Biosample name:', value: sampleInfo1.biosampleName });
        data.sample2Info.push({ key: 'Biosample name:', value: sampleInfo2.biosampleName });
        tbodyHtml += trAddThTd(['Tissue type:', sampleInfo1.tissueType, sampleInfo2.tissueType]);
        data.sample1Info.push({ key: 'Tissue type:', value: sampleInfo1.tissueType });
        data.sample2Info.push({ key: 'Tissue type:', value: sampleInfo2.tissueType });
        tbodyHtml += trAddThTd(['Cancer or normal:', sampleInfo1.cancerOrNormal, sampleInfo2.cancerOrNormal]);
        data.sample1Info.push({ key: 'Cancer or normal:', value: sampleInfo1.cancerOrNormal });
        data.sample2Info.push({ key: 'Cancer or normal:', value: sampleInfo2.cancerOrNormal });
        tbodyHtml += trAddThTd(['GEO/SRR ID:', sampleInfo1.srrId, sampleInfo2.srrId]);
        data.sample1Info.push({ key: 'GEO/SRR ID:', value: sampleInfo1.srrId });
        data.sample2Info.push({ key: 'GEO/SRR ID:', value: sampleInfo2.srrId });
        overviewTbody.value.innerHTML = tbodyHtml;
        // 添加 echarts
        overviewEchartsA.value.drawEcharts(sampleOverviewOptionA(overlapDifferenceCount.overlapCount1, overlapDifferenceCount.differenceCount1));
        overviewEchartsB.value.drawEcharts(sampleOverviewOptionB(overlapDifferenceCount.overlapCount2, overlapDifferenceCount.differenceCount2));
        resize();
        // table 数据
        data.differenceData1 = sampleDifferenceList1;
        data.differenceData2 = sampleDifferenceList2;
        data.overlapData = sampleOverlapList;
      });
    };
    async function fetchMacsData() {
      macsLoading.value.loading = true;
      const sample1 = String(route.query.sampleId1);
      const sample2 = String(route.query.sampleId2);

      try {
        // 使用 /phpLocal 代理来访问 licpathway.net
        const response = await axios.get('/ATACdb_macs2/run_macs', {
          params: { sample1, sample2 }
        });

        if (response.data.status === 'success') {
          const param = {
            cond1: response.data.cond1,
            cond2: response.data.cond2
          };
          AnalysisApi.listmacsBySampleId(param).then((res: any) => {
            macsLoading.value.loading = false;
            const { analysisMacs1, analysisMacs2 } = res;
            data.macsData1 = analysisMacs1;
            data.macsData2 = analysisMacs2;
          });
          return;
        }
        console.error('错误:', response.data.message || response.data);
        throw new Error(response.data.message || '服务器处理失败');
      } catch (error) {
        console.error('请求失败:', error);

        // 更详细的错误信息
        if (error.response) {
          console.error('状态码:', error.response.status);
          console.error('响应数据:', error.response.data);
        }
        throw error;
      }
    }
    onMounted(() => {
      ElNotification({
        title: 'Wishing you a pleasant browsing experience!',
        message: 'Due to the large volume of data, the results may take some time to load. Thank you for your patience!',
        type: 'success'
      });
      if (Base.isNull(route.query.biosampleName1) || Base.isNull(route.query.biosampleName2) || Base.isNull(route.query.sampleId1) || Base.isNull(route.query.sampleId2)) {
        Jump.routerDefault(router, '/');
        Message.warning(`${route.fullPath}: The path is not feasible!`);
      }
      getSampleOverview();
      // eslint-disable-next-line max-len
      if (String(route.query.sampleId1).includes('HP') || String(route.query.sampleId1).includes('MP') || String(route.query.sampleId2).includes('HP') || String(route.query.sampleId2).includes('MP')) {
        data.isBulk = false;
      } else {
        data.isBulk = true;
        fetchMacsData();
      }
      // 自动适应大小
      window.onresize = resize;
    });
    const differenceShow = (row: any) => {
      sampleDifferenceGeneDrawer.value.loading = true;
      sampleDifferenceGeneDrawer.value.drawer = true;
      AnalysisApi.listGeneBySampleIdAndRegion(row.sampleId, row.regionId).then((res: any) => {
        sampleDifferenceGeneDrawer.value.loading = false;
        data.sampleGeneData = res;
      });
    };
    const overlapShow = (row: any) => {
      sampleOverlapGeneDrawer.value.loading = true;
      sampleOverlapGeneDrawer.value.drawer = true;
      // sample 1 的 overlap gene
      AnalysisApi.listGeneBySampleIdAndRegion(row.sample1.sampleId, row.sample1.regionId).then((res: any) => {
        data.overlapGeneData[0].sample1overlapGene = res[0].overlapGene;
      });
      // sample 2 的 overlap gene
      AnalysisApi.listGeneBySampleIdAndRegion(row.sample2.sampleId, row.sample2.regionId).then((res: any) => {
        data.overlapGeneData[0].sample2overlapGene = res[0].overlapGene;
      });
    };
    return {
      ...toRefs(data),
      loading,
      macsLoading,
      macs,
      differentialRegions,
      overlappingRegions,
      overviewLeftRight,
      overviewTbody,
      leftRight,
      overviewEchartsA,
      overviewEchartsB,
      sampleDifferenceGeneDrawer,
      sampleOverlapGeneDrawer,
      differenceShow,
      overlapShow,
      difference1Description: ANALYSIS_DIFFERENCE_DESCRIPTION_A,
      difference1PesudoBulkDescription: ANALYSIS_PESUDOBLUK_DIFFERENCE_DESCRIPTION_A,
      difference2Description: ANALYSIS_DIFFERENCE_DESCRIPTION_B,
      difference2PesudoBulkDescription: ANALYSIS_PESUDOBLUK_DIFFERENCE_DESCRIPTION_B,
      sampleGeneDescription: ANALYSIS_SAMPLE_VIEW_GENE_DESCRIPTION,
      sampleMouseGeneDescription: ANALYSIS_SAMPLE_MOUSE_GENE_DESCRIPTION,
      overlapDescription: ANALYSIS_OVERLAP_DESCRIPTION,
      macsDescription: ANALYSIS_SAMPLE_GENE_DESCRIPTION
    };
  }
});
</script>
