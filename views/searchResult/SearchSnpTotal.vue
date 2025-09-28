<template>
  <div id="search_tissue">
    <div class="search_tissue">
      <SingleCard :title="{ icon: 'fas fa-list', content: 'Search results of SNP' }" ref="loading">
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
import { SNP_TOTAL_TABLE_DESCRIPTION } from '@/assets/ts';
import SingleCard from '@/components/card/SingleCard.vue';

export default defineComponent({
  name: 'SearchSnpTotal',
  components: { SingleCard, BaseTable },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const loading = ref();
    const data = reactive({
      tableData: [] as Array<any>
    });
    // 查询信息
    const listSampleInformation = () => {
      loading.value.startLoading();
      console.log(route.query);
      SearchApi.getSNPInformationTotal(route.query).then((res: any) => {
        loading.value.endLoading();
        data.tableData = res as Array<any>;
        console.log(res);
      });
    };
    onMounted(() => {
      // 判断路径是否符合要求
      // if (Base.isNull(route.query.speciesType) || Base.isNull(route.query.tfName)) {
      //   Jump.routerDefault(router, '/');
      //   Message.warning(`${route.fullPath}: The path is not feasible!`);
      // }
      listSampleInformation();
    });
    return {
      ...toRefs(data),
      loading,
      tableDescription: SNP_TOTAL_TABLE_DESCRIPTION
    };
  }
});
</script>
