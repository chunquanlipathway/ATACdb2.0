<template>
  <div id="gene_score">
    <LeftRight>
      <template #left>
        <span class="title_strategy">Genes:</span>
        <GroupRadio :radio-data="hgRadioData" :event-change="radioChange" ref="radioData"/>
        <BaseSwitch active-text="Upload a file:" inactive-text="Paste your data:" :is-inline="false" :change-event="fileChange" ref="fileSwitch"/>
        <BaseInput type="textarea" :rows="10" v-show="!isUpload" :placeholder="fileContentTip" ref="fileContent"/>
        <FileUpload :action="uploadAction" :tip-text="fileTip" :file-type="['txt']" :upload-success="uploadSuccess" :file-remove="fileRemove" :max-file-size="20" v-show="isUpload" ref="fileUpload"/>
        <BaseBr/>
        <BaseSelect title="Tissue type: " :select-data="tissueTypeData" ref="tissueType"/>
        <BaseBr/>
        <BaseButton :content="buttonContent" :button-click="buttonClick"/>
      </template>
      <template #right>
        <BaseImage :url="url"/>
        <div class="content">
          <span class="font_red">Function introduction:</span>
          <p>
            Users can submit genes of interest or submit the txt file（\n Separator) from human or mouse and select the tissue types,
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
import GroupRadio from '@/components/radio/GroupRadio.vue';
import BaseSelect from '@/components/input/BaseSelect.vue';
import { InputSelect } from '@/service/model/components/input';
import ArrayUtil from '@/service/util/base/array';
import SearchApi from '@/api/service/searchApi';
import BaseImage from '@/components/image/BaseImage.vue';

const url = require('@/assets/img/analysis/Gene-CAR_overlapping_ Analysis.png');

export default defineComponent({
  name: 'GeneExplore',
  components: {
    BaseImage,
    BaseSelect,
    GroupRadio,
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
    const radioData = ref();
    const fileSwitch = ref();
    const fileContent = ref();
    const fileUpload = ref();
    const tissueType = ref();
    const setTip = (value: string) => `Please input the genomic region of ${value} version`;
    const data = reactive({
      fileContentTip: setTip('human'),
      tissueTypeData: [] as Array<InputSelect>,
      isUpload: false,
      fileId: '',
      fileTip: `txt files with a size less than 20MB, ${getExampleUrlHtml('data/genes.txt', 'Example of Upload File')}`
    });
    const getData = () => {
      ArrayUtil.clear(data.tissueTypeData);
      data.tissueTypeData.push({ label: 'All', value: 'All' });
      // 获取 tissueTypeData 集合
      SearchApi.listTissueBySpecies(radioData.value.radio).then((res: any) => {
        (res as Array<string>).forEach((item: string) => {
          data.tissueTypeData.push({ label: item, value: item });
        });
        // tissueType.value.select = data.tissueTypeData[1].value;
      });
    };
    // 选择 Human or Mouse
    const radioChange = (value: string) => {
      data.fileContentTip = setTip(value);
      getData();
    };
    // 得到例子内容
    const getExampleData = () => {
      content.emit('startLoading');
      tissueType.value.select = 'Breast';
      radioData.value.radio = ENRICHMENT_RADIO_DATA[0].label;
      LocalhostApi.readFile('data/genes.txt').then((res: any) => {
        content.emit('endLoading');
        fileContent.value.input = res;
      });
    };
    // 加载设置信息
    const mountSet = () => {
      fileSwitch.value.value = false;
      data.isUpload = false;
    };
    onMounted(() => {
      mountSet();
    });
    // 内容是输入还是上传
    const fileChange = (value: boolean) => {
      data.isUpload = value;
    };
    // 文件上传成功后得到 fileId
    const uploadSuccess = (fileId: string) => {
      data.fileId = fileId;
    };
    // 文件移除(删除远程 MongoDB 中 GridFS)
    const fileRemove = () => {
      if (Base.noNull(data.fileId)) {
        FileApi.deleteFile(data.fileId);
        data.fileId = '';
      }
    };
    // 得到参数
    const getParams = (isFile: number) => ({
      content: fileContent.value.input,
      fileId: data.fileId,
      isFile,
      speciesType: radioData.value.radio,
      tissueType: tissueType.value.select
    });
    const buttonClick = (id: string) => {
      // 点击开始搜索, 重设, 例子
      if (id === 'start') {
        // 输入信息
        if (!fileSwitch.value.value && Base.isNull(fileContent.value.input)) {
          ElNotification({
            title: 'Please check',
            message: 'Please input the genes!',
            type: 'error'
          });
          return;
        }
        // 文件信息
        if (fileSwitch.value.value && Base.isNull(fileUpload.value.fileList)) {
          ElNotification({
            title: 'Please check',
            message: 'Please input file!',
            type: 'error'
          });
          return;
        }
        // 判断是否为输出内容
        if (data.isUpload) {
          content.emit('startLoading');
          Time.awaitPromise(data.fileId, 1000, 5 * 60 * 1000).then(() => {
            content.emit('endLoading');
            // 跳转
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
    onMounted(() => {
      radioData.value.radio = ENRICHMENT_RADIO_DATA[0].label;
      data.fileContentTip = setTip(radioData.value.radio);
      getData();
    });
    return {
      ...toRefs(data),
      fileSwitch,
      url,
      getData,
      fileContent,
      radioData,
      tissueType,
      fileUpload,
      uploadSuccess,
      fileChange,
      radioChange,
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
