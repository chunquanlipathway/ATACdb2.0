<template>
  <BaseLoading id="data_browse" ref="loading">
    <div class="data_browse">
      <LeftRight :leftWidth="23">
        <template #left>
          <ListCard title="Species" :list-card="speciesTypes" :list-card-click="speciesTypeClick" ref="speciesType"/>
          <ListCard title="Biosample type" :list-card="bioSampleTypes" :list-card-click="bioSampleTypeClick" ref="bioSampleType"/>
          <ListCard title="Tissue Type" :list-card="tissueTypes" :list-card-click="tissueTypeClick" ref="tissueType"/>
          <ListCard title="Disease type" :list-card="cancerTypes" :list-card-click="cancerTypeClick" ref="cancerType"/>
          <ListCard title="Biosample name" :list-card="bioSampleNames" :list-card-click="bioSampleNameClick" ref="bioSampleName"/>
          <ListCard title="Category" :list-card="categories" :list-card-click="categoryClick" ref="category"/>
        </template>
        <template #right>
          <el-link :href="download_url" class="download_right">
            <el-button size="mini" type="primary">
              <span class="download_span"> xlsx &nbsp; </span>
              <i class="fas fa-file-download"></i>
            </el-button>
          </el-link>
          <BaseTable :table-data="tableData" :is-service-paging="false" :table-description="tableDescription" :pageSizes="[20, 25, 30, 35]" ref="table">
            <template #default>
              <el-table-column label="QC" align="center" :width="180">
                <template #header>
                  <span style="font-size: 14px; text-align: center">QC</span>
                  <BaseTooltip placement="top" content="The three-color dots represent the quality level of the sample data (red: Concerning; yellow: Acceptable; green: Ideal)">
                    <i class="fa-solid fa-circle-question" style="color: #000000;"></i>
                  </BaseTooltip>
                </template>
                <template #default="scope">
                  <BaseTooltip placement = "top" content="TSS enrichment score">
                    <span v-html="tssEnrichmentScoreShow(scope.row.tssEnrichmentScore, scope.row.species)"></span>
                  </BaseTooltip>
                  <BaseTooltip placement = "top" content="Fraction of reads in peaks (FRiP)">
                    <span v-html="fripShow(scope.row.frip)"></span></BaseTooltip>
                  <BaseTooltip placement = "top" content="Per Sequence Quality Scores: Distribution of average base mass per sequence">
                    <span v-html="sqQualityScoreShow(scope.row.sqQualityScore)"></span>
                  </BaseTooltip>
                  <BaseTooltip placement = "top" content="Per Sequence GC Content:Distribution of average GC content for each sequence">
                    <span v-html="sqQualityScoreShow(scope.row.sqGcContent)"></span>
                  </BaseTooltip>
                  <BaseTooltip placement = "top" content="Sequence Duplication Levels:Proportion of duplicate reads">
                    <span v-html="sqQualityScoreShow(scope.row.sqDuplicationLevels)"></span>
                  </BaseTooltip>
                </template>
              </el-table-column>
            </template>
          </BaseTable>
        </template>
      </LeftRight>
    </div>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import '@/assets/less/views/DataBrowse.less';
import LeftRight from '@/components/layout/LeftRight.vue';
import ListCard from '@/components/card/ListCard.vue';
import { BROWSE_BUTTON, DATA_BROWSE_TABLE_DESCRIPTION, STATIC_DOWNLOAD_PATH } from '@/assets/ts';
import { CardList } from '@/service/model/components/card';
import DataBrowseApi from '@/api/service/dataBrowseApi';
import ArrayUtil from '@/service/util/base/array';
import BaseTable from '@/components/table/BaseTable.vue';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import BaseTooltip from '@/components/tooltip/BaseTooltip.vue';

export default defineComponent({
  name: 'ATACDataBrowse',
  components: { BaseTooltip, BaseLoading, BaseTable, ListCard, LeftRight },
  setup() {
    const loading = ref();
    const speciesType = ref();
    const bioSampleType = ref();
    const tissueType = ref();
    const cancerType = ref();
    const bioSampleName = ref();
    const category = ref();
    const activeButton = ref('null');
    const table = ref();
    const defaultBtn = ref();
    const data = reactive({
      speciesTypes: [] as Array<CardList>,
      bioSampleTypes: [] as Array<CardList>,
      tissueTypes: [] as Array<CardList>,
      cancerTypes: [] as Array<CardList>,
      bioSampleNames: [] as Array<CardList>,
      categories: [] as Array<CardList>,
      tableData: [],
      download_url: `${STATIC_DOWNLOAD_PATH}/Sample_Information/t_bulk_ATAC-seq_sample_overview.xlsx`
    });
    let speciesTypeValue = '';
    let bioSampleTypeValue = '';
    let bioSampleNameValue = '';
    let tissueTypeValue = '';
    let cancerTypeValue = '';
    let categoryValue = '';

    const params = () => ({
      speciesType: speciesTypeValue,
      biosampleType: bioSampleTypeValue,
      biosampleName: bioSampleNameValue,
      tissueType: tissueTypeValue,
      cancerType: cancerTypeValue,
      category: categoryValue
    });
    const addFieldNumber = (nowData: Array<CardList>, newData: Array<any>, name?: CardList) => {
      // const oldData = ArrayUtil.deepCopy(nowData) as Array<CardList>;
      // 清空
      ArrayUtil.clear(nowData);
      newData.forEach((item: any) => {
        nowData.push({
          label: item.field,
          show: name && item.field === name.label ? name.show : false,
          number: item.number
        });
      });
    };

    const handlerResultData = (res: any, label?: string, name?: CardList) => {
      const { speciesTypes, bioSampleTypes, bioSampleNames, tissueTypes, cancerTypes, categories, dataBrowseDataList } = res;
      data.tableData = dataBrowseDataList;
      addFieldNumber(data.speciesTypes, speciesTypes as Array<any>, label === 'speciesType' ? name : undefined);
      addFieldNumber(data.bioSampleTypes, bioSampleTypes as Array<any>, label === 'bioSampleType' ? name : undefined);
      addFieldNumber(data.bioSampleNames, bioSampleNames as Array<any>, label === 'bioSampleName' ? name : undefined);
      addFieldNumber(data.tissueTypes, tissueTypes as Array<any>, label === 'tissueType' ? name : undefined);
      addFieldNumber(data.cancerTypes, cancerTypes as Array<any>, label === 'cancerType' ? name : undefined);
      addFieldNumber(data.categories, categories as Array<any>, label === 'category' ? name : undefined);
    };

    const updateTypeNumber = () => {
      speciesType.value.dataUpdate();
      bioSampleType.value.dataUpdate();
      tissueType.value.dataUpdate();
      cancerType.value.dataUpdate();
      bioSampleName.value.dataUpdate();
      category.value.dataUpdate();
    };

    const getDataAndCount = (dataBrowseInfo: any, label?: string, name?: CardList) => {
      loading.value.loading = true;
      return DataBrowseApi.getDataBrowseData(dataBrowseInfo).then((res: any) => {
        loading.value.loading = false;
        handlerResultData(res, label, name);
      });
    };

    const speciesTypeClick = (name: CardList) => {
      speciesTypeValue = name.show ? name.label : '';
      return getDataAndCount(params(), 'speciesType', name).then(updateTypeNumber);
    };
    const bioSampleTypeClick = (name: CardList) => {
      bioSampleTypeValue = name.show ? name.label : '';
      return getDataAndCount(params(), 'bioSampleType', name).then(updateTypeNumber);
    };
    const tissueTypeClick = (name: CardList) => {
      tissueTypeValue = name.show ? name.label : '';
      return getDataAndCount(params(), 'tissueType', name).then(updateTypeNumber);
    };
    const cancerTypeClick = (name: CardList) => {
      cancerTypeValue = name.show ? name.label : '';
      return getDataAndCount(params(), 'cancerType', name).then(updateTypeNumber);
    };
    const bioSampleNameClick = (name: CardList) => {
      bioSampleNameValue = name.show ? name.label : '';
      return getDataAndCount(params(), 'bioSampleName', name).then(updateTypeNumber);
    };
    const categoryClick = (name: CardList) => {
      categoryValue = name.show ? name.label : '';
      return getDataAndCount(params(), 'category', name).then(updateTypeNumber);
    };
    const descendingClick = () => {
      activeButton.value = 'descending';
      table.value.changeTableSort({
        column: {
          order: 'descending',
          id: 'el-table_1_column_10',
          type: 'default',
          property: 'tssEnrichmentScore',
          align: 'is-center',
          headerAlign: 'is-center',
          showOverflowTooltip: false,
          filteredValue: [],
          filterPlacement: '',
          isColumnGroup: false,
          isSubColumn: false,
          filterOpened: false,
          sortable: true,
          rawColumnKey: 9,
          label: 'Tss_enrichment_score',
          fixed: false,
          resizable: true,
          sortOrders: [
            'ascending',
            'descending',
            null
          ],
          reserveSelection: false,
          filterMultiple: true,
          minWidth: 80,
          realWidth: 142,
          no: 9,
          level: 1,
          colSpan: 1,
          rowSpan: 1
        },
        prop: 'tssEnrichmentScore',
        order: 'descending'
      });
    };
    const ascendingClick = () => {
      activeButton.value = 'ascending';
      table.value.changeTableSort({
        column: {
          order: 'descending',
          id: 'el-table_1_column_10',
          type: 'default',
          property: 'tssEnrichmentScore',
          align: 'is-center',
          headerAlign: 'is-center',
          showOverflowTooltip: false,
          filteredValue: [],
          filterPlacement: '',
          isColumnGroup: false,
          isSubColumn: false,
          filterOpened: false,
          sortable: true,
          rawColumnKey: 9,
          label: 'Tss_enrichment_score',
          fixed: false,
          resizable: true,
          sortOrders: [
            'ascending',
            'descending',
            null
          ],
          reserveSelection: false,
          filterMultiple: true,
          minWidth: 80,
          realWidth: 142,
          no: 9,
          level: 1,
          colSpan: 1,
          rowSpan: 1
        },
        prop: 'tssEnrichmentScore',
        order: 'ascending'
      });
    };
    const nullClick = () => {
      activeButton.value = 'null';
      table.value.changeTableSort({
        column: null,
        prop: null,
        order: null
      });
    };
    const tssEnrichmentScoreShow = (data: any, species: any) => {
      if (species.toLowerCase() === 'human') {
        if (data < 5) {
          return '<i class="fa-solid fa-circle" style="color: #cf4c4c;"></i>'; 
        } if (data > 7) {
          return '<i class="fa-solid fa-circle-check" style="color: #3baf48;"></i>'; 
        }
        return '<i class="fa-solid fa-circle-exclamation" style="color: #FFD43B;"></i>';
      }
      if (species.toLowerCase() === 'mouse') {
        if (data < 10) {
          return '<i class="fa-solid fa-circle" style="color: #cf4c4c;"></i>';
        } if (data > 15) {
          return '<i class="fa-solid fa-circle-check" style="color: #3baf48;"></i>'; 
        }
        return '<i class="fa-solid fa-circle-exclamation" style="color: #FFD43B;"></i>'; 
      }
    };
    const fripShow = (data: any) => {
      if (data < 0.01) {
        return '<i class="fa-solid fa-circle" style="color: #cf4c4c;"></i>';
      } if (data > 0.03) {
        return '<i class="fa-solid fa-circle-check" style="color: #3baf48;"></i>';
      }
      return '<i class="fa-solid fa-circle-exclamation" style="color: #FFD43B;"></i>';
    };
    const sqQualityScoreShow = (data: any) => {
      // eslint-disable-next-line eqeqeq
      if (data == 1) {
        return '<i class="fa-solid fa-circle-check" style="color: #3baf48;"></i>';
        // eslint-disable-next-line eqeqeq
      } if (data == 0) {
        return '<i class="fa-solid fa-circle-exclamation" style="color: #FFD43B;"></i>';
      }
      return '<i class="fa-solid fa-circle" style="color: #cf4c4c;"></i>';
    };
    onMounted(() => {
      getDataAndCount(params()).then(updateTypeNumber);
    });
    return {
      ...toRefs(data),
      loading,
      bioSampleType,
      tissueType,
      cancerType,
      bioSampleName,
      category,
      table,
      defaultBtn,
      activeButton,
      speciesType,
      speciesTypeClick,
      bioSampleTypeClick,
      tissueTypeClick,
      descendingClick,
      cancerTypeClick,
      bioSampleNameClick,
      ascendingClick,
      nullClick,
      categoryClick,
      sqQualityScoreShow,
      fripShow,
      tssEnrichmentScoreShow,
      buttonContent: BROWSE_BUTTON,
      tableDescription: DATA_BROWSE_TABLE_DESCRIPTION
    };
  }
});
</script>

