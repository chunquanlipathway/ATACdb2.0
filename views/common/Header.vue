<template>
  <div id="header">
    <LeftRight :leftWidth="20">
      <template #left>
        <div class="title slideInLeft-enter">
          <span class="pre_text">ATAC</span><span class="w_text">db</span><span class="tail_text">2.0</span>
        </div>
      </template>
      <template #right>
        <BaseNav :active="active" :menus="menus"/>
      </template>
    </LeftRight>
  </div>
</template>
<script lang="ts">
import { defineComponent, inject, watch } from 'vue';
import { useRoute } from 'vue-router';
import '@/assets/less/common/Header.less';
import BaseNav from '@/components/nav/BaseNav.vue';
import { HEADER_MENUS, PROJECT_NAME } from '@/assets/ts';
import LeftRight from '@/components/layout/LeftRight.vue';

export default defineComponent({
  name: 'Header',
  props: {
    active: {
      type: Number,
      default: () => 0
    }
  },
  components: { LeftRight, BaseNav },
  setup() {

    const route = useRoute();

    const onRefresh = inject<Function>('reload');
    const reload = () => onRefresh && onRefresh();

    watch(() => route.fullPath, () => {
      reload();
    });
    return {
      name: PROJECT_NAME,
      menus: HEADER_MENUS
    };
  }
});
</script>

