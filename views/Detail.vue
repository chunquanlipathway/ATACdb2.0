<template>
  <div id="detail">
    <div class="detail">
      <!-- Sample overview -->
      <SampleOverview :sample-id="String(this.$route.query.sampleId)" ref="sampleOverview"/>
      <br/>
      <Peak :sample-id="String(this.$route.query.sampleId)"/>
      <br/>
      <!-- TF footprint -->
      <div v-show="isPaused">
        <TfFootprint :sample-id="String(this.$route.query.sampleId)"/>
      </div>
      <br/>
      <!-- PathwayEnrichment -->
      <PathwayEnrichment :sample-id="String(this.$route.query.sampleId)"/>
      <br/>
      <!-- Peak annotation -->
      <PeakAnnotation :sample-id="String(this.$route.query.sampleId)"/>
      <br/>
      <!-- Software and parameters used -->
      <div v-show="isPaused">
        <ParamInfo/>
      </div>
      <br/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Base from '@/service/util/base/base';
import Jump from '@/service/util/base/jump';
import '@/assets/less/views/Detail.less';
import { ElNotification } from 'element-plus';
import SampleOverview from '@/views/detail/SampleOverview.vue';
import Peak from '@/views/detail/Peak.vue';
import TfFootprint from '@/views/detail/TfFootprint.vue';
import PeakAnnotation from '@/views/detail/PeakAnnotation.vue';
import ParamInfo from '@/views/detail/ParamInfo.vue';
import PathwayEnrichment from '@/views/detail/PathwayEnrichment.vue';

export default defineComponent({
  name: 'Detail',
  components: { PathwayEnrichment, ParamInfo, PeakAnnotation, TfFootprint, Peak, SampleOverview },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const sampleOverview = ref();
    const data = reactive({
      isPaused: true,
      sampleId: ''
    });
    const isShow = () => {
      data.sampleId = route.query.sampleId?.toString() || '';
      if (data.sampleId.includes('Sample_HP') || data.sampleId.includes('Sample_MP')) {
        data.isPaused = !data.isPaused;
      }
    };
    onMounted(() => {
      isShow();
      if (Base.isNull(route.query.sampleId)) {
        Jump.routerDefault(router, '/');
        ElNotification({
          title: 'Please check',
          message: `${route.fullPath}: The path is not feasible!`,
          type: 'error'
        });
      }
      // 自动适应大小
      window.onresize = () => {
        sampleOverview.value.resize();
      };
    });
    return {
      ...toRefs(data),
      sampleOverview,
      isShow
    };
  }
});
</script>
