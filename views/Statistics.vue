<template xmlns="http://www.w3.org/1999/html">
  <div id="statistics">
    <div class="statistics">
      <h2 class="title">
        Statistics
      </h2>
      <el-divider></el-divider>
      <ArrayTable title="Statistics of human chromatin accessibility data" :table-data="chromatinHumanAccessibility" :column-pair="2"/>
      <br/>
      <ArrayTable title="Statistics of mouse chromatin accessibility data" :table-data="chromatinMouseAccessibility" :column-pair="2"/>
      <br/>
      <div>
        <h3>Statistics Sample plot</h3>
        <LeftRight ref="leftRight">
          <template #left>
            <Echarts :option="pieSampleOption" :resize-value="pieHumanResizeData" ref="humanEcharts"/>
          </template>
          <template #right>
            <Echarts :option="piePeakOption" :resize-value="pieHumanResizeData" ref="humanEcharts"/>
          </template>
        </LeftRight>
      </div>
      <el-divider></el-divider>
      <div class="tab_annotation">
        <ArrayTable title="Statistics of human annotation" :table-data="humanAnnotation" :column-pair="2"/>
        <br/>
        <ArrayTable title="Statistics of mouse annotation" :table-data="mouseAnnotation" :column-pair="2"/>
      </div>
      <br/>
      <div>
        <LeftRight ref="leftRight">
          <template #left>
            <Echarts :option="barHumanAnnotationOption" :resize-value="pieResizeData" ref="pieEcharts"/>
          </template>
          <template #right>
            <Echarts :option="barMouseAnnotationOption" :resize-value="pieResizeData" ref="barEcharts"/>
          </template>
        </LeftRight>
      </div>
      <el-divider></el-divider>
      <ArrayTable title="Statistics of samples" :table-data="samples" :column-pair="2"/>
      <div>
        <LeftRight ref="leftRight">
          <template #left>
            <Echarts :option="pieHumanTissueOption" :resize-value="pieResizeData" ref="pieEcharts"/>
          </template>
          <template #right>
            <Echarts :option="pieMouseTissueOption" :resize-value="pieResizeData" ref="barEcharts"/>
          </template>
        </LeftRight>
      </div>
      <br/>
      <el-divider></el-divider>
      <ArrayTable title="Statistics of Gene" :table-data="genes" :column-pair="2"/>
      <el-divider></el-divider>
      <div>
        <Echarts :option="geneBarHumanOption" :resize-value="geneBarResizeData" ref="geneBarEcharts"/>
        <br/>
        <Echarts :option="geneBarMouseOption" :resize-value="geneBarResizeData" ref="geneBarEcharts"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import '@/assets/less/views/Statistics.less';
import ArrayTable from '@/components/table/ArrayTable.vue';
import {
  CHROMATIN_HUMAN_ACCESSIBILITY,
  CHROMATIN_MOUSE_ACCESSIBILITY,
  ECHARTS_HUMAN_ANNOTATION_BAR_OPTION,
  ECHARTS_HUMAN_TISSUE_PIE_OPTION, ECHARTS_MOUSE_ANNOTATION_BAR_OPTION,
  ECHARTS_MOUSE_TISSUE_PIE_OPTION,
  ECHARTS_PEAK_PIE_OPTION,
  ECHARTS_SAMPLE_PIE_OPTION, GENE_HUMAN_BAR_OPTION, GENE_MOUSE_BAR_OPTION, GENE_SATISTIC,
  HUMAN_ANNOTATION,
  MOUSE_ANNOTATION,
  SAMPLES
} from '@/assets/ts';
import LeftRight from '@/components/layout/LeftRight.vue';
import Echarts from '@/components/echarts/Echarts.vue';
import Time from '@/service/util/base/time';

export default defineComponent({
  name: 'Statistics',
  components: { Echarts, LeftRight, ArrayTable },
  setup() {
    const leftRight = ref();
    const data = reactive({
      pieResizeData: {
        width: 600,
        height: 600
      },
      barResizeData: {
        width: 600,
        height: 600
      },
      pieHumanResizeData: {
        width: 600,
        height: 600
      },
      geneBarResizeData: {
        width: 1500,
        height: 600
      }
    });
    const resize = () => {
      Time.sleep(100).then(() => {
        // 设置 echarts 大小
        data.pieHumanResizeData = {
          width: leftRight.value.getLeftLabel().offsetWidth,
          height: 600
        };
        data.pieResizeData = {
          width: leftRight.value.getLeftLabel().offsetWidth,
          height: 600
        };
        data.barResizeData = {
          width: leftRight.value.getRightLabel().offsetWidth,
          height: 600
        };
      });
    };
    onMounted(() => {
      resize();
      // 自动适应大小
      window.onresize = resize;
    });
    return {
      ...toRefs(data),
      leftRight,
      geneBarHumanOption: GENE_HUMAN_BAR_OPTION,
      geneBarMouseOption: GENE_MOUSE_BAR_OPTION,
      chromatinHumanAccessibility: CHROMATIN_HUMAN_ACCESSIBILITY,
      chromatinMouseAccessibility: CHROMATIN_MOUSE_ACCESSIBILITY,
      humanAnnotation: HUMAN_ANNOTATION,
      mouseAnnotation: MOUSE_ANNOTATION,
      samples: SAMPLES,
      pieHumanTissueOption: ECHARTS_HUMAN_TISSUE_PIE_OPTION,
      pieMouseTissueOption: ECHARTS_MOUSE_TISSUE_PIE_OPTION,
      pieSampleOption: ECHARTS_SAMPLE_PIE_OPTION,
      piePeakOption: ECHARTS_PEAK_PIE_OPTION,
      barHumanAnnotationOption: ECHARTS_HUMAN_ANNOTATION_BAR_OPTION,
      barMouseAnnotationOption: ECHARTS_MOUSE_ANNOTATION_BAR_OPTION,
      genes: GENE_SATISTIC
    };
  }
});
</script>
