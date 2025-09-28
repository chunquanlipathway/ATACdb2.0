<template>
  <div id="search_tissue">
    <div class="search_tissue">
      <SingleCard :title="{ icon: 'fas fa-list', content: 'Search results of tissue type' }" ref="loading">
        <BaseTable :table-data="tableData" :is-service-paging="false" :table-description="tableDescription"/>
      </SingleCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import '@/assets/less/views/searchResult/SearchTissue.less';
import BaseTable from '@/components/table/BaseTable.vue';
import Base from '@/service/util/base/base';
import Jump from '@/service/util/base/jump';
import Message from '@/service/util/base/message';
import SearchApi from '@/api/service/searchApi';
import { TISSUE_TABLE_DESCRIPTION } from '@/assets/ts';
import SingleCard from '@/components/card/SingleCard.vue';

export default defineComponent({
  name: 'SearchTissue',
  components: { SingleCard, BaseTable },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const loading = ref();
    const data = reactive({
      tableData: [] as Array<any>
    });

    const listSampleInformation = () => {
      loading.value.startLoading();
      SearchApi.listSampleInformation(String(route.query.speciesType), String(route.query.tissueType), String(route.query.biosampleType)).then((res: any) => {
        loading.value.endLoading();
        data.tableData = res as Array<any>;
      });
    };
    onMounted(() => {
      if (Base.isNull(route.query.speciesType) || Base.isNull(route.query.tissueType) || Base.isNull(route.query.biosampleType)) {
        Jump.routerDefault(router, '/');
        Message.warning(`${route.fullPath}: The path is not feasible!`);
      }
      listSampleInformation();
    });
    return {
      ...toRefs(data),
      loading,
      tableDescription: TISSUE_TABLE_DESCRIPTION
    };
  }
});
</script>

