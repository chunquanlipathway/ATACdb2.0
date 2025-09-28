<template>
  <BaseLoading id="data_browse" ref="loading">
    <div class="data_browse">
      <LeftRight :leftWidth="23">
        <template #left>
          <ListCard title="Species" :list-card="speciesTypes" :list-card-click="speciesTypeClick" ref="speciesType"/>
          <ListCard title="Biosample type" :list-card="bioSampleTypes" :list-card-click="bioSampleTypeClick" ref="bioSampleType"/>
          <ListCard title="Tissue Type" :list-card="tissueTypes" :list-card-click="tissueTypeClick" ref="tissueType"/>
          <ListCard title="Cancer type" :list-card="cancerTypes" :list-card-click="cancerTypeClick" ref="cancerType"/>
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
          <BaseTable :table-data="tableData" :is-service-paging="false" :table-description="tableDescription" :pageSizes="[20, 25, 30, 35]" ref="table"/>
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
import {DATA_PSEUDOBULK_BROWSE_TABLE_DESCRIPTION, STATIC_DOWNLOAD_PATH} from '@/assets/ts';
import { CardList } from '@/service/model/components/card';
import DataBrowseApi from '@/api/service/dataBrowseApi';
import ArrayUtil from '@/service/util/base/array';
import BaseTable from '@/components/table/BaseTable.vue';
import BaseLoading from '@/components/loading/BaseLoading.vue';

export default defineComponent({
  name: 'PseudoBulkDataBrowse',
  components: { BaseLoading, BaseTable, ListCard, LeftRight },
  setup() {
    const loading = ref();
    const bioSampleType = ref();
    const speciesType = ref();
    const tissueType = ref();
    const cancerType = ref();
    const bioSampleName = ref();
    const activeButton = ref('null'); // 默认激活第三个按钮
    const category = ref();
    const table = ref();
    // 设置响应数据
    const data = reactive({
      speciesTypes: [] as Array<CardList>,
      bioSampleTypes: [] as Array<CardList>,
      tissueTypes: [] as Array<CardList>,
      cancerTypes: [] as Array<CardList>,
      bioSampleNames: [] as Array<CardList>,
      categories: [] as Array<CardList>,
      tableData: [],
      download_url: `${STATIC_DOWNLOAD_PATH}/Sample_Information/t_pseudobulk_ATAC-seq_sample_overview.xlsx`
    });
    let speciesTypeValue = '';
    let bioSampleTypeValue = '';
    let bioSampleNameValue = '';
    let tissueTypeValue = '';
    let cancerTypeValue = '';
    let categoryValue = '';
    // 获取传入的参数
    const params = () => ({
      speciesType: speciesTypeValue,
      biosampleType: bioSampleTypeValue,
      biosampleName: bioSampleNameValue,
      tissueType: tissueTypeValue,
      cancerType: cancerTypeValue,
      category: categoryValue
    });
    // 添加字段数量
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
    // 处理结果值
    const handlerResultData = (res: any, label?: string, name?: CardList) => {
      // 获得数据内容
      const { speciesTypes, bioSampleTypes, bioSampleNames, tissueTypes, cancerTypes, categories, dataBrowseDataList } = res;
      data.tableData = dataBrowseDataList;
      // 重构数据
      addFieldNumber(data.speciesTypes, speciesTypes as Array<any>, label === 'speciesType' ? name : undefined);
      addFieldNumber(data.bioSampleTypes, bioSampleTypes as Array<any>, label === 'bioSampleType' ? name : undefined);
      addFieldNumber(data.bioSampleNames, bioSampleNames as Array<any>, label === 'bioSampleName' ? name : undefined);
      addFieldNumber(data.tissueTypes, tissueTypes as Array<any>, label === 'tissueType' ? name : undefined);
      addFieldNumber(data.cancerTypes, cancerTypes as Array<any>, label === 'cancerType' ? name : undefined);
      addFieldNumber(data.categories, categories as Array<any>, label === 'category' ? name : undefined);
    };
    // 更新类型和数量
    const updateTypeNumber = () => {
      speciesType.value.dataUpdate();
      bioSampleType.value.dataUpdate();
      tissueType.value.dataUpdate();
      cancerType.value.dataUpdate();
      bioSampleName.value.dataUpdate();
      category.value.dataUpdate();
    };
    // 向后台请求数据
    const getDataAndCount = (dataBrowseInfo: any, label?: string, name?: CardList) => {
      // 加载动画
      loading.value.loading = true;
      // 获取数据
      return DataBrowseApi.getPseudoBulkDataBrowseData(dataBrowseInfo).then((res: any) => {
        loading.value.loading = false;
        // 获得数据内容
        handlerResultData(res, label, name);
      });
    };
    // 类型点击事件
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
    onMounted(() => {
      // 更新类型和数量
      getDataAndCount(params()).then(updateTypeNumber);
    });
    return {
      ...toRefs(data),
      loading,
      bioSampleType,
      tissueType,
      speciesType,
      cancerType,
      bioSampleName,
      category,
      table,
      activeButton,
      speciesTypeClick,
      bioSampleTypeClick,
      tissueTypeClick,
      cancerTypeClick,
      bioSampleNameClick,
      categoryClick,
      tableDescription: DATA_PSEUDOBULK_BROWSE_TABLE_DESCRIPTION
    };
  }
});
</script>
