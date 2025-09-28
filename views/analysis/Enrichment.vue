<template>
  <div id="enrichment">
    <LeftRight>
      <template #left>
        <GroupRadio :radio-data="hgRadioData" :event-change="radioChange" ref="radioData"/>
        <BaseBr/>
        <!-- genomic region -->
        <BaseSwitch active-text="Upload a .bed file:" inactive-text="Paste your .bed data:" :is-inline="false" :change-event="fileChange" ref="fileSwitch"/>
        <BaseInput type="textarea" :rows="10  " v-show="!isUpload" :placeholder="fileContentTip" ref="fileContent"/>
        <FileUpload :action="uploadAction" :tip-text="fileTip" :file-type="['bed']" :upload-success="uploadSuccess" :file-remove="fileRemove" :max-file-size="100" v-show="isUpload" ref="fileUpload"/>
        <BaseBr/>
        <BaseSelect title="Tissue type: " :select-data="tissueTypeData" ref="tissueType"/>
        <BaseBr/>
        <div class="min_max_p_value">
          <BaseSelect title="P-value: " clearable :select-data="pValueSelectData" ref="pvalue"/>
        </div>
        <BaseBr/>
        <BaseButton :content="buttonContent" :button-click="buttonClick"/>
      </template>
      <template #right>
        <BaseImage :url="url"/>
        <div class="content">
          <span class="font_red">Function introduction:</span>
          <p>
            Users can submit genomic regions of interest or submit the bed file from human or mouse and select tissue types and a P-value
            threshold, ATAC 2.0 will perform enrichment analysis on the submitted regions.
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
  ANALYSIS_BUTTON_CONTENT,
  ENRICHMENT_P_SELECT_DATA,
  ENRICHMENT_RADIO_DATA,
  FILE_UPLOAD_URL,
  getDownloadUrlHtml
} from '@/assets/ts';
import GroupRadio from '@/components/radio/GroupRadio.vue';
import BaseInput from '@/components/input/BaseInput.vue';
import FileApi from '@/api/service/fileApi';
import Base from '@/service/util/base/base';
import BaseSelect from '@/components/input/BaseSelect.vue';
import '@/assets/less/views/analysis/Enrichment.less';
import BaseBr from '@/components/divider/BaseBr.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import Message from '@/service/util/base/message';
import LocalhostApi from '@/api/localhost/localhost';
import Jump from '@/service/util/base/jump';
import { useRouter } from 'vue-router';
import Time from '@/service/util/base/time';
import BaseImage from '@/components/image/BaseImage.vue';
import { InputSelect } from '@/service/model/components/input';
import ArrayUtil from '@/service/util/base/array';
import SearchApi from '@/api/service/searchApi';

const url = require('@/assets/img/analysis/analysis_enrichment.png');

export default defineComponent({
  name: 'Enrichment',
  components: {
    BaseImage,
    BaseButton,
    BaseBr,
    BaseSelect,
    BaseInput,
    GroupRadio,
    FileUpload,
    BaseSwitch,
    LeftRight
  },
  emits: ['startLoading', 'endLoading'],
  setup(props, content) {
    const router = useRouter();
    const radioData = ref();
    const fileSwitch = ref();
    const fileContent = ref();
    const fileUpload = ref();
    const tissueType = ref();
    const pvalue = ref();
    const setTip = (value: string) => `Please input the genomic region of ${value} version`;
    const data = reactive({
      tissueTypeData: [] as Array<InputSelect>,
      fileContentTip: setTip('human'),
      isUpload: false,
      gfsId: ''
    });

    const getExampleData = () => {
      content.emit('startLoading');
      LocalhostApi.readFile('data/example.bed').then((res: any) => {
        content.emit('endLoading');
        fileContent.value.input = res;
        pvalue.value.select = ENRICHMENT_P_SELECT_DATA[0].value;
        tissueType.value.select = 'Breast';
      });
    };

    const mountSet = () => {
      radioData.value.radio = ENRICHMENT_RADIO_DATA[0].label;
      data.fileContentTip = setTip(radioData.value.radio);
      fileSwitch.value.value = false;
      data.isUpload = false;
    };
    const getData = () => {
      ArrayUtil.clear(data.tissueTypeData);
      data.tissueTypeData.push({ label: 'All', value: 'All' });
      SearchApi.listTissueBySpecies(radioData.value.radio).then((res: any) => {
        (res as Array<string>).forEach((item: string) => {
          data.tissueTypeData.push({ label: item, value: item });
        });
        // tissueType.value.select = data.tissueTypeData[1].value;
      });
    };
    onMounted(() => {
      mountSet();
      getData();
    });

    const radioChange = (value: string) => {
      data.fileContentTip = setTip(value);
      getData();
    };

    const fileChange = (value: boolean) => {
      data.isUpload = value;
    };

    const uploadSuccess = (gfsId: string) => {
      data.gfsId = gfsId;
    };

    const fileRemove = () => {
      if (Base.noNull(data.gfsId)) {
        FileApi.deleteFile(data.gfsId);
        data.gfsId = '';
      }
    };

    const getParams = (isFile: number) => ({
      genome: fileContent.value.input,
      speciesType: radioData.value.radio,
      fileId: data.gfsId,
      pvalue: pvalue.value.select,
      tissueType: tissueType.value.select,
      isFile
    });
    const buttonClick = (id: string) => {

      if (id === 'start') {

        if (!fileSwitch.value.value && Base.isNull(fileContent.value.input)) {
          Message.error(data.fileContentTip);
          return;
        }

        if (fileSwitch.value.value && Base.isNull(fileUpload.value.fileList)) {
          Message.error('Please input .bed file!');
          return;
        }

        if (data.isUpload) {
          content.emit('startLoading');
          Time.awaitPromise(data.gfsId, 1000, 5 * 60 * 1000).then(() => {
            content.emit('endLoading');

            Jump.routerQuery(router, '/analysis_enrichment', getParams(1));
          });
        } else {

          FileApi.formatFile(fileContent.value.input).then((res: any) => {

            Jump.routerQuery(router, '/analysis_enrichment', getParams(0));
          });
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
    return {
      ...toRefs(data),
      radioData,
      fileSwitch,
      url,
      fileContent,
      fileUpload,
      tissueType,
      pvalue,
      radioChange,
      uploadSuccess,
      fileChange,
      fileRemove,
      buttonClick,
      uploadAction: FILE_UPLOAD_URL,
      hgRadioData: ENRICHMENT_RADIO_DATA,
      fileTip: `bed files with a size less than 100MB, ${getDownloadUrlHtml('example/enrichmentExample.bed', 'Example of Upload File')}`,
      pValueSelectData: ENRICHMENT_P_SELECT_DATA,
      buttonContent: ANALYSIS_BUTTON_CONTENT
    };
  }
});
</script>

