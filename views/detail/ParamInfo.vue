<template>
  <BaseLoading id="param_info" ref="loading">
    <!-- Software and parameters used -->
    <SingleCard :title="{ icon: 'fas fa-th-list', content: 'Software and parameters used' }">
      <ArrayTable :table-data="softwareTableData" :column-pair="1"/>
    </SingleCard>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import SingleCard from '@/components/card/SingleCard.vue';
import '@/assets/less/views/detail/RegionOverview.less';
import { KeyValue } from '@/service/model/data';
import { SOFTWARE_TABLE_DATA } from '@/assets/ts';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import ArrayTable from '@/components/table/ArrayTable.vue';

export default defineComponent({
  name: 'ParamInfo',
  components: { ArrayTable, BaseLoading, SingleCard },
  setup() {
    const loading = ref();
    const leftRight = ref();
    const data = reactive({
      softwareTableData: [] as Array<KeyValue>
    });
    onMounted(() => {
      // getRegionOverview();
    });
    return {
      ...toRefs(data),
      loading,
      leftRight,
      softwareTableData: SOFTWARE_TABLE_DATA
    };
  }
});
</script>
