<template>
  <div id="analysis_tf_bound">
    <BaseLoading class="analysis_tf_bound" ref="loading">
      <!-- TF overview -->
      <SingleCard :title="{ icon: 'fas fa-th-list', content: 'TF overview' }">
        <LeftRight ref="overviewLeftRight">
          <template #left>
            <h3 v-show="isTF" style="text-align: center; margin-top: 20%; color: gray">No Data! </h3>
            <table class="table table-hover">
              <thead></thead>
              <tbody ref="overviewTbody"></tbody>
            </table>
          </template>
          <template #right>
            <h5 class="sample_overview_img_title">Schematic diagram</h5>
            <BaseImage :url="url"/>
          </template>
        </LeftRight>
      </SingleCard>
      <br/>
      <!-- Overlapping chromatin accessible regions bound by two TFs -->
      <SingleCard :title="{ icon: 'fas fa-list', content: 'Overlapping chromatin accessible regions bound by two TFs' }">
        <BaseTable :table-data="regionData" :is-service-paging="false" :table-description="regionDescription"/>
      </SingleCard>
      <br/>
    </BaseLoading>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import Base from '@/service/util/base/base';
import Jump from '@/service/util/base/jump';
import Message from '@/service/util/base/message';
import { useRoute, useRouter } from 'vue-router';
import LeftRight from '@/components/layout/LeftRight.vue';
import BaseImage from '@/components/image/BaseImage.vue';
import SingleCard from '@/components/card/SingleCard.vue';
import '@/assets/less/views/analysisResult/AnalysisTfBound.less';
import AnalysisApi from '@/api/service/analysisApi';
import BaseTable from '@/components/table/BaseTable.vue';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import { ANALYSIS_REGION_DESCRIPTION } from '@/assets/ts/analysisResult';
import { ElNotification } from 'element-plus';

const url = require('@/assets/img/analysis/analysis_tf.png');

export default defineComponent({
  name: 'AnalysisTfBound',
  components: { BaseLoading, BaseTable, SingleCard, BaseImage, LeftRight },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const loading = ref();
    const overviewTbody = ref();
    // 创建 table 下的 tr td
    const addTh = (content: string) => `<th>${content}</th>`;
    const addTd = (content: string) => `<td>${content}</td>`;
    const addTr = (content: string) => `<tr>${content}</tr>`;
    const trAddThTd = (thTds: Array<any> = []) => {
      let thString = '';
      const { length } = thTds;
      for (let i = 0; i < length; i++) {
        thString += i === 0 ? addTh(thTds[i]) : addTd(thTds[i]);
      }
      return addTr(thString);
    };
    // 响应式数据
    const data = reactive({
      regionData: [] as Array<any>,
      isTF: false
    });
    // 获取数据
    const getTfBoundByTfNameAndLength = () => {
      loading.value.loading = true;
      AnalysisApi.tfBoundByTfNameAndLength(String(route.query.speciesType), String(route.query.tfName1), String(route.query.tfName2), String(route.query.windowLength)).then((res: any) => {
        loading.value.loading = false;
        const { tfInformation1, tfInformation2, tfBoundInfoList } = res;
        if (tfInformation1 === null) {
          data.isTF = true;
        }
        // 添加 Sample overview
        let tbodyHtml = trAddThTd(['TF information:', 'TF 1', 'TF 2']);
        tbodyHtml += trAddThTd(['TF name:', tfInformation1.tfName, tfInformation2.tfName]);
        tbodyHtml += trAddThTd(['TF family:', tfInformation1.tfFamily, tfInformation2.tfFamily]);
        tbodyHtml += trAddThTd(['TF ensembl ID:', tfInformation1.ensemblId, tfInformation2.ensemblId]);
        tbodyHtml += trAddThTd(['TF entrez ID:', tfInformation1.tfEntrezId, tfInformation2.tfEntrezId]);
        overviewTbody.value.innerHTML = tbodyHtml;
        // 表格数据
        console.log(tfBoundInfoList);
        data.regionData = tfBoundInfoList;
      });
    };
    onMounted(() => {
      ElNotification({
        title: 'Wishing you a pleasant browsing experience!',
        message: 'Due to the large volume of data, the results may take some time to load. Thank you for your patience!',
        type: 'success'
      });
      if (Base.isNull(route.query.tfName1) || Base.isNull(route.query.tfName2) || Base.isNull(route.query.windowLength)) {
        Jump.routerDefault(router, '/');
        Message.warning(`${route.fullPath}: The path is not feasible!`);
      }
      getTfBoundByTfNameAndLength();
    });
    return {
      ...toRefs(data),
      loading,
      overviewTbody,
      url,
      regionDescription: ANALYSIS_REGION_DESCRIPTION
    };
  }
});
</script>
