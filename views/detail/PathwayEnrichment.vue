<template>
  <BaseLoading id="TfFootprint" ref="loading">
    <SingleCard :title="{ icon: 'fas fa-table', content:  `Gene function annotation analysis` }">
      <BaseButton :button-click="buttonClick" :content="buttonContent" :is-between="false"></BaseButton>
      <BaseSelect title="P adjust: " :select-data="pData" is-line ref="p1" :change-event="pEvent1" v-show="!isKegg"/>
      <BaseSelect title="P adjust: " :select-data="pData" is-line ref="p2" :change-event="pEvent2" v-show="isKegg"/>
      <div id="goBubbleDiv" v-show="!isKegg"></div>
      <div id="keggBubbleDiv" v-show="isKegg"></div>
      <BaseTable :table-data="goData" :is-service-paging="false" :table-description="gotableDescription" v-show="!isKegg"/>
      <BaseTable :table-data="keggData" :is-service-paging="false" :table-description="keggtableDescription" v-show="isKegg"/>
    </SingleCard>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import SingleCard from '@/components/card/SingleCard.vue';
import BaseTable from '@/components/table/BaseTable.vue';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import {
  BubbleGoLayoutMain, BubbleKeggLayoutMain,
  DETAIL_P_DATA,
  GO_TABLE, goBubble,
  KEGG_TABLE, keggBubble, PATHWAY_BUTTON
} from '@/assets/ts';
import BaseButton from '@/components/button/BaseButton.vue';
import BaseSelect from '@/components/input/BaseSelect.vue';
import config from '@/service/util/plotly';
import DetailApi from '@/api/service/detailApi';

const Plotly = require('plotly.js-dist-min');

export default defineComponent({
  name: 'PathwayEnrichment',
  components: { BaseSelect, BaseButton, BaseLoading, BaseTable, SingleCard },
  props: {
    sampleId: {
      type: String,
      default: () => 'Sample_0001'
    }
  },
  setup(props) {
    const loading = ref();
    const p1 = ref();
    const p2 = ref();
    const data = reactive({
      goData: [] as Array<any>,
      keggData: [] as Array<any>,
      isKegg: false,
      goRes: [] as Array<any>,
      keggRes: [] as Array<any>,
      goBubble: [] as Array<any>,
      keggBubble: [] as Array<any>
    });
    const goBarDiv = (res: any) => {
      const filteredRes = (res as any[]).filter(
        (item) => item.padjust <= p1.value.select
      );
      const sortedRes = filteredRes.sort((a, b) => a.padjust - b.padjust);
      data.goData = sortedRes;
    };
    const keggBarDiv = (res: any) => {
      const filteredRes = (res as any[]).filter(
        (item) => item.padjust <= p2.value.select
      );
      const sortedRes = filteredRes.sort((a, b) => a.padjust - b.padjust);
      data.keggData = sortedRes;
    };
    const pathwayData = () => {
      DetailApi.listGoEnrichment(props.sampleId).then((res: any) => {
        data.goRes = res;
        goBarDiv(data.goRes);
      });
      DetailApi.listKeggEnrichment(props.sampleId).then((res: any) => {
        data.keggRes = res;
        keggBarDiv(data.keggRes);
      });
    };
    const keggBubbleData = () => {
      DetailApi.keggBubble(props.sampleId, p2.value.select).then((res: any) => {
        const item = res[0];
        const top20 = {
          description: item.description.slice(0, 20),
          padjust: item.padjust.slice(0, 20),
          counts: item.counts.slice(0, 20),
          generatio: item.generatio.slice(0, 20),
          sizeList: item.sizeList.slice(0, 20)
        };

        data.keggBubble = [top20];

        const { counts } = top20;
        const maxCount = Math.max(...counts);
        const minCount = Math.min(...counts);
        const midCount = Math.round((maxCount + minCount) / 2);
        Plotly.newPlot(
          'keggBubbleDiv',
          keggBubble([top20]),
          BubbleKeggLayoutMain(maxCount, midCount, minCount, 1200, 500),
          config
        );
      });
    };
    const goBubbleData = () => {
      loading.value.loading = true;
      DetailApi.goBubble(props.sampleId, p1.value.select).then((res: any) => {

        const item = res[0];
        const top20 = {
          description: item.description.slice(0, 20),
          padjust: item.padjust.slice(0, 20),
          counts: item.counts.slice(0, 20),
          generatio: item.generatio.slice(0, 20),
          sizeList: item.sizeList.slice(0, 20)
        };

        data.goBubble = [top20]; //

        const { counts } = top20;
        const maxCount = Math.max(...counts);
        const minCount = Math.min(...counts);
        const midCount = Math.round((maxCount + minCount) / 2);
        loading.value.loading = false;
        Plotly.newPlot(
          'goBubbleDiv',
          goBubble([top20]),
          BubbleGoLayoutMain(maxCount, midCount, minCount, 1200, 500),
          config
        );
      });
    };

    const pEvent1 = () => {
      loading.value.loading = true;
      goBarDiv(data.goRes);
      DetailApi.goBubble(props.sampleId, p1.value.select).then((res: any) => {
        data.goBubble = res;
        const counts = res.flatMap((item: any) => item.counts);
        const maxCount = Math.max(...counts);
        const minCount = Math.min(...counts);
        const midCount = Math.round((maxCount + minCount) / 2);
        loading.value.loading = false;
        Plotly.newPlot(
          'goBubbleDiv',
          goBubble(res),
          BubbleGoLayoutMain(maxCount, midCount, minCount, 1200, 500),
          config
        );
      });
    };
    const pEvent2 = () => {
      loading.value.loading = true;
      keggBarDiv(data.keggRes);
      DetailApi.keggBubble(props.sampleId, p2.value.select).then((res: any) => {
        data.keggBubble = res;
        const counts = res.flatMap((item: any) => item.counts);
        const maxCount = Math.max(...counts);
        const minCount = Math.min(...counts);
        const midCount = Math.round((maxCount + minCount) / 2);
        loading.value.loading = false;
        Plotly.newPlot('keggBubbleDiv', keggBubble(res), BubbleKeggLayoutMain(maxCount, midCount, minCount, 1200, 500), config);
      });
    };
    const buttonClick = () => {
      data.isKegg = !data.isKegg;
    };
    onMounted(() => {
      p1.value.select = DETAIL_P_DATA[1].value;
      p2.value.select = DETAIL_P_DATA[0].value;
      keggBubbleData();
      goBubbleData();
      pathwayData();
    });
    return {
      ...toRefs(data),
      loading,
      p1,
      p2,
      buttonClick,
      pEvent1,
      pEvent2,
      gotableDescription: GO_TABLE,
      keggtableDescription: KEGG_TABLE,
      buttonContent: PATHWAY_BUTTON,
      pData: DETAIL_P_DATA
    };
  }
});
</script>
