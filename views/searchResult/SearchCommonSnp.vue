<template>
  <div id="search_common_snp">
    <div class="search_common_snp">
      <!-- Gene overview -->
      <SingleCard :title="{ icon: 'fas fa-th-list', content: 'SNP overview' }" ref="overviewLoading">
        <LeftRight ref="overviewLeftRight">
          <template #left>
            <ArrayTable :table-data="overviewTableData" :column-pair="1" ref="overviewArrayTable"/>
          </template>
          <template #right>
            <BaseTable :table-data="overviewData" :is-service-paging="false" is-simple :is-search="false" :page-sizes="[5, 7, 10, 15]" :table-description="overviewDescription"/>
          </template>
        </LeftRight>
      </SingleCard>
      <br/>
      <!-- Accessible chromatin region -->
      <SingleCard :title="{ icon: 'fas fa-list', content: 'Accessible chromatin region' }" ref="annotationLoading">
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
        <BaseTable :table-data="peakTableData" :is-service-paging="false" :table-description="isBulk ? mapperDescription : regionPesudoBulkmapperDescription" ref="regionTable" v-show="!isMouse"/>
        <BaseTable :table-data="peakTableData" :is-service-paging="false"
                   :table-description="isBulk ? mapperMouseDescription : regionMousePesudoBulkmapperDescription" ref="regionTable" v-show="isMouse"/>
      </SingleCard>
      <br/>
      <!-- Linkage Disequilibrium SNP -->
      <SingleCard :title="{ icon: 'fas fa-list', content: 'Linkage Disequilibrium SNP' }" ref="annotationButtonLoading" v-show="!isMouse">
        <BaseButton :content="buttonContent" :button-click="buttonClick" :is-between="false"/>
        <BaseTable :table-data="annotationButtonData" :is-service-paging="false" :table-description="annotationButtonDescription"/>
      </SingleCard>
      <br/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import '@/assets/less/views/searchResult/SearchCommonSnp.less';
import SingleCard from '@/components/card/SingleCard.vue';
import LeftRight from '@/components/layout/LeftRight.vue';
import ArrayTable from '@/components/table/ArrayTable.vue';
import { useRoute, useRouter } from 'vue-router';
import { KeyValue } from '@/service/model/data';
import Base from '@/service/util/base/base';
import Jump from '@/service/util/base/jump';
import Message from '@/service/util/base/message';
import SearchApi from '@/api/service/searchApi';
import ArrayUtil from '@/service/util/base/array';
import BaseTable from '@/components/table/BaseTable.vue';
import {
  COMMON_SNP_ANNOTATION_DESCRIPTION,
  COMMON_SNP_BUTTON_CONTENT,
  COMMON_SNP_OVERVIEW_DESCRIPTION,
  dbSnpUrl,
  GENOME_MOUSE_REGION_DESCRIPTION,
  GENOME_PESUDOBULK_MOUSE_REGION_DESCRIPTION,
  GENOME_PESUDOBULK_REGION_DESCRIPTION,
  GENOME_REGION_DESCRIPTION,
  SEARCH_SAMPLE_TABLE_DESCRIPTION
} from '@/assets/ts';
import BaseButton from '@/components/button/BaseButton.vue';
import { ElNotification } from 'element-plus';
import Time from '@/service/util/base/time';

export default defineComponent({
  name: 'SearchCommonSnp',
  components: { BaseButton, BaseTable, ArrayTable, LeftRight, SingleCard },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const overviewLoading = ref();
    const annotationLoading = ref();
    const annotationButtonLoading = ref();
    const overviewArrayTable = ref();
    const sampleTable = ref();
    const regionTable = ref();
    const data = reactive({
      overviewTableData: [] as Array<KeyValue>,
      overviewData: [] as Array<any>,
      sampleId: '' as string,
      chr: '' as string,
      startPosition: '' as string,
      endPosition: '' as string,
      sampleTableData: [] as any,
      peakTableData: [] as any,
      regionData: [] as Array<any>,
      annotationButtonData: [] as Array<any>,
      sampleIsSelectChange: true as boolean,
      snpId: '',
      buttuonId: 't_snp_afr',
      species: '',
      isHuman: true,
      isBulk: false,
      isMouse: true
    });
    const isShow = () => {
      data.isMouse = !(data.sampleId.includes('Sample_H_') || data.sampleId.includes('Sample_HP_'));
      data.isBulk = (data.sampleId.includes('Sample_H_') || data.sampleId.includes('Sample_M_'));
    };
    const getSnpBySnpId = () => {
      data.species = String(route.query.speciesType);
      data.snpId = String(route.query.snpId);
      overviewLoading.value.startLoading();
      if (data.species === 'Human') {
        SearchApi.getCommonSnpBySnpId(data.snpId).then((res: any) => {
          overviewLoading.value.endLoading();
          // 左边
          const { commonSnp, geneList } = res;
          ArrayUtil.clear(data.overviewTableData);
          data.overviewTableData.push({ key: 'SNP ID:', value: commonSnp.rsId });
          data.overviewTableData.push({ key: 'SNP Chr:', value: commonSnp.chr });
          data.overviewTableData.push({ key: 'SNP position:', value: commonSnp.position });
          data.overviewTableData.push({ key: 'SNP ref:', value: commonSnp.ref });
          data.overviewTableData.push({ key: 'SNP alt:', value: commonSnp.alt });
          data.overviewTableData.push({ key: 'External link:', value: dbSnpUrl(data.snpId) });
          overviewArrayTable.value.formatTable();
          // 右边
          data.overviewData = geneList as Array<any>;
        });
      }
      if (data.species === 'Mouse') {
        SearchApi.getMouseSnpBySnpId(data.snpId).then((res: any) => {
          overviewLoading.value.endLoading();
          // 左边
          const { mouseSnp, geneList } = res;
          ArrayUtil.clear(data.overviewTableData);
          data.overviewTableData.push({ key: 'SNP ID:', value: mouseSnp.rsId });
          data.overviewTableData.push({ key: 'SNP Chr:', value: mouseSnp.chr });
          data.overviewTableData.push({ key: 'SNP position:', value: mouseSnp.position });
          data.overviewTableData.push({ key: 'SNP ref:', value: mouseSnp.ref });
          data.overviewTableData.push({ key: 'SNP alt:', value: mouseSnp.alt });
          data.overviewTableData.push({ key: 'External link:', value: dbSnpUrl(data.snpId) });
          overviewArrayTable.value.formatTable();
          // 右边
          data.overviewData = geneList as Array<any>;
        });
      }
    };
    const listSnpAnnotationContent = (name: string) => {
      annotationButtonLoading.value.startLoading();
      SearchApi.listSnpAnnotationContent(name, data.chr, data.startPosition, data.endPosition).then((res: any) => {
        annotationButtonLoading.value.endLoading();
        data.annotationButtonData = res as Array<any>;
      });
    };
    const buttonClick = (id: string) => {
      data.buttuonId = id;
      listSnpAnnotationContent(data.buttuonId);
    };
    const samplePageEvent = () => {
      const sampleShowData = sampleTable.value.showData.filter((item: any) => item.sampleId === data.sampleId);
      if (Base.noNull(sampleShowData)) {
        Time.delay(() => {
          sampleTable.value.selectionToggleChange(sampleShowData);
        }, 300);
      }
    };
    // eslint-disable-next-line max-len
    const regionUpdateData = () => {
      annotationLoading.value.startLoading();
      SearchApi.listRegionBySnpId(String(route.query.speciesType), String(route.query.snpId), data.sampleId).then((res: any) => {
        data.peakTableData = res;
        data.chr = data.peakTableData[0].chr;
        data.startPosition = data.peakTableData[0].start;
        data.endPosition = data.peakTableData[0].end;
        annotationLoading.value.endLoading();
        listSnpAnnotationContent(data.buttuonId);
      });
    };
    const getSampleData = () => {
      sampleTable.value.startLoading();
      SearchApi.listSampleBySnpId(String(route.query.speciesType), String(route.query.snpId)).then((res: any) => {
        data.sampleTableData = res;
        data.sampleId = data.sampleTableData[0].sampleId;
        sampleTable.value.endLoading();
        regionUpdateData();
        isShow();
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
    onMounted(() => {
      getSnpBySnpId();
      ElNotification({
        title: 'Wishing you a pleasant browsing experience!',
        message: 'Due to the large volume of data, the results may take some time to load. Thank you for your patience!',
        type: 'success'
      });
      if (Base.isNull(route.query.snpId)) {
        Jump.routerDefault(router, '/');
        Message.warning(`${route.fullPath}: The path is not feasible!`);
      }
      // buttonClick(COMMON_SNP_BUTTON_CONTENT[0].id);
      if (route.query.speciesType === 'mouse') {
        data.isHuman = false;
      }
      getSampleData();
    });
    return {
      ...toRefs(data),
      overviewLoading,
      annotationButtonLoading,
      annotationLoading,
      sampleTable,
      regionTable,
      overviewArrayTable,
      regionUpdateData,
      sampleSelectionChange,
      samplePageEvent,
      // annotationButtonUpdateData,
      buttonClick,
      overviewDescription: COMMON_SNP_OVERVIEW_DESCRIPTION,
      overviewMouseDescription: GENOME_MOUSE_REGION_DESCRIPTION,
      regionDescription: SEARCH_SAMPLE_TABLE_DESCRIPTION,
      mapperDescription: GENOME_REGION_DESCRIPTION,
      regionPesudoBulkmapperDescription: GENOME_PESUDOBULK_REGION_DESCRIPTION,
      mapperMouseDescription: GENOME_MOUSE_REGION_DESCRIPTION,
      regionMousePesudoBulkmapperDescription: GENOME_PESUDOBULK_MOUSE_REGION_DESCRIPTION,
      annotationButtonDescription: COMMON_SNP_ANNOTATION_DESCRIPTION,
      buttonContent: COMMON_SNP_BUTTON_CONTENT
    };
  }
});
</script>
