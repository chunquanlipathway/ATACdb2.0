<template>
  <BaseLoading id="Motif" ref="loading">
    <SingleCard :title="{ icon: 'fas fa-table', content:  `Motif analysis of ATAC_${sampleId}_${regionId}` }">
      <BaseSelect title="Pvalue threshold:" :select-data="selectData" is-line :change-event="changeEvent" ref="select"/>
      <BaseTable :table-data="tableData" :is-service-paging="false" :table-description="tableDescription"/>
    </SingleCard>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import SingleCard from '@/components/card/SingleCard.vue';
import BaseTable from '@/components/table/BaseTable.vue';
import { MOTIF_P_VALUE_SELECT_DATA, MOTIF_TABLE_DESCRIPTION } from '@/assets/ts';
import BaseSelect from '@/components/input/BaseSelect.vue';
import RegionDetailApi from '@/api/service/regionDetailApi';

export default defineComponent({
  name: 'Motif',
  components: { BaseSelect, BaseTable, SingleCard, BaseLoading },
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
    const select = ref();
    const data = reactive({
      tableData: [] as Array<any>
    });
    const listTfFootprint = (pValue: number) => {
      loading.value.loading = true;
      RegionDetailApi.listMotif(props.sampleId, props.regionId, pValue).then((res: any) => {
        loading.value.loading = false;
        data.tableData = res;
      });
    };
    onMounted(() => {
      select.value.select = 1.0E-6;
      listTfFootprint(select.value.select);
    });
    const changeEvent = () => {
      listTfFootprint(select.value.select);
    };
    return {
      ...toRefs(data),
      loading,
      select,
      changeEvent,
      selectData: MOTIF_P_VALUE_SELECT_DATA,
      tableDescription: MOTIF_TABLE_DESCRIPTION
    };
  }
});
</script>
