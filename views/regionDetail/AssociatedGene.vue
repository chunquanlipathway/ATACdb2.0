<template>
  <BaseLoading id="associated_gene" ref="loading">
    <!-- Expression of associated genes -->
    <SingleCard :title="{ icon: 'fas fa-project-diagram', content: 'Expression of associated gene' }">
      <BaseButton :content="expressionButtonContent" :button-click="buttonClick"/>
      <div v-show="isValue && isOverlap" class="expression_head_map" ref="expressionHeadMap">
        <canvas id="expression_canvas" width="950" height="600"></canvas>
      </div>
      <h3 v-show="!isValue" class="gene_one">The number of coding genes are less than two，unable to draw effectively! </h3>
      <h3 v-show="!isOverlap" class="gene_one">No overlap effectively! </h3>
    </SingleCard>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import SingleCard from '@/components/card/SingleCard.vue';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import { EXPRESSION_BUTTON_CONTENT } from '@/assets/ts';
import BaseButton from '@/components/button/BaseButton.vue';
import Time from '@/service/util/base/time';
import '@/assets/less/views/detail/AssociatedGene.less';
import RegionDetailApi from '@/api/service/regionDetailApi';

export default defineComponent({
  name: 'AssociatedGene',
  components: { BaseButton, BaseLoading, SingleCard },
  props: {
    sampleId: {
      type: String,
      default: () => 'Sample_0001'
    },
    regionId: {
      type: String,
      default: () => 'Sample_0001'
    }
  },
  setup(props) {
    const loading = ref();
    const leftRight = ref();
    const echarts = ref();
    const expressionHeadMap = ref();
    const data = reactive({
      overlapGene: '',
      proximalGene: '',
      closestGene: '',
      geneArray: [] as Array<String>,
      isValue: true,
      isOverlap: false,
      resizeData: {
        width: 680,
        height: 350
      }
    });
    const getAssociatedGene = () => {
      loading.value.loading = true;
      return RegionDetailApi.getAssociatedGene(props.sampleId, props.regionId).then((res: any) => {
        loading.value.loading = false;
        const { overlapGene, proximalGene, closestGene, geneList } = res;
        data.geneArray = geneList;
        data.overlapGene = overlapGene;
        data.proximalGene = proximalGene;
        data.closestGene = closestGene;
        console.log(data.geneArray);
      });
    };
    const plotHeatMap = (data: any) => {
      expressionHeadMap.value.innerHTML = '<canvas id="expression_canvas" width="950" height="600"></canvas>';
      new CanvasXpress('expression_canvas', {
        x: {
          names: data.ylabelList
        },
        y: {
          data: data.data,
          vars: data.xlabelList,
          smps: data.ylabelList
        }
      }, {
        clusterAxis: 'variables',
        colorSpectrum: [
          'white',
          'blue',
          'red'
        ],
        graphType: 'Heatmap',
        heatmapIndicatorHeight: 50,
        heatmapIndicatorHistogram: true,
        heatmapIndicatorPosition: 'topLeft',
        heatmapIndicatorWidth: 80,
        samplesClustered: true,
        variablesClustered: true,
        xAxisTitle: 'FPKM range',
        highlightVar: ['DBP']
      });
    };
    const genesExpression = (table: string) => {
      Time.awaitData(() => {
        if (data.geneArray.length >= 2) {
          data.isValue = true;
          RegionDetailApi.genesExpression({
            table,
            geneList: data.geneArray
          }).then((res: any) => {
            if (res.xlabelList.length === 0) {
              data.isOverlap = false;
            } else {
              data.isOverlap = true;
              plotHeatMap(res);
            }
          });
        } else {
          data.isValue = false;
        }
      }, data.geneArray);
    };
    onMounted(() => {
      getAssociatedGene().then(() => {
        genesExpression(EXPRESSION_BUTTON_CONTENT[0].id);
      });
    });
    const buttonClick = (id: string) => {
      genesExpression(id);
    };
    return {
      ...toRefs(data),
      loading,
      leftRight,
      echarts,
      expressionHeadMap,
      buttonClick,
      expressionButtonContent: EXPRESSION_BUTTON_CONTENT
    };
  }
});
</script>

