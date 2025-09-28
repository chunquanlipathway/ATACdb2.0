<template>
  <div id="app">
    <div ref="refresh">
      <router-view v-if="isRouterAlive" name="header"/>
      <div id="content" class="content">
        <router-view/>
      </div>
      <router-view v-if="isRouterAlive" name="footer"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, provide, nextTick } from 'vue';
import '@/assets/less/Index.less';
import { useRouter } from 'vue-router';
import Time from '@/service/util/base/time';

export default defineComponent({
  name: 'App',
  setup() {
    const router = useRouter();
    const refresh = ref();
    // Refresh router settings
    const isRouterAlive = ref<boolean>(true);
    const reload = () => {
      isRouterAlive.value = false;
      nextTick(() => {
        isRouterAlive.value = true;
      });
      Time.delay(() => {
        // eslint-disable-next-line no-console
        console.log(refresh.value.firstChild.id);
        // eslint-disable-next-line no-console
        console.log(refresh.value.firstChild.id !== 'header');
        if (refresh.value.firstChild.id !== 'header') {
          router.go(0);
        }
      }, 100);
    };
    // Passing parameters
    provide('reload', reload);
    return { isRouterAlive, refresh };
  }
});
</script>

