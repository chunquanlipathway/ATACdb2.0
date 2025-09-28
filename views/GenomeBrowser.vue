<template>
  <div id="gene_browse">
    <BaseButton :content="buttonContent" :button-click="buttonClick"/>
    <iframe
      v-if="isHuman"
      src="https://bio.liclab.net/ATACdb_2jbrowse/?config=config_hg38.json&session=share-uO2Tfm-9fe&password=ZK6K5"
      style="width:100%; height:800px; border:none;"
    />
    <iframe
      v-if="isMouse"
      src="https://bio.liclab.net/ATACdb_2jbrowse/?config=config_mm10.json&session=share-POo2ofGd2x&password=MvyxJ"
      style="width:100%; height:800px; border:none;"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import Base from '@/service/util/base/base';
import '@/assets/less/views/GenmoBrowse.less';
import { GENOME_BUTTON, JBROWSE_PATH } from '@/assets/ts';
import { TabsBase } from '@/service/model/components/tabs';
import BaseButton from '@/components/button/BaseButton.vue';
import { ElNotification } from 'element-plus';

export default defineComponent({
  name: 'GeneBrowse',
  components: { BaseButton },
  setup() {
    const route = useRoute();
    const data = reactive({
      isHuman: true,
      isMouse: false,
      genmoContent: [
        {
          name: 'hg38',
          title: 'Human'
        },
        {
          name: 'mm10',
          title: 'Mouse'
        }
      ] as Array<TabsBase>,
      url: `${JBROWSE_PATH}?config.json=&session=share-uO2Tfm-9fe&password=ZK6K5`
    });
    const buttonClick = (id: string) => {
      if (id === 'mm10') {
        data.isHuman = false;
        data.isMouse = true;
      }
      if (id === 'hg38') {
        data.isMouse = false;
        data.isHuman = true;
      }
    };
    onMounted(() => {
      ElNotification({
        title: 'Wishing you a pleasant browsing experience!',
        message: 'Due to the large volume of data, the results may take some time to load. Thank you for your patience!',
        type: 'success'
      });
      if (Base.noNull(route.query.loc)) {
        const tracks = Base.noNull(route.query.track) ? `${String(route.query.track)},` : '';
        data.url = `${JBROWSE_PATH}?loc=${String(route.query.loc)}&tracks=DNA,Ensembl_gene,${tracks.trim()}phastCons&highlight=${String(route.query.loc)}`;
      }
    });
    return {
      buttonClick,
      buttonContent: GENOME_BUTTON,
      ...toRefs(data)
    };
  }
});
</script>

