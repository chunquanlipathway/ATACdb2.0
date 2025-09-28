<template>
  <div id="search_tissue">
    <div class="search_tissue">
      <SingleCard :title="{ icon: 'fas fa-list', content: 'Search results of Gene' }" ref="loading">
        <BaseSelect title="Strategies/Algorithm" :select-data="selectData" :change-event="strategiesChange" ref="geneSelect"/>
        <BaseTable :table-data="tableData" :is-service-paging="false" :table-description="tableDescription" :before-column-number="0">
        <template #default>
          <el-table-column label="Gene" align="center" :width="105">
            <template #default="scope">
              <a
                :href="getGeneTotalUrl(scope.row.species, scope.row.geneName, geneAlgorithm)"
                target="_blank"
              >
                {{ scope.row.geneName }}
              </a>
            </template>
          </el-table-column>
          <el-table-column label="Strategies Type" align="center" :width="200">
            <template #default="scope">
              <span v-html="strategiesShow(scope.row.strategiesWhich)"></span>
            </template>
          </el-table-column>
        </template>
        </BaseTable>
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
import { GENE_TOTAL_TABLE_DESCRIPTION, getGeneTotalUrl, SEARCH_SELECT_DATA } from '@/assets/ts';
import SingleCard from '@/components/card/SingleCard.vue';
import BaseSelect from '@/components/input/BaseSelect.vue';

export default defineComponent({
  name: 'SearchGeneTotal',
  methods: { getGeneTotalUrl },
  components: { BaseSelect, SingleCard, BaseTable },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const loading = ref();
    const geneSelect = ref();
    const data = reactive({
      tableData: [] as Array<any>,
      geneAlgorithm: ''
    });
    // 查询信息
    const listSampleInformation = () => {
      loading.value.startLoading();
      SearchApi.getGeneInformationTotal(route.query).then((res: any) => {
        loading.value.endLoading();
        data.tableData = res as Array<any>;
        console.log(data.tableData);
      });
    };
    const strategiesShow = (strategyString: string) => {
      if (!strategyString) return '';

      const colorMap: Record<string, string> = {
        // ABC: '#20c997',
        ABC: '#f16e66',
        DiseaseEnhancer: '#598ced',
        Closest: '#9296f1',
        eQTL: '#f4b835',
        meQTL: '#f88a2f',
        Overlap: '#ec8b8b',
        Proximal: '#6ebaed',
        ENdb: '#42ac3d'
      };

      const strategyList = strategyString.split(';');
      console.log(strategyList);

      const html = strategyList.map((strategy: string) => {
        const color = colorMap[strategy] || colorMap.other;
        return `
      <span style="
        background-color: ${color};
        color: white;
        padding: 2px 6px;
        margin: 2px;
        border-radius: 4px;
        display: inline-block;
      ">
        ${strategy}
      </span>
    `;
      });

      return html.join(' ');
    };
    const strategiesChange = () => {
      data.geneAlgorithm = geneSelect.value.select;
      console.log(data.geneAlgorithm);
    };
    onMounted(() => {
      geneSelect.value.select = SEARCH_SELECT_DATA[1].value;
      // 判断路径是否符合要求
      // if (Base.isNull(route.query.speciesType) || Base.isNull(route.query.tfName)) {
      //   Jump.routerDefault(router, '/');
      //   Message.warning(`${route.fullPath}: The path is not feasible!`);
      // }
      listSampleInformation();
    });
    return {
      geneSelect,
      ...toRefs(data),
      loading,
      strategiesShow,
      strategiesChange,
      tableDescription: GENE_TOTAL_TABLE_DESCRIPTION,
      selectData: SEARCH_SELECT_DATA
    };
  }
});
</script>
