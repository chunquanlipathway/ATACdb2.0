<template>
  <BaseLoading id="RegionAnnotation" ref="loading">
      <SingleCard :title="{ icon: 'fas fa-table', content:  `Accessible chromatin region annotation of ATAC_${sampleId}_${regionId}` }">
        <div v-if="!isMouse">
          <el-button class="purple-annotation-btn"
            :class="button_left"
            @click="annotationButtonClick(item.id, item)"
            v-for="(item, i) in annotationButtonContent"
            :key="i"
          >
            <img
              src="@/assets/img/detail/new.png"
              alt="new"
              class="purple-annotation-icon"
              v-if="item.isNew"
            />
            <span style="vertical-align: middle;padding: 8px 15px">{{ item.title }}</span>
          </el-button>
        </div>
        <div v-if="isMouse">
          <el-button class="purple-annotation-btn"
                     :class="button_left"
                     @click="annotationButtonClick(item.id, item)"
                     v-for="(item, i) in annotationMouseButtonContent"
                     :key="i"
          >
            <img
              src="@/assets/img/detail/new.png"
              alt="new"
              class="purple-annotation-icon"
              v-if="item.isNew"
            />
            <span style="vertical-align: middle;padding: 8px 15px">{{ item.title }}</span>
          </el-button>
        </div>
        <h5>Total Number of {{ title }} : {{total}}</h5>
        <BaseLoading ref="tableloading">
          <BaseTable :table-data="annotationTableData" :is-service-paging="false" :table-description="annotationTableDescription">
        <template #default>
          <el-table-column label="Detail" stripe align="center" v-if="isShow">
            <template #default="scope">
              <!-- Detail -->
              <el-button @click="detailClick(scope.row)" size="mini" type="primary"> Detail </el-button>
            </template>
          </el-table-column>
        </template>
      </BaseTable>
        </BaseLoading>
    </SingleCard>
    <BaseDrawer :title="annotationDetailTitle" ref="drawer">
      <BaseTable :table-data="annotationDetailTableData" :is-service-paging="false" :table-description="annotationDetailTableDescription" ref="loadingDrawer"/>
    </BaseDrawer>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import BaseTable from '@/components/table/BaseTable.vue';
import {
  ANNOTATION_MOUSE_TABLE_DESCRIPTION,
  ANNOTATION_TABLE_DESCRIPTION,
  CISTROME_ANNOTATION_DETAIL_TABLE_DESCRIPTION,
  COMMON_SNP_ANNOTATION_TABLE_DESCRIPTION,
  DETAIL_ANNOTATION_BUTTON_CONTENT,
  DETAIL_ANNOTATION_BUTTON_TITLE_MAP,
  DETAIL_MOUSE_ANNOTATION_BUTTON_CONTENT, DETAIL_MOUSE_ANNOTATION_BUTTON_TITLE_MAP,
  EQTL_ANNOTATION_DETAIL_TABLE_DESCRIPTION,
  HISTONE_ANNOTATION_DETAIL_TABLE_DESCRIPTION,
  MOUSE_SNP_ANNOTATION_TABLE_DESCRIPTION,
  RISK_SNP_ANNOTATION_DETAIL_TABLE_DESCRIPTION,
  TCOFBASE_ANNOTATION_DETAIL_TABLE_DESCRIPTION
} from '@/assets/ts';
import SingleCard from '@/components/card/SingleCard.vue';
import DetailApi from '@/api/service/detailApi';
import { ButtonBase } from '@/service/model/components/button';
import { TableHead } from '@/service/model/components/table';
import Json from '@/service/util/base/json';
import ArrayUtil from '@/service/util/base/array';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import BaseDrawer from '@/components/drawer/BaseDrawer.vue';
import RegionDetailApi from '@/api/service/regionDetailApi';
import time from '@/service/util/base/time';

export default defineComponent({
  name: 'RegionAnnotation',
  components: { BaseLoading, SingleCard, BaseTable, BaseDrawer },
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
    const tableloading = ref();
    const loadingDrawer = ref();
    const data = reactive({
      annotationTableData: [] as Array<any>,
      annotationMouseTableData: [] as Array<any>,
      annotationTableDescription: [] as Array<TableHead>,
      annotationMouseTableDescription: [] as Array<TableHead>,
      title: '',
      tableName: '',
      total: '',
      annotationDetailTitle: '',
      isMouse: false,
      isShow: false,
      annotationDetailTableData: [] as Array<any>,
      annotationDetailTableDescription: [] as Array<TableHead>
    });
    const listRegionAnnotation = (table: string, content: ButtonBase) => {
      tableloading.value.loading = true;
      const params = content.other as Object;
      Json.addItem(params, 'name', table);
      ArrayUtil.clear(data.annotationTableData);
      RegionDetailApi.listRegionAnnotation(props.sampleId, props.regionId, params).then((res: any) => {
        tableloading.value.loading = false;
        data.annotationTableData = res;
        data.total = res.length;
      });
    };
    onMounted(() => {
      if (props.sampleId.includes('Sample_M_') || props.sampleId.includes('Sample_MP_')) {
        data.isMouse = true;
        data.annotationTableDescription = MOUSE_SNP_ANNOTATION_TABLE_DESCRIPTION;
        listRegionAnnotation(DETAIL_MOUSE_ANNOTATION_BUTTON_CONTENT[0].id, DETAIL_MOUSE_ANNOTATION_BUTTON_CONTENT[0]);
        data.title = 'Mouse SNP';
      } else {
        data.annotationTableDescription = COMMON_SNP_ANNOTATION_TABLE_DESCRIPTION;
        listRegionAnnotation(DETAIL_ANNOTATION_BUTTON_CONTENT[0].id, DETAIL_ANNOTATION_BUTTON_CONTENT[0]);
        data.title = 'Common SNP';
      }
    });
    const annotationButtonClick = (id: string, content: ButtonBase) => {
      data.tableName = id;
      data.isShow = !!content.isShow;
      if (props.sampleId.includes('Sample_H_') || props.sampleId.includes('Sample_HP_')) {
        data.annotationTableDescription = Json.getValueByKey(ANNOTATION_TABLE_DESCRIPTION, id);
        data.title = Json.getValueByKey(DETAIL_ANNOTATION_BUTTON_TITLE_MAP, id);
        listRegionAnnotation(id, content);
      } else {
        data.annotationTableDescription = Json.getValueByKey(ANNOTATION_MOUSE_TABLE_DESCRIPTION, id);
        data.title = Json.getValueByKey(DETAIL_MOUSE_ANNOTATION_BUTTON_TITLE_MAP, id);
        listRegionAnnotation(id, content);
      }
    };
    const detailClick = (row: any) => {
      drawer.value.drawer = true;
      drawer.value.loading = true;
      time.delay(() => {
        loadingDrawer.value.startLoading();
        ArrayUtil.clear(data.annotationDetailTableData);
        if (data.tableName === 't_eqtl' || data.tableName === 't_gwas') {
          const isEqtl = data.tableName === 't_eqtl';
          const pathMiddle = isEqtl ? 't_eqtl_detail' : 't_gwas_detail';
          data.annotationDetailTitle = isEqtl ? 'eQTL detail' : 'Risk SNP detail';
          data.annotationDetailTableDescription = isEqtl
            ? EQTL_ANNOTATION_DETAIL_TABLE_DESCRIPTION
            : RISK_SNP_ANNOTATION_DETAIL_TABLE_DESCRIPTION;
          DetailApi.listEqtlOrRiskSnpDetail(pathMiddle, row.f_rs_id).then((res: any) => {
            drawer.value.loading = false;
            loadingDrawer.value.endLoading();
            data.annotationDetailTableData = res;
          });
        } else if (data.tableName === 't_histone' || data.tableName === 't_histone_mouse') {
          data.annotationDetailTitle = 'Histone detail';
          const pathMiddle = 't_histone_detail';
          data.annotationDetailTableDescription = HISTONE_ANNOTATION_DETAIL_TABLE_DESCRIPTION;
          DetailApi.listHistoneOrCistromeDetail(pathMiddle, row.f_gsm_id).then((res: any) => {
            drawer.value.loading = false;
            loadingDrawer.value.endLoading();
            data.annotationDetailTableData = res;
          });
        } else if (data.tableName === 't_cistrome' || data.tableName === 't_cistrome_mouse') {
          data.annotationDetailTitle = 'Trancfactor_detail';
          const pathMiddle = 't_cistrome_detail';
          data.annotationDetailTableDescription = CISTROME_ANNOTATION_DETAIL_TABLE_DESCRIPTION;
          DetailApi.listHistoneOrCistromeDetail(pathMiddle, row.f_gsm_id).then((res: any) => {
            drawer.value.loading = false;
            loadingDrawer.value.endLoading();
            data.annotationDetailTableData = res;
          });
        } else if (data.tableName === 't_tcofbase' || data.tableName === 't_tcofbase_mouse') {
          const pathMiddle = 't_tcof_detail';
          data.annotationDetailTitle = 'TcofBase Detail';
          data.annotationDetailTableDescription = TCOFBASE_ANNOTATION_DETAIL_TABLE_DESCRIPTION;
          DetailApi.listTcofBaseDetail(pathMiddle, row.f_tcof_sample_id).then((res: any) => {
            drawer.value.loading = false;
            loadingDrawer.value.endLoading();
            data.annotationDetailTableData = res;
          });
        }
      });
    };
    return {
      ...toRefs(data),
      loading,
      loadingDrawer,
      tableloading,
      drawer,
      annotationButtonClick,
      detailClick,
      annotationButtonContent: DETAIL_ANNOTATION_BUTTON_CONTENT,
      annotationMouseButtonContent: DETAIL_MOUSE_ANNOTATION_BUTTON_CONTENT
    };
  }
});
</script>
<style scoped>
.button_left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-right: 10px;
}
.button_left button {
  margin-right: 10px;
}
.purple-annotation-btn {
  margin: 7px;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  color: #2685c9!important;
  background-color: #d5d3f4;
  border: 1px solid #2685c9;
  border-radius: 4px;
  padding: 0;
}
span {
  color: #2685c9;
}
.purple-annotation-icon {
  width: 28px;
  margin-bottom: 3px;
}
img + span {
  padding-left: 0!important;
}
</style>

