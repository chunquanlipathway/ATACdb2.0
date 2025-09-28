<template>
  <BaseLoading id="TfFootprint" ref="loading">
    <SingleCard :title="{ icon: 'fas fa-table', content:  `TF footprint analysis of ${sampleId}_${regionId}` }">
      <BaseTable :table-data="tableData" :is-service-paging="false" :table-description="tableDescription"/>
    </SingleCard>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import SingleCard from '@/components/card/SingleCard.vue';
import BaseTable from '@/components/table/BaseTable.vue';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import { TF_FOOTPRINT_TABLE_DESCRIPTION } from '@/assets/ts';
import RegionDetailApi from '@/api/service/regionDetailApi';

export default defineComponent({
  name: 'TfFootprint',
  components: { BaseLoading, BaseTable, SingleCard },
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
    const data = reactive({
      tableData: [] as Array<any>
    });
    const listTfFootprint = () => {
      loading.value.loading = true;
      if (props.sampleId.includes('Sample_H_') || props.sampleId.includes('Sample_M_')) {
        RegionDetailApi.listTfFootprint(props.sampleId, props.regionId).then((res: any) => {
          loading.value.loading = false;
          data.tableData = res;
        });
      }
    };
    onMounted(() => {
      listTfFootprint();
    });
    return {
      ...toRefs(data),
      loading,
      tableDescription: TF_FOOTPRINT_TABLE_DESCRIPTION
    };
  }
});
</script>
