<template>
  <div id="download">
    <div class="download">
      <h2 class="title">
        Download
      </h2>
      <el-divider></el-divider>
      <BaseTabs active="human" :tabs-data="annotationTabs">
        <template #human>
          <el-divider></el-divider>
          <div class="title">
            <h3><i class="fas fa-list"></i>Sample Information</h3>
          </div>
          <ArrayTable :table-data="sampleData"/>
          <div class="title">
            <h3><i class="fas fa-list"></i>Download accessible chromatin region, TF footprint and associated gene for each bulk ATAC-seq sample</h3>
          </div>
          <el-divider></el-divider>
          <BaseTable :table-data="listBulkHuman" :is-service-paging="false" :table-description="sampleBulkHumanDescription" ref="BulkHumanLoading">
            <template #default>
              <el-table-column label="QC" align="center">
                <template #header>
                  <span style="font-size: 14px; text-align: center">QC</span>
                  <BaseTooltip placement="top" content="The three-color dots represent the quality level of the sample data (red: Concerning; yellow: Acceptable; green: Ideal)">
                    <i class="fa-solid fa-circle-question" style="color: #000000;"></i>
                  </BaseTooltip>
                </template>
                <template #default="scope">
                  <BaseTooltip placement = "top" content="TSS enrichment score">
                    <span v-html="tssEnrichmentScoreShow(scope.row.tssEnrichmentScore, scope.row.species)"></span>
                  </BaseTooltip>
                  <BaseTooltip placement = "top" content="Fraction of reads in peaks (FRiP)">
                    <span v-html="fripShow(scope.row.frip)"></span></BaseTooltip>
                  <BaseTooltip placement = "top" content="Per Sequence Quality Scores: Distribution of average base mass per sequence">
                    <span v-html="sqQualityScoreShow(scope.row.sqQualityScore)"></span>
                  </BaseTooltip>
                  <BaseTooltip placement = "top" content="Per Sequence GC Content:Distribution of average GC content for each sequence">
                    <span v-html="sqQualityScoreShow(scope.row.sqGcContent)"></span>
                  </BaseTooltip>
                  <BaseTooltip placement = "top" content="Sequence Duplication Levels:Proportion of duplicate reads">
                    <span v-html="sqQualityScoreShow(scope.row.sqDuplicationLevels)"></span>
                  </BaseTooltip>
                </template>
              </el-table-column>
              <el-table-column label="Accessible chromatin region" stripe align="center" :width="195">
                <template #default="scope">
                  <!-- region -->
                  <el-link :href="regionDownloadBed(scope.row)">
                    <el-button size="mini" type="primary"> bed &nbsp;<i class="fas fa-file-download"></i></el-button>
                  </el-link>
                  <el-divider direction="vertical"></el-divider>
                  <el-link :href="regionDownloadCsv(scope.row)">
                    <el-button size="mini" type="primary"> csv &nbsp;<i class="fas fa-file-download"></i></el-button>
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column label="TF footprint" stripe align="center" :width="195">
                <template #default="scope">
                  <!-- TF footprint -->
                  <el-link :href="tfFootprintDownloadTxt(scope.row)">
                    <el-button size="mini" type="primary"> txt &nbsp;<i class="fas fa-file-download"></i></el-button>
                  </el-link>
                  <el-divider direction="vertical"></el-divider>
                  <el-link :href="tfFootprintDownloadZip(scope.row)">
                    <el-button size="mini" type="primary"> zip &nbsp;<i class="fas fa-file-download"></i></el-button>
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column label="Associated gene" stripe align="center" :width="100">
                <template #default="scope">
                  <!-- Associated gen -->
                  <el-link :href="geneDownloadBed(scope.row)">
                    <el-button size="mini" type="primary"> txt &nbsp;<i class="fas fa-file-download"></i></el-button>
                  </el-link>
                </template>
              </el-table-column>
            </template>
          </BaseTable>
          <el-divider></el-divider>
          <div class="title">
            <h3><i class="fas fa-list"></i>Download accessible chromatin region, TF footprint and associated gene for pesudobulk ATAC-seq each sample</h3>
          </div>
          <el-divider></el-divider>
          <BaseTable :table-data="listPseudoBulkHuman" :is-service-paging="false" :table-description="samplePseudoBulkHumanDescription" ref="PseudoBulkHumanLoading">
            <template #default>
              <el-table-column label="Accessible chromatin region" stripe align="center" :width="195">
                <template #default="scope">
                  <!-- region -->
                  <el-link :href="regionDownloadBed(scope.row)">
                    <el-button size="mini" type="primary"> bed &nbsp;<i class="fas fa-file-download"></i></el-button>
                  </el-link>
                  <el-divider direction="vertical"></el-divider>
                  <el-link :href="regionDownloadCsv(scope.row)">
                    <el-button size="mini" type="primary"> csv &nbsp;<i class="fas fa-file-download"></i></el-button>
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column label="Associated gene" stripe align="center" :width="100">
                <template #default="scope">
                  <!-- Associated gen -->
                  <el-link :href="geneDownloadBed(scope.row)">
                    <el-button size="mini" type="primary"> bed &nbsp;<i class="fas fa-file-download"></i></el-button>
                  </el-link>
                </template>
              </el-table-column>
            </template>
          </BaseTable>
          <div class="title">
            <h3><i class="fas fa-list"></i>Download accessible chromatin region, TF footprint and associated gene</h3>
          </div>
          <el-divider></el-divider>
          <ArrayTable :table-data="regionData"/>
        </template>
        <template #mouse>
          <el-divider></el-divider>
          <div class="title">
            <h3><i class="fas fa-list"></i>Sample Information</h3>
          </div>
          <ArrayTable :table-data="sampleMouseData"/>
          <div class="title">
            <h3><i class="fas fa-list"></i>Download accessible chromatin region, TF footprint and associated gene for each bulk ATAC-seq sample</h3>
          </div>
          <el-divider></el-divider>
          <BaseTable :table-data="listBulkMouse" :is-service-paging="false" :table-description="sampleBulkHumanDescription" ref="BulkMouseLoading">
            <template #default>
              <el-table-column label="QC" align="center">
                <template #header>
                  <span style="font-size: 14px; text-align: center">QC</span>
                  <BaseTooltip placement="top" content="The three-color dots represent the quality level of the sample data (red: Concerning; yellow: Acceptable; green: Ideal)">
                    <i class="fa-solid fa-circle-question" style="color: #000000;"></i>
                  </BaseTooltip>
                </template>
                <template #default="scope">
                  <BaseTooltip placement = "top" content="TSS enrichment score">
                    <span v-html="tssEnrichmentScoreShow(scope.row.tssEnrichmentScore, scope.row.species)"></span>
                  </BaseTooltip>
                  <BaseTooltip placement = "top" content="Fraction of reads in peaks (FRiP)">
                    <span v-html="fripShow(scope.row.frip)"></span></BaseTooltip>
                  <BaseTooltip placement = "top" content="Per Sequence Quality Scores: Distribution of average base mass per sequence">
                    <span v-html="sqQualityScoreShow(scope.row.sqQualityScore)"></span>
                  </BaseTooltip>
                  <BaseTooltip placement = "top" content="Per Sequence GC Content:Distribution of average GC content for each sequence">
                    <span v-html="sqQualityScoreShow(scope.row.sqGcContent)"></span>
                  </BaseTooltip>
                  <BaseTooltip placement = "top" content="Sequence Duplication Levels:Proportion of duplicate reads">
                    <span v-html="sqQualityScoreShow(scope.row.sqDuplicationLevels)"></span>
                  </BaseTooltip>
                </template>
              </el-table-column>
              <el-table-column label="Accessible chromatin region" stripe align="center" :width="195">
                <template #default="scope">
                  <!-- region -->
                  <el-link :href="regionDownloadBed(scope.row)">
                    <el-button size="mini" type="primary"> bed &nbsp;<i class="fas fa-file-download"></i></el-button>
                  </el-link>
                  <el-divider direction="vertical"></el-divider>
                  <el-link :href="regionDownloadCsv(scope.row)">
                    <el-button size="mini" type="primary"> csv &nbsp;<i class="fas fa-file-download"></i></el-button>
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column label="TF footprint" stripe align="center" :width="195">
                <template #default="scope">
                  <!-- TF footprint -->
                  <el-link :href="tfFootprintDownloadTxt(scope.row)">
                    <el-button size="mini" type="primary"> txt &nbsp;<i class="fas fa-file-download"></i></el-button>
                  </el-link>
                  <el-divider direction="vertical"></el-divider>
                  <el-link :href="tfFootprintDownloadZip(scope.row)">
                    <el-button size="mini" type="primary"> zip &nbsp;<i class="fas fa-file-download"></i></el-button>
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column label="Associated gene" stripe align="center" :width="100">
                <template #default="scope">
                  <!-- Associated gene -->
                  <el-link :href="geneDownloadBed(scope.row)">
                    <el-button size="mini" type="primary"> bed &nbsp;<i class="fas fa-file-download"></i></el-button>
                  </el-link>
                </template>
              </el-table-column>
            </template>
          </BaseTable>
          <el-divider></el-divider>
          <div class="title">
            <h3><i class="fas fa-list"></i>Download accessible chromatin region, TF footprint and associated gene for each pesudobulk ATAC-seq sample</h3>
          </div>
          <el-divider></el-divider>
          <BaseTable :table-data="listPseudoBulkMouse" :is-service-paging="false" :table-description="samplePseudoBulkHumanDescription" ref="PseudoBulkMouseLoading">
            <template #default>
              <el-table-column label="Accessible chromatin region" stripe align="center" :width="195">
                <template #default="scope">
                  <!-- region -->
                  <el-link :href="regionDownloadBed(scope.row)">
                    <el-button size="mini" type="primary"> bed &nbsp;<i class="fas fa-file-download"></i></el-button>
                  </el-link>
                  <el-divider direction="vertical"></el-divider>
                  <el-link :href="regionDownloadCsv(scope.row)">
                    <el-button size="mini" type="primary"> csv &nbsp;<i class="fas fa-file-download"></i></el-button>
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column label="Associated gene" stripe align="center" :width="100">
                <template #default="scope">
                  <!-- Associated gene -->
                  <el-link :href="geneDownloadBed(scope.row)">
                    <el-button size="mini" type="primary"> txt &nbsp;<i class="fas fa-file-download"></i></el-button>
                  </el-link>
                </template>
              </el-table-column>
            </template>
          </BaseTable>
          <div class="title">
            <h3><i class="fas fa-list"></i>Download accessible chromatin region, TF footprint and associated gene</h3>
          </div>
          <el-divider></el-divider>
          <ArrayTable :table-data="regionMouseData"/>
<!--          <el-divider></el-divider>-->
<!--          <div class="title">-->
<!--            <h3><i class="fas fa-list"></i>Package of SE, TE and eQTL</h3>-->
<!--          </div>-->
<!--          <ArrayTable :table-data="packageData"/>-->
        </template>
      </BaseTabs>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, ref } from 'vue';
import BaseTable from '@/components/table/BaseTable.vue';
import '@/assets/less/views/Download.less';
import ArrayTable from '@/components/table/ArrayTable.vue';
import {
  DOWNLOAD_MOUSE_REGION_DESCRIPTION,
  DOWNLOAD_MOUSE_SAMPLE_INFORMATION_DESCRIPTION,
  DOWNLOAD_PACKAGE_DESCRIPTION,
  DOWNLOAD_REGION_DESCRIPTION,
  DOWNLOAD_SAMPLE_DESCRIPTION, DOWNLOAD_SAMPLE_INFORMATION_DESCRIPTION,
  DOWNLOAD_SAMPLE_PSEUDOBULK_DESCRIPTION,
  STATIC_DOWNLOAD_PATH
} from '@/assets/ts';
import DownloadApi from '@/api/service/downloadApi';
import { KeyValue } from '@/service/model/data';
import BaseTabs from '@/components/tabs/BaseTabs.vue';
import { TabsBase } from '@/service/model/components/tabs';
import BaseTooltip from "@/components/tooltip/BaseTooltip.vue";

export default defineComponent({
  name: 'Download',
  components: {BaseTooltip, BaseTabs, ArrayTable, BaseTable },
  setup() {
    const BulkHumanLoading = ref();
    const BulkMouseLoading = ref();
    const PseudoBulkHumanLoading = ref();
    const PseudoBulkMouseLoading = ref();
    const data = reactive({
      sampleData: [] as Array<any>,
      listBulkHuman: [] as Array<KeyValue>,
      listBulkMouse: [] as Array<KeyValue>,
      listPseudoBulkHuman: [] as Array<KeyValue>,
      listPseudoBulkMouse: [] as Array<KeyValue>,
      annotationTabs: [
        {
          name: 'human',
          title: 'Human'
        },
        {
          name: 'mouse',
          title: 'Mouse'
        }
      ] as Array<TabsBase>
    });
    // region download
    const regionDownloadBed = (sample: any) => `${STATIC_DOWNLOAD_PATH}Accessible_chromatin_region/bed/${sample.sampleId}.bed`;
    const regionDownloadCsv = (sample: any) => `${STATIC_DOWNLOAD_PATH}Accessible_chromatin_region/csv/${sample.sampleId}.csv`;
    // TF Footprint download
    const tfFootprintDownloadTxt = (sample: any) => `${STATIC_DOWNLOAD_PATH}TF_footprint/txt/${sample.sampleId}.txt`;
    const tfFootprintDownloadZip = (sample: any) => `${STATIC_DOWNLOAD_PATH}TF_footprint/zip/${sample.sampleId}.zip`;
    // Associated gene download
    const geneDownloadBed = (sample: any) => `${STATIC_DOWNLOAD_PATH}Associated_gene/${sample.sampleId}.txt`;
    const getlistBulkHuman = () => {
      BulkHumanLoading.value.startLoading();
      DownloadApi.listBulkHumanDownload().then((res: any) => {
        BulkHumanLoading.value.endLoading();
        data.listBulkHuman = res;
      });
    };
    const getlistPseudoBulkHuman = () => {
      PseudoBulkHumanLoading.value.startLoading();
      DownloadApi.listPseudoBulkHumanDownload().then((res: any) => {
        PseudoBulkHumanLoading.value.endLoading();
        data.listPseudoBulkHuman = res;
      });
    };
    const getlistBulkMouse = () => {
      BulkMouseLoading.value.startLoading();
      DownloadApi.listBulkMouseDownload().then((res: any) => {
        BulkMouseLoading.value.endLoading();
        data.listBulkMouse = res;
        console.log(res);
      });
    };
    const getlistPseudoBulkMouse = () => {
      PseudoBulkMouseLoading.value.startLoading();
      DownloadApi.listPseudoBulkMouseDownload().then((res: any) => {
        PseudoBulkMouseLoading.value.endLoading();
        data.listPseudoBulkMouse = res;
      });
    };
    const tssEnrichmentScoreShow = (data: any, species: any) => {
      if (species.toLowerCase() === 'human') {
        if (data < 5) {
          return '<i class="fa-solid fa-circle" style="color: #cf4c4c;"></i>'; // 第一份标签
        } if (data > 7) {
          return '<i class="fa-solid fa-circle-check" style="color: #3baf48;"></i>'; // 第三份标签
        }
        return '<i class="fa-solid fa-circle-exclamation" style="color: #FFD43B;"></i>'; // 第二份标签（中间值）
      }
      if (species.toLowerCase() === 'mouse') {
        if (data < 10) {
          return '<i class="fa-solid fa-circle" style="color: #cf4c4c;"></i>'; // 第一份标签
        } if (data > 15) {
          return '<i class="fa-solid fa-circle-check" style="color: #3baf48;"></i>'; // 第三份标签
        }
        return '<i class="fa-solid fa-circle-exclamation" style="color: #FFD43B;"></i>'; // 第二份标签（中间值）
      }
    };
    const fripShow = (data: any) => {
      if (data < 0.01) {
        return '<i class="fa-solid fa-circle" style="color: #cf4c4c;"></i>'; // 第一份标签
      } if (data > 0.03) {
        return '<i class="fa-solid fa-circle-check" style="color: #3baf48;"></i>'; // 第三份标签
      }
      return '<i class="fa-solid fa-circle-exclamation" style="color: #FFD43B;"></i>'; // 第二份标签（中间值）
    };
    const sqQualityScoreShow = (data: any) => {
      // eslint-disable-next-line eqeqeq
      if (data == 1) {
        return '<i class="fa-solid fa-circle-check" style="color: #3baf48;"></i>'; // 绿色
        // eslint-disable-next-line eqeqeq
      } if (data == 0) {
        return '<i class="fa-solid fa-circle-exclamation" style="color: #FFD43B;"></i>'; // 黄色
      }
      return '<i class="fa-solid fa-circle" style="color: #cf4c4c;"></i>'; // 红色
    };
    onMounted(() => {
      getlistBulkHuman();
      getlistPseudoBulkHuman();
      getlistPseudoBulkMouse();
      getlistBulkMouse();
    });
    return {
      ...toRefs(data),
      BulkHumanLoading,
      PseudoBulkHumanLoading,
      BulkMouseLoading,
      PseudoBulkMouseLoading,
      regionDownloadBed,
      tssEnrichmentScoreShow,
      regionDownloadCsv,
      tfFootprintDownloadTxt,
      tfFootprintDownloadZip,
      geneDownloadBed,
      fripShow,
      sqQualityScoreShow,
      sampleBulkHumanDescription: DOWNLOAD_SAMPLE_DESCRIPTION,
      samplePseudoBulkHumanDescription: DOWNLOAD_SAMPLE_PSEUDOBULK_DESCRIPTION,
      regionData: DOWNLOAD_REGION_DESCRIPTION,
      regionMouseData: DOWNLOAD_MOUSE_REGION_DESCRIPTION,
      sampleData: DOWNLOAD_SAMPLE_INFORMATION_DESCRIPTION,
      sampleMouseData: DOWNLOAD_MOUSE_SAMPLE_INFORMATION_DESCRIPTION,
      packageData: DOWNLOAD_PACKAGE_DESCRIPTION
    };
  }
});
</script>
<style>
.el-button:not(.is-text) {
  background-color: #706acc;
  border: var(--el-border);
  border-color: #706acc;
}
.el-button:not(.is-text):hover {
  background-color: #b9b2e4;
  border-color: #b9b2e4;
}

#download .download .el-tabs__item.is-active {
  background-color: #706ACC;
  color: #d5d3f4;
  font-size: 25px;
  box-shadow: none;
}
#download .download .el-tabs__item {
  background-color: #eae8f4;
  color: #777;
  font-weight: bold;
  border-radius: 10px !important;
  font-size: 18px;
  margin: 0 20px;
  transition: all 0.3s ease;
  box-shadow: none;
  line-height: normal;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  text-align: center;
}
</style>

