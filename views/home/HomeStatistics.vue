<template>
  <div>
        <LeftRight ref="leftRight1">
          <template #left>
            <Echarts :option="bar1Option" :resize-value="bar1ResizeData" ref="bar1Echarts"/>
          </template>
          <template #right>
            <Echarts :option="bar2Option" :resize-value="bar2ResizeData" ref="bar2Echarts"/>
          </template>
        </LeftRight>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from 'vue';
import '@/assets/less/components/image/BaseImage.less';
import LeftRight from '@/components/layout/LeftRight.vue';
import Echarts from '@/components/echarts/Echarts.vue';
import {
  ECHARTS_HOME_HUMAN1_TISSUE_PIE_OPTION, ECHARTS_HOME_HUMAN2_TISSUE_PIE_OPTION,
  ECHARTS_HOME_REGION_BAR_OPTION,
  ECHARTS_HOME_SAMPLE_BAR_OPTION,
} from '@/assets/ts';
import Time from '@/service/util/base/time';

export default defineComponent({
  name: 'HomeStatistics',
  components: { Echarts, LeftRight },
  props: {
    url: {
      type: String,
      default: () => ''
    },
    fit: {
      type: String,
      default: () => 'cover'
    },
    shadow: {
      type: String,
      default: () => 'always'
    }
  },
  setup() {
    const leftRight1 = ref();
    const bar1Echarts = ref();
    const bar2Echarts = ref();
    const pie2Echarts = ref();
    const pie1Echarts = ref();
    const data = reactive({
      bar1ResizeData: {
        width: 400,
        height: 400
      },
      bar2ResizeData: {
        width: 500,
        height: 400
      },
      pie1ResizeData: {
        width: 360,
        height: 400
      },
      pie2ResizeData: {
        width: 360,
        height: 400
      }
    });
    const resize = () => {
      console.log(leftRight1.value.getLeftLabel().offsetWidth);
      Time.sleep(100).then(() => {
        data.bar1ResizeData = {
          width: leftRight1.value.getLeftLabel().offsetWidth,
          height: 400
        };
        data.bar2ResizeData = {
          width: leftRight1.value.getLeftLabel().offsetWidth,
          height: 400
        };
        data.pie1ResizeData = {
          width: leftRight1.value.getLeftLabel().offsetWidth,
          height: 400
        };
        data.pie2ResizeData = {
          width: leftRight1.value.getLeftLabel().offsetWidth,
          height: 400
        };
        bar1Echarts.value.setResize();
        bar2Echarts.value.setResize();
        pie1Echarts.value.setResize();
        pie2Echarts.value.setResize();
      });
    };
    onMounted(() => {
      resize();
    });
    return {
      ...toRefs(data),
      leftRight1,
      bar1Echarts,
      bar2Echarts,
      pie1Echarts,
      pie2Echarts,
      pie1Option: ECHARTS_HOME_HUMAN1_TISSUE_PIE_OPTION,
      pie2Option: ECHARTS_HOME_HUMAN2_TISSUE_PIE_OPTION,
      bar1Option: ECHARTS_HOME_SAMPLE_BAR_OPTION,
      bar2Option: ECHARTS_HOME_REGION_BAR_OPTION
    };
  }
});
</script>
