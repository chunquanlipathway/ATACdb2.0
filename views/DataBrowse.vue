<template>
  <BaseLoading id="data_browse" ref="loading">
    <div class="data_browse">
      <BaseTabs active="human" :tabs-data="annotationTabs">
        <template #human>
          <HumanDataBrowse/>
        </template>
        <template #pesudoBulk>
          <PseudoBulkDataBrowse/>
        </template>
      </BaseTabs>
    </div>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import '@/assets/less/views/DataBrowse.less';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import BaseTabs from '@/components/tabs/BaseTabs.vue';
import HumanDataBrowse from '@/views/HumanDataBrowse.vue';
import { TabsBase } from '@/service/model/components/tabs';
import PseudoBulkDataBrowse from '@/views/PseudoBulkDataBrowse.vue';

export default defineComponent({
  name: 'DataBrowse',
  components: { PseudoBulkDataBrowse, HumanDataBrowse, BaseTabs, BaseLoading },
  setup() {
    const loading = ref();
    // 设置响应数据
    const data = reactive({
      value: true as boolean,
      annotationTabs: [
        {
          name: 'human',
          title: 'Bulk ATAC-seq'
        },
        {
          name: 'pesudoBulk',
          title: 'Pseudo-bulk ATAC-seq'
        }
      ] as Array<TabsBase>
    });
    const changeEvent = () => {
      // eslint-disable-next-line no-console
      console.log(data.value);
    };
    onMounted(() => {
      // 更新类型和数量
      data.value = true;
    });
    return {
      ...toRefs(data),
      loading,
      changeEvent
    };
  }
});
</script>
