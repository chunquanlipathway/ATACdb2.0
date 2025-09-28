<template>
  <BaseLoading id="tf_footprint" ref="loading">
    <!-- TF footprint of Biosample name -->
    <SingleCard :title="footprint_title" ref="footprintLoading">
      <!-- TF footprint of Biosample name- -->
      <div class="footprint_limit">
        <div>
          <BaseSelect title="Number of binding sites threshold: " width="40%" :select-data="sitesThresholdData" is-line ref="sitesThreshold" :change-event="footprintChangeEvent"/>
          <BaseSelect title="Number of binding sites rank: " width="40%" :select-data="sitesRankData" is-line ref="sitesRank" :change-event="sitesRankChangeEvent"/>
        </div>
        <div>
          <BaseSelect title="Protection score threshold: " width="40%" :select-data="scoreThresholdData" is-line ref="scoreThreshold" :change-event="footprintChangeEvent"/>
          <BaseSelect title="Protection score rank: " width="40%" :select-data="scoreRankData" is-line ref="scoreRank" :change-event="scoreRankChangeEvent"/>
        </div>
        <div>
          <BaseSelect title="TC threshold: " width="40%" :select-data="tcThresholdData" is-line ref="tcThreshold" :change-event="footprintChangeEvent"/>
          <BaseSelect title="TC rank: " width="40%" :select-data="tcRankData" is-line ref="tcRank" :change-event="tcRankChangeEvent"/>
        </div>
      </div>
      <BaseTable :table-data="genomeFootprintTableData" :is-service-paging="false" :pager-count="5" :table-description="genomeFootprintDescription">
        <template #default>
          <!-- Footprint logo -->
          <el-table-column stripe>
            <template #header>
              <span style="margin-left: 35%">Logo</span>
              <BaseTooltip placement="top" content="Footprint logo.">
                <i class="fas fa-question-circle"></i>
              </BaseTooltip>
            </template>
            <template #default="scope">
              <img :src="footprintLogoImage(srrId, scope.row.motifName)"
                   @click="showImage(srrId, scope.row.motifName)"
                   alt="Footprint logo"
                   style="height: 100%;width: 100%;" ref="sampleId">
            </template>
          </el-table-column>
        </template>
      </BaseTable>
      <span class="footprint_little_title">TC rank</span>
      <Echarts :resize-value="genomeFootprintResizeData" ref="genomeFootprintEcharts"/>
      <div class="notes">
        <div v-for="(item, i) in genomeFootprintEchartsNotes" :key="i">
          <span v-text="item.key"></span>: <span v-text="item.value"></span>
        </div>
      </div>
    </SingleCard>
    <br/>
  </BaseLoading>
  <BaseDrawer direction="rtl" ref="drawer">
    <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; font-size: 30px">
      <img :src="img" alt="Drawer Picture" style="width: 80%;height: 70%">
    </div>
  </BaseDrawer>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import SingleCard from '@/components/card/SingleCard.vue';
import '@/assets/less/views/detail/RegionOverview.less';
import DetailApi from '@/api/service/detailApi';
import { KeyValue } from '@/service/model/data';
import {
  GENOME_FOOTPRINT_DESCRIPTION, GENOME_FOOTPRINT_ECHARTS_NOTES,
  GENOME_REGION_DESCRIPTION,
  GENOME_SCORE_RANK,
  GENOME_SCORE_THRESHOLD,
  GENOME_SITES_RANK,
  GENOME_SITES_THRESHOLD,
  GENOME_TC_RANK,
  GENOME_TC_THRESHOLD,
  genomeFootprintOption,
  STATIC_DETAIL_PATH, STATIC_DOWNLOAD_PATH
} from '@/assets/ts';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import BaseTable from '@/components/table/BaseTable.vue';
import Echarts from '@/components/echarts/Echarts.vue';
import BaseTooltip from '@/components/tooltip/BaseTooltip.vue';
import BaseSelect from '@/components/input/BaseSelect.vue';
import Time from '@/service/util/base/time';
import BaseDrawer from '@/components/drawer/BaseDrawer.vue';

export default defineComponent({
  name: 'TfFootprint',
  components: {
    BaseDrawer,
    BaseSelect,
    BaseTooltip,
    Echarts,
    BaseTable,
    BaseLoading,
    SingleCard
  },
  props: {
    sampleId: {
      type: String,
      default: () => 'Sample_H_0001'
    }
  },
  setup(props) {
    const loading = ref();
    const drawer = ref();
    const leftRight = ref();
    const footprintLoading = ref();
    const sitesThreshold = ref();
    const sitesRank = ref();
    const scoreThreshold = ref();
    const scoreRank = ref();
    const tcThreshold = ref();
    const tcRank = ref();
    const genomeFootprintLeftRight = ref();
    const genomeFootprintEcharts = ref();
    const data = reactive({
      srrId: '',
      img: '',
      motifName: '',
      biosampleName: {},
      genomeFootprintTableData: [] as Array<KeyValue>,
      overviewTableData: [] as Array<KeyValue>,
      genomeFootprintResizeData: {
        width: 1000,
        height: 600
      }
    });
    const getTFDownload = () => `${STATIC_DOWNLOAD_PATH}TF_footprint/txt/${props.sampleId}.txt`;
    const footprintLogoImage = (srrId: string, motifName: string) => {
      const motifNameFiltered = motifName
        .replace(/\(/g, '_')
        .replace(/\)/g, '')
        .replace(/:/g, '_');
      return `${STATIC_DETAIL_PATH}tf_footprint/footprint/${srrId}/${motifNameFiltered}.png`;
    };
    const showImage = (srrId: string, motifName: string) => {
      drawer.value.drawer = true;
      data.img = footprintLogoImage(srrId, motifName);
    };
    if (props.sampleId.includes('Sample_H_') || props.sampleId.includes('Sample_M_')) {
      DetailApi.getSampleOverview(props.sampleId).then((res: any) => {
        data.srrId = res.srrId as string;
        data.biosampleName = res.biosampleName as string;
      });
    }

    const genomeFootprintResize = () => {
      Time.sleep(100).then(() => {
        data.genomeFootprintResizeData = {
          width: genomeFootprintLeftRight.value.getRightLabel().offsetWidth,
          height: genomeFootprintLeftRight.value.getLeftLabel().offsetHeight - 10
        };
      });
    };

    const genomeFootprintResult = (limitCount: number) => {
      footprintLoading.value.startLoading();
      DetailApi.genomeFootprintResult(props.sampleId, {
        sitesThreshold: sitesThreshold.value.select,
        sitesRank: sitesRank.value.select,
        scoreThreshold: scoreThreshold.value.select,
        scoreRank: scoreRank.value.select,
        tcThreshold: tcThreshold.value.select,
        tcRank: tcRank.value.select,
        limitCount
      }).then((res: any) => {
        const { tfFootprintList, echartsData } = res;
        footprintLoading.value.endLoading();
        data.genomeFootprintTableData = tfFootprintList;
        genomeFootprintEcharts.value.drawEcharts(genomeFootprintOption(echartsData));
        genomeFootprintResize();
      });
    };

    const footprintChangeEvent = () => {
      if (sitesRank.value.select !== -1) {
        genomeFootprintResult(sitesRank.value.select);
      } else if (scoreRank.value.select !== -1) {
        genomeFootprintResult(scoreRank.value.select);
      } else if (tcRank.value.select !== -1) {
        genomeFootprintResult(tcRank.value.select);
      } else {
        genomeFootprintResult(-1);
      }
    };
    const sitesRankChangeEvent = (value: number) => {
      scoreRank.value.select = -1;
      tcRank.value.select = -1;
      genomeFootprintResult(value);
    };
    const scoreRankChangeEvent = (value: number) => {
      sitesRank.value.select = -1;
      tcRank.value.select = -1;
      genomeFootprintResult(value);
    };
    const tcRankChangeEvent = (value: number) => {
      sitesRank.value.select = -1;
      scoreRank.value.select = -1;
      genomeFootprintResult(value);
    };
    onMounted(() => {
      sitesThreshold.value.select = GENOME_SITES_THRESHOLD[0].value;
      scoreThreshold.value.select = GENOME_SCORE_THRESHOLD[0].value;
      tcThreshold.value.select = GENOME_TC_THRESHOLD[0].value;
      sitesRank.value.select = GENOME_SITES_RANK[0].value;
      scoreRank.value.select = GENOME_SCORE_RANK[0].value;
      tcRank.value.select = GENOME_TC_RANK[0].value;
      genomeFootprintResult(-1);
    });
    return {
      ...toRefs(data),
      loading,
      leftRight,
      drawer,
      showImage,
      footprintLoading,
      sitesThreshold,
      sitesRank,
      scoreThreshold,
      scoreRank,
      tcThreshold,
      tcRank,
      genomeFootprintLeftRight,
      genomeFootprintEcharts,
      footprintLogoImage,
      footprintChangeEvent,
      sitesRankChangeEvent,
      scoreRankChangeEvent,
      tcRankChangeEvent,
      regionDescription: GENOME_REGION_DESCRIPTION,
      sitesThresholdData: GENOME_SITES_THRESHOLD,
      sitesRankData: GENOME_SITES_RANK,
      scoreThresholdData: GENOME_SCORE_THRESHOLD,
      scoreRankData: GENOME_SCORE_RANK,
      tcThresholdData: GENOME_TC_THRESHOLD,
      tcRankData: GENOME_TC_RANK,
      genomeFootprintDescription: GENOME_FOOTPRINT_DESCRIPTION,
      genomeFootprintEchartsNotes: GENOME_FOOTPRINT_ECHARTS_NOTES,
      footprint_title: {
        icon: 'fas fa-image',
        // eslint-disable-next-line global-require,max-len
        content: `TF footprint of ${props.sampleId}<a class="margin_left_right" href='${getTFDownload()}' target="_blank"><img alt="peak_download" src="${require('@/assets/img/detail/download.png')}" class="log_download"></a>`
      }
    };
  }
});
</script>
<style>
.title {
  img {
    width: 3%;
    float: right;
  }
}
</style>

