<template>
  <div id="search_tissue">
    <div class="search_tissue">
      <SingleCard :title="{ icon: 'fas fa-list', content: 'Search results of type' }" ref="loading">
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
import { DATA_BROWSE_TABLE_DESCRIPTION } from '@/assets/ts';
import SingleCard from '@/components/card/SingleCard.vue';
import {ElNotification} from "element-plus";

export default defineComponent({
  name: 'TypeSearch',
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
      SearchApi.listHomeSampleInformation(String(route.query.title), String(route.query.value)).then((res: any) => {
        loading.value.endLoading();
        data.tableData = res as Array<any>;
      });
    };
    const isInvalid = (str: any) => {
      if (Base.isNull(str)) return true;
      // 去掉前后空格
      const trimmed = str.trim();
      if (trimmed.length === 0) return true; // 全是空格
      // 正则：只包含非字母数字的字符（特殊字符）
      if (/^[^a-zA-Z0-9]+$/.test(trimmed)) return true;
      return false;
    };

    onMounted(() => {
      // 判断路径是否符合要求
      if (Base.isNull(route.query.title) || isInvalid(route.query.value)) {
        Jump.routerDefault(router, '/');
        ElNotification({
          title: 'Invalid input, please try again!',
          type: 'warning'
        });
      }
      listSampleInformation();
    });
    return {
      ...toRefs(data),
      loading,
      tableDescription: DATA_BROWSE_TABLE_DESCRIPTION
    };
  }
});
</script>
