<template>
  <div id="publication">
    <LeftRight :leftWidth="70" :is-equal-height="true">
      <template #left>
        <BaseCard icon="fas fa-tags" title="News and Updates">
          <div v-for="(item, i) in newsAndUpdates" :key="i">
            <i class="fas fa-dice-d6"></i>
            <span class="time" v-text="item.time"></span>
            <span class="name" v-text="item.name"></span>
            <span class="version" v-text="item.version"></span>:
            <span class="content" v-text="item.content"></span>
          </div>
        </BaseCard>
      </template>
      <template #right>
        <BaseCard icon="fas fa-list-alt" title="Publication">
          <span>{{ publication.person }}</span>
          <span>{{ publication.title }}</span>
          <span class="journal">{{ publication.journal }}</span>
          <span>{{ publication.time }}</span>
          <span>{{ publication.other }}</span>
        </BaseCard>
      </template>
    </LeftRight>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LeftRight from '@/components/layout/LeftRight.vue';
import BaseCard from '@/components/card/BaseCard.vue';
import { NEWS_AND_UPDATES, PUBLICATION } from '@/assets/ts';
import '@/assets/less/views/home/Publication.less';

export default defineComponent({
  name: 'Publication',
  components: { BaseCard, LeftRight },
  setup() {
    return {
      newsAndUpdates: NEWS_AND_UPDATES,
      publication: PUBLICATION
    };
  }
});
</script>
