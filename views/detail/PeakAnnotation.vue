<template>
  <BaseLoading id="peak_annotation" ref="loading">
    <!-- Peak annotation visualization -->
    <SingleCard :title="{ icon: 'fas fa-chart-area', content: `Peak annotation visualization of ${biosampleName}` }">
      <el-row :gutter="24" v-if="!isHaveSrrId">
        <el-col :span="7">
          <h3 class="visualization_title">Plot A</h3>
          <BaseImage :url="visualizationPlotA"/>
        </el-col>
        <el-col :span="7">
          <h3 class="visualization_title">Plot B</h3>
          <BaseImage :url="visualizationPlotB"/>
<!--          <div style="display: flex; justify-content: center; align-items: center; height: 200px;color: gray" v-show="!showB">-->
<!--            NO Data-->
<!--          </div>-->
        </el-col>
        <el-col :span="10">
          <ArrayTable :table-data="visualizationTableData" :column-pair="1"/>
        </el-col>
      </el-row>
      <el-row :gutter="24" v-if="isHaveSrrId">
        <el-col :span="7">
          <h3 class="visualization_title">Plot A</h3>
          <div>--</div>
        </el-col>
        <el-col :span="7">
          <h3 class="visualization_title">Plot B</h3>
          <div>--</div>
        </el-col>
        <el-col :span="10">
          <ArrayTable :table-data="visualizationNoHaveTableData" :column-pair="1"/>
        </el-col>
      </el-row>
    </SingleCard>
    <br/>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import SingleCard from '@/components/card/SingleCard.vue';
import '@/assets/less/views/detail/RegionOverview.less';
import DetailApi from '@/api/service/detailApi';
import { STATIC_DETAIL_PATH, VISUALIZATION_HAVE_TABLE_DATA, VISUALIZATION_NO_HAVE_TABLE_DATA } from '@/assets/ts';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import BaseImage from '@/components/image/BaseImage.vue';
import ArrayTable from '@/components/table/ArrayTable.vue';

export default defineComponent({
  name: 'PeakAnnotation',
  components: { ArrayTable, BaseImage, BaseLoading, SingleCard },
  props: {
    sampleId: {
      type: String,
      default: () => 'Sample_H_0001'
    }
  },
  setup(props) {
    const loading = ref();
    const leftRight = ref();
    const overviewArrayTable = ref();
    const data = reactive({
      biosampleName: '',
      isHaveSrrId: false,
      visualizationPlotA: '',
      visualizationPlotB: '',
      showB: true
    });

    const getSampleInfo = () => {
      if (props.sampleId.includes('Sample_H_')) {
        DetailApi.getSampleOverview(props.sampleId).then((res: any) => {
          if (res.plotB === 0) {
            data.showB = false;
          }
          data.biosampleName = res.biosampleName;
          // Plot A 和 Plot B
          data.biosampleName = res.biosampleName;
          data.visualizationPlotA = `${STATIC_DETAIL_PATH}peak_annotation/plotA/${res.srrId}_rm_black_plotAnnoPie.png`;
          data.visualizationPlotB = `${STATIC_DETAIL_PATH}peak_annotation/plotB/${res.srrId}_rm_black_tagHeatmap.png`;
        });
      }
      if (props.sampleId.includes('Sample_M_')) {
        DetailApi.getMouseSampleOverview(props.sampleId).then((res: any) => {
          if (res.plotB === 0) {
            data.showB = false;
          }
          // Plot A 和 Plot B
          data.biosampleName = res.biosampleName;
          data.visualizationPlotA = `${STATIC_DETAIL_PATH}peak_annotation/plotA/${res.srrId}_rm_black_plotAnnoPie.png`;
          data.visualizationPlotB = `${STATIC_DETAIL_PATH}peak_annotation/plotB/${res.srrId}_rm_black_tagHeatmap.png`;
        });
      } else if (props.sampleId.includes('Sample_MP_') || props.sampleId.includes('Sample_HP_')) {
        DetailApi.getPseudoBulkSampleOverview(props.sampleId).then((res: any) => {
          if (res.plotB === 0) {
            data.showB = false;
          }
          // Plot A 和 Plot B
          // data.isHaveSrrId = Base.isNull(res.srrId);
          data.biosampleName = res.biosampleName;
          data.visualizationPlotA = `${STATIC_DETAIL_PATH}peak_annotation/p_plotA/${props.sampleId}.png`;
          data.visualizationPlotB = `${STATIC_DETAIL_PATH}peak_annotation/p_plotB/${props.sampleId}.png`;
        });
      }
    };

    onMounted(() => {
      getSampleInfo();
    });
    return {
      ...toRefs(data),
      loading,
      leftRight,
      overviewArrayTable,
      visualizationTableData: VISUALIZATION_HAVE_TABLE_DATA,
      visualizationNoHaveTableData: VISUALIZATION_NO_HAVE_TABLE_DATA
    };
  }
});
</script>
