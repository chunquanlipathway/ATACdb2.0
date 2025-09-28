<template>
  <BaseLoading id="RegionAnnotation" ref="loading">
    <SingleCard :title="target_title">
      <BaseTable :table-data="targetGeneTableData" :is-service-paging="false" :before-column-number="1" :table-description="targetGeneTableDescription">
      <template #default>
        <el-table-column label="Overlap gene" align="center">
          <template #default="scope">
            <span v-html="targetGeneShow(scope.row.f_overlap_gene)"></span>
          </template>
        </el-table-column>

        <el-table-column label="Proximal gene" align="center" style="width: 200px">
          <template #default="scope">
            <span v-html="targetGeneShow(scope.row.f_proximal_gene)"></span>
          </template>
        </el-table-column>

        <el-table-column label="Closest gene" align="center">
          <template #default="scope">
            <span v-html="targetGeneShow(scope.row.f_closest_gene)"></span>
          </template>
        </el-table-column>

        <el-table-column label="Endb" align="center">
          <template #default="scope">
            <span v-html="targetGeneShow(scope.row.f_endb)"></span>
          </template>
        </el-table-column>

        <el-table-column label="DiseaseEnhancer" align="center" v-if="!isMouse">
          <template #default="scope">
            <span v-html="targetGeneShow(scope.row.f_disease_enhancer)"></span>
          </template>
        </el-table-column>

        <el-table-column label="ABC" align="center" v-if="!isMouse">
          <template #default="scope">
            <span v-html="targetGeneShow(scope.row.f_abc)"></span>
          </template>
        </el-table-column>

        <el-table-column label="meQTL" align="center" v-if="!isMouse">
          <template #default="scope">
            <span v-html="targetGeneShow(scope.row.f_meqtl)"></span>
          </template>
        </el-table-column>

        <el-table-column label="eQTL" align="center" v-if="!isMouse">
          <template #default="scope">
            <span v-html="targetGeneShow(scope.row.f_eqtl)"></span>
          </template>
        </el-table-column>
      </template>
      </BaseTable>
      <el-divider></el-divider>
        <BaseButton :content="targetGeneButtonContent" :button-click="annotationButtonClick" v-if="!isMouse" class="button_left"/>
        <BaseButton :content="targetGeneMouseButtonContent" :button-click="annotationButtonClick" v-if="isMouse" class="button_left"/>
      <br/>
      <div v-show="isGeneMapper">
        <LeftRight ref="leftRight">
          <template #left>
            <table class="table table-hover">
              <thead>
              <tr>
                <th>Strategies/Algorithm</th>
                <th>Gene name</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>Overlap gene</td>
                <td>{{ overlapGene }}</td>
              </tr>
              <tr>
                <td>Proximal gene</td>
                <td>{{ proximalGene }}</td>
              </tr>
              <tr>
                <td>Closest gene</td>
                <td>{{ closestGene }}</td>
              </tr>
              </tbody>
            </table>
          </template>
          <template #right>
            <Echarts :resize-value="resizeData" ref="echarts"/>
          </template>
        </LeftRight>
      </div>
      <BaseTable :table-data="annotationTableData" :is-service-paging="false" :table-description="annotationTableDescription" v-show="!isGeneMapper" ref="tableLoading"/>
    </SingleCard>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import BaseButton from '@/components/button/BaseButton.vue';
import BaseTable from '@/components/table/BaseTable.vue';
import {
  DETAIL_MOUSE_TARGET_GENE_BUTTON_CONTENT,
  DETAIL_TARGET_GENE_BUTTON_CONTENT,
  geneGraphOption,
  STATIC_DOWNLOAD_PATH,
  TARGET_GENE_DETAIL_TABLE_DESCRIPTION,
  TARGET_GENE_TABLE_DESCRIPTION
} from '@/assets/ts';
import SingleCard from '@/components/card/SingleCard.vue';
import { ButtonBase } from '@/service/model/components/button';
import { TableHead } from '@/service/model/components/table';
import Json from '@/service/util/base/json';
import ArrayUtil from '@/service/util/base/array';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import RegionDetailApi from '@/api/service/regionDetailApi';
import LeftRight from '@/components/layout/LeftRight.vue';
import Echarts from '@/components/echarts/Echarts.vue';
import Time from '@/service/util/base/time';

export default defineComponent({
  name: 'TargetGene',
  components: { Echarts, LeftRight, BaseLoading, SingleCard, BaseTable, BaseButton },
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
    const drawer = ref();
    const tableLoading = ref();
    const loadingDrawer = ref();
    const weightSpan = ref();
    const leftRight = ref();
    const echarts = ref();
    const data = reactive({
      annotationTableData: [] as Array<any>,
      annotationMouseTableData: [] as Array<any>,
      targetGeneTableData: [] as Array<any>,
      annotationTableDescription: [] as Array<TableHead>,
      annotationMouseTableDescription: [] as Array<TableHead>,
      targetGeneTableDescription: [] as Array<TableHead>,
      tableName: '',
      geneArray: [] as Array<String>,
      overlapGene: '',
      proximalGene: '',
      closestGene: '',
      annotationDetailTitle: '',
      // 是否为小鼠样本展示不同区域注释
      isMouse: false,
      // 是否展示 Detail 列
      isShow: false,
      isGeneMapper: true,
      annotationDetailTableData: [] as Array<any>,
      annotationDetailTableDescription: [] as Array<TableHead>,
      resizeData: {
        width: 680,
        height: 350
      }
    });
    const getAssociatedGene = () => {
      loading.value.loading = true;
      RegionDetailApi.getAssociatedGene(props.sampleId, props.regionId).then((res: any) => {
        const { overlapGene, proximalGene, closestGene, geneList, echartsGraphData } = res;
        data.geneArray = geneList;
        data.overlapGene = overlapGene;
        data.proximalGene = proximalGene;
        data.closestGene = closestGene;
        // echarts graph
        const graphOption = geneGraphOption(echartsGraphData);
        echarts.value.drawEcharts(graphOption);
        loading.value.loading = false;
      });
    };
    // 区域注释
    const listRegionAnnotation = (table: string, content: ButtonBase) => {
      tableLoading.value.startLoading();
      // 得到传参值
      const params = content.other as Object;
      // 添加 table name
      Json.addItem(params, 'name', table);
      // 清空数据
      ArrayUtil.clear(data.annotationTableData);
      // 请求返回数据
      RegionDetailApi.listRegionTargetGene(props.sampleId, props.regionId, params).then((res: any) => {
        tableLoading.value.endLoading();
        data.annotationTableData = res;
      });
    };
    const targetGene = () => {
      RegionDetailApi.getTargetGene(props.sampleId, props.regionId).then((res: any) => {
        data.targetGeneTableData = res;
        // Time.awaitData(() => {
        //   console.log(weightSpan.value.parentNode);
        //   weightSpan.value.parentNode.style.width = '50px';
        //   weightSpan.value.parentNode.style.margin = '0 auto';
        // }, weightSpan.value);
      });
    };
    const targetGeneShow = (data: any) => (data === 1
      ? '<i class="fa-solid fa-check" style="color: #00b55a;"></i>'
      : '<i class="fa-solid fa-xmark" style="color: #ff2b2b;"></i>');
    onMounted(() => {
      getAssociatedGene();
      targetGene();
      if (props.sampleId.includes('Sample_M_') || props.sampleId.includes('Sample_MP_')) {
        console.log('1111111');
        data.isMouse = true;
      }
    });
    // 点击事件
    const annotationButtonClick = (id: string, content: ButtonBase) => {
      if (id !== 'geneMapper') {
        data.isGeneMapper = false;
        if (props.sampleId.includes('Sample_H_') || props.sampleId.includes('Sample_HP_')) {
          data.tableName = id;
          data.isShow = !!content.isShow;
          data.annotationTableDescription = Json.getValueByKey(TARGET_GENE_TABLE_DESCRIPTION, id);
          listRegionAnnotation(id, content);
        } else {
          data.annotationTableDescription = Json.getValueByKey(TARGET_GENE_TABLE_DESCRIPTION, id);
          listRegionAnnotation(id, content);
        }
      } else if (id === 'geneMapper') {
        data.isGeneMapper = true;
      }
    };
    // region download
    const getTargetGeneDownload = () => `${STATIC_DOWNLOAD_PATH}Associated_gene/${props.sampleId}.txt`;
    return {
      ...toRefs(data),
      leftRight,
      tableLoading,
      echarts,
      loading,
      loadingDrawer,
      weightSpan,
      drawer,
      annotationButtonClick,
      targetGeneShow,
      targetGeneButtonContent: DETAIL_TARGET_GENE_BUTTON_CONTENT,
      targetGeneMouseButtonContent: DETAIL_MOUSE_TARGET_GENE_BUTTON_CONTENT,
      targetGeneTableDescription: TARGET_GENE_DETAIL_TABLE_DESCRIPTION,
      target_title: {
        icon: 'fas fa-table',
        // eslint-disable-next-line global-require,max-len
        content: `Target Gene of ATAC_${props.sampleId}_${props.regionId} <a class="margin_left_right" href='${getTargetGeneDownload()}' target="_blank"><img alt="peak_download" src="${require('@/assets/img/detail/download.png')}" class="log_download"></a>`
      }
    };
  }
});
</script>
<style>
.button_left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-right: 10px;
}
.button_left button {
  margin-right: 10px;
}
.title{
  img {
    width: 3%;
    float: right;
  }
}
.el-table th.el-table__cell > .cell {
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  vertical-align: middle;
  width: 101%;
}
</style>
