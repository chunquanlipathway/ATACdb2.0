<template>
  <div id="detail">
    <div class="detail">
      <!-- Region overview -->
      <RegionOverview :sample-id="String(this.$route.query.sampleId)" :region-id="String(this.$route.query.regionId)" ref="regionOverview"/>
      <br/>
      <!-- Accessible chromatin region annotation of Region ID -->
      <RegionAnnotation :sample-id="String(this.$route.query.sampleId)" :region-id="String(this.$route.query.regionId)"/>
      <br/>
      <!-- Accessible chromatin region target gene of Region ID -->
      <TargetGene :sample-id="String(this.$route.query.sampleId)" :region-id="String(this.$route.query.regionId)"/>
      <br/>
      <!-- TF footprint analysis of Region ID -->
      <div v-show="isPaused">
        <TfFootprint :sample-id="String(this.$route.query.sampleId)" :region-id="String(this.$route.query.regionId)"/>
      </div>
      <br/>
      <!-- Motif analysis of Region ID -->
      <Motif :sample-id="String(this.$route.query.sampleId)" :region-id="String(this.$route.query.regionId)"/>
      <br/>
      <!-- Associated gene -->
      <AssociatedGene :sample-id="String(this.$route.query.sampleId)" :region-id="String(this.$route.query.regionId)" ref="associatedGene"/>
      <br/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Base from '@/service/util/base/base';
import Jump from '@/service/util/base/jump';
import Message from '@/service/util/base/message';
import '@/assets/less/views/Detail.less';
import RegionOverview from '@/views/regionDetail/RegionOverview.vue';
import RegionAnnotation from '@/views/regionDetail/RegionAnnotation.vue';
import TfFootprint from '@/views/regionDetail/TfFootprint.vue';
import Motif from '@/views/regionDetail/Motif.vue';
import AssociatedGene from '@/views/regionDetail/AssociatedGene.vue';
import TargetGene from '@/views/regionDetail/TargetGene.vue';

export default defineComponent({
  name: 'RegionDetail',
  components: { TargetGene, AssociatedGene, Motif, TfFootprint, RegionAnnotation, RegionOverview },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const regionOverview = ref();
    const associatedGene = ref();
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
      if (Base.isNull(route.query.sampleId) || Base.isNull(route.query.regionId)) {
        Jump.routerDefault(router, '/');
        Message.warning(`${route.fullPath}: The path is not feasible!`);
      }
      // 自动适应大小
      window.onresize = () => {
        regionOverview.value.resize();
        associatedGene.value.resize();
      };
    });
    return {
      ...toRefs(data),
      regionOverview,
      associatedGene
    };
  }
});
</script>
