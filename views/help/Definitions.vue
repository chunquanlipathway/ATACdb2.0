<template>
  <div id="definitions">
    <LineTable :table-data="tableData" :table-description="tableDescription" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { HELP_TABLE_DATA, HELP_TABLE_DESCRIPTION } from '@/assets/ts';
import LineTable from '@/components/table/LineTable.vue';

export default defineComponent({
  name: 'Definitions',
  props: {
    active: {
      type: String,
      default: () => '5'
    }
  },
  components: { LineTable },
  emits: ['changeActive'],
  setup(props, content) {
    // 获取父组件方法并将路由过来的值赋值给父组件中的变量
    const parent = { ...content };
    onMounted(() => parent.emit('changeActive', props.active));
    return {
      tableData: HELP_TABLE_DATA,
      tableDescription: HELP_TABLE_DESCRIPTION
    };
  }
});
</script>
