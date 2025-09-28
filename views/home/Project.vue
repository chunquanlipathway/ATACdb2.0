<template>
  <div id="project">
    <BaseCard icon="fas fa-heart" title="Sister Projects">
      <LeftRight :is-equal-height="true">
        <template #left>
          <div v-for="(item, i) in sisterProjects[0]" :key="i">
            <span class="head">
              <i class="fas fa-thumbs-up"></i>
              <a :href="item.url" v-text="item.title" target="_blank"></a>
            </span>
            <p v-text="item.content"></p>
          </div>
        </template>
        <template #right>
          <div v-for="(item, i) in sisterProjects[1]" :key="i">
              <span class="head">
                <i class="fas fa-thumbs-up"></i>
                <a :href="item.url" v-text="item.title" target="_blank"></a>
              </span>
          <p v-text="item.content"></p>
          </div>
        </template>
      </LeftRight>
    </BaseCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import BaseCard from '@/components/card/BaseCard.vue';
import LeftRight from '@/components/layout/LeftRight.vue';
import { SISTER_PROJECTS } from '@/assets/ts';
import { CardBase } from '@/service/model/components/card';
import '@/assets/less/views/home/Project.less';

export default defineComponent({
  name: 'Project',
  components: { BaseCard, LeftRight },
  setup() {
    const data = reactive({
      sisterProjects: [] as Array<Array<CardBase>>
    });
    // 分两段
    const { length } = SISTER_PROJECTS;
    data.sisterProjects.push(SISTER_PROJECTS.slice(0, length / 2));
    data.sisterProjects.push(SISTER_PROJECTS.slice(length / 2, length));
    return {
      ...toRefs(data)
    };
  }
});
</script>
