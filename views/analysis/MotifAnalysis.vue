<template>
  <div id="gene_score">
    <LeftRight>
      <template #left>
        <span class="title_strategy">Genes:</span>
        <BaseSwitch active-text="Upload a file:" inactive-text="Paste your data:" :is-inline="false" :change-event="fileChange" ref="fileSwitch"/>
        <BaseInput type="textarea" :rows="10" v-show="!isUpload" :placeholder="fileContentTip" ref="fileContent"/>
        <FileUpload :action="uploadAction" :tip-text="fileTip" :file-type="['txt']" :upload-success="uploadSuccess" :file-remove="fileRemove" :max-file-size="20" v-show="isUpload" ref="fileUpload"/>
        <BaseBr/>
        <BaseButton :content="buttonContent" :button-click="buttonClick"/>
      </template>
      <template #right>
        <BaseImage :url="url"/>
        <div class="content">
          <span class="font_red">Function introduction:</span>
          <p>
            Users can submit genes of interest from human or mouse and select the tissue types,
            ATAC 2.0 will analyze the chromatin accessible regions overlapping with these genes and present the results in the form of samples.
          </p>
        </div>
      </template>
    </LeftRight>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import LeftRight from '@/components/layout/LeftRight.vue';
import BaseSwitch from '@/components/switch/BaseSwitch.vue';
import FileUpload from '@/components/upload/FileUpload.vue';
import {
  ANALYSIS_BUTTON_CONTENT, ENRICHMENT_RADIO_DATA,
  FILE_UPLOAD_URL, getExampleUrlHtml,
  OUTPUT_FORMAT_RADIO_DATA
} from '@/assets/ts';
import BaseInput from '@/components/input/BaseInput.vue';
import '@/assets/less/views/analysis/GeneScore.less';
import FileApi from '@/api/service/fileApi';
import Base from '@/service/util/base/base';
import BaseBr from '@/components/divider/BaseBr.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import LocalhostApi from '@/api/localhost/localhost';
import Jump from '@/service/util/base/jump';
import { useRouter } from 'vue-router';
import Time from '@/service/util/base/time';
import { ElNotification } from 'element-plus';
import BaseImage from '@/components/image/BaseImage.vue';

const url = require('@/assets/img/analysis/Gene-CAR_overlapping_ Analysis.png');

export default defineComponent({
  name: 'GeneExplore',
  components: {
    BaseImage,
    BaseButton,
    BaseBr,
    BaseInput,
    FileUpload,
    BaseSwitch,
    LeftRight
  },
  emits: ['startLoading', 'endLoading'],
  setup(props, content) {
    const router = useRouter();
    const fileSwitch = ref();
    const fileContent = ref();
    const fileUpload = ref();
    const data = reactive({
      isUpload: false,
      fileId: '',
      fileTip: `txt files with a size less than 20MB, ${getExampleUrlHtml('data/genes.txt', 'Example of Upload File')}`
    });

    const getExampleData = () => {
      content.emit('startLoading');
      LocalhostApi.readFile('data/example.bed').then((res: any) => {
        content.emit('endLoading');
        fileContent.value.input = res;
      });
    };

    const mountSet = () => {
      fileSwitch.value.value = false;
      data.isUpload = false;
    };
    onMounted(() => {
      mountSet();
    });

    const fileChange = (value: boolean) => {
      data.isUpload = value;
    };

    const uploadSuccess = (fileId: string) => {
      data.fileId = fileId;
    };

    const fileRemove = () => {
      if (Base.noNull(data.fileId)) {
        FileApi.deleteFile(data.fileId);
        data.fileId = '';
      }
    };

    const getParams = (isFile: number) => ({
      content: fileContent.value.input,
      fileId: data.fileId,
      isFile
    });
    const buttonClick = (id: string) => {

      if (id === 'start') {

        if (!fileSwitch.value.value && Base.isNull(fileContent.value.input)) {
          ElNotification({
            title: 'Please check',
            message: 'Please input the genes!',
            type: 'error'
          });
          return;
        }

        if (fileSwitch.value.value && Base.isNull(fileUpload.value.fileList)) {
          ElNotification({
            title: 'Please check',
            message: 'Please input file!',
            type: 'error'
          });
          return;
        }

        if (data.isUpload) {
          content.emit('startLoading');
          Time.awaitPromise(data.fileId, 1000, 5 * 60 * 1000).then(() => {
            content.emit('endLoading');

            Jump.routerQuery(router, '/analysis_gene_score', getParams(1));
          });
        } else {
          Jump.routerQuery(router, '/analysis_gene_score', getParams(0));
        }
      } else if (id === 'reset') {
        mountSet();
        fileUpload.value.fileList = [];
        fileUpload.value.handlerRemove();
        fileContent.value.input = '';
      } else if (id === 'example') {
        if (!data.isUpload) {
          getExampleData();
        }
      }
    };
    // onMounted(() => {
    // });
    return {
      ...toRefs(data),
      fileSwitch,
      url,
      fileContent,
      fileUpload,
      uploadSuccess,
      fileChange,
      fileRemove,
      buttonClick,
      hgRadioData: ENRICHMENT_RADIO_DATA,
      uploadAction: FILE_UPLOAD_URL,
      strategyRadioData: OUTPUT_FORMAT_RADIO_DATA,
      buttonContent: ANALYSIS_BUTTON_CONTENT
    };
  }
});
</script>
