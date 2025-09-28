<template>
  <div id="search_tissue">
    <div class="search_tissue">
      <SingleCard :title="{ icon: 'fas fa-list', content: 'Search results of TF' }" ref="loading">
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
import SearchApi from '@/api/service/searchApi';
import { TF_TOTAL_TABLE_DESCRIPTION } from '@/assets/ts';
import SingleCard from '@/components/card/SingleCard.vue';

export default defineComponent({
  name: 'SearchTFTotal',
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
      console.log(route.query);
      SearchApi.getTfInformationTotal(route.query).then((res: any) => {
        loading.value.endLoading();
        data.tableData = res as Array<any>;
      });
    };
    onMounted(() => {
      listSampleInformation();
    });
    return {
      ...toRefs(data),
      loading,
      tableDescription: TF_TOTAL_TABLE_DESCRIPTION
    };
  }
});
</script>
