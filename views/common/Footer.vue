<template>
  <div id="footer">
    <div class="link">
      <span v-for="(link, i) in links" :key="i">
        <a target="_blank" :href="link.href" @click="menuClick(link)">{{ link.title }}</a>
        <VerticalDivider v-if="i !== links.length - 1"/>
      </span>
    </div>
    <div class="down">
      <div>
        Copyright <i class="fa fa-copyright"></i> {{ copyright }}
      </div>
      <div>
        <img class="PB" src="@/assets/img/common/PB.png" alt="PB.log"/>
        {{ pb }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import '@/assets/less/common/Footer.less';
import { HEADER_MENUS } from '@/assets/ts';
import VerticalDivider from '@/components/divider/VerticalDivider.vue';
import Jump from '@/service/util/base/jump';

export default defineComponent({
  name: 'Footer',
  components: { VerticalDivider },
  setup() {
    // 获取路由
    const router = useRouter();
    const data = reactive({});
    // 设置响应数据
    const menuClick = (menu: any) => {
      menu.isShow = true;
      Jump.routerDefault(router, menu.click);
    };
    return {
      ...toRefs(data),
      links: HEADER_MENUS,
      menuClick,
      copyright: '2021-2021 Copyright © HMU',
      pb: '黑ICP备16009434号-1 Li C Lab'
    };
  }
});
</script>
