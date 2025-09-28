<template>
  <div id="genome_location">
    <LeftRight>
      <template #left>
        <GroupRadio :radio-data="hgRadioData" :event-change="radioChange" ref="radioData"/>
        <BaseBr/>
        <BaseSwitch active-text="Upload a .bed file:" inactive-text="Paste your .bed data:" :is-inline="false" :change-event="fileChange" ref="fileSwitch"/>
        <BaseInput type="textarea" :rows="10  " v-show="!isUpload" :placeholder="fileContentTip" ref="fileContent"/>
        <FileUpload :action="uploadAction" :tip-text="fileTip" :file-type="['bed']" :upload-success="uploadSuccess" :file-remove="fileRemove" :max-file-size="100" v-show="isUpload" ref="fileUpload"/>
        <BaseBr/>
        <SelectInput title="Biosample name" :select-data="biosampleNameData" ref="biosampleName"/>
        <BaseButton :content="buttonContent" :button-click="buttonClick"/>
      </template>
      <template #right>
        <div class="content">
          <span class="font_red">Function introduction:</span>
          <p>
            Users input the species, Biosample name, and genomic regions of interest or submit the bed file, ATACdb 2.0 will identify chromatin accessible
            regions overlapping with the submitted region.
          </p>
          <span class="font_red">Parameter explanation:</span>
          <p>
            1) Species: Human and mouse.
            <br/>
            2) Biosample name: Biosample name is made of cell/tissue/cell line name, treatment condition, processing time, etc.
            <br/>
            3) Genomic regions of interest or submit the bed file
          </p>
        </div>
      </template>
    </LeftRight>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import LeftRight from '@/components/layout/LeftRight.vue';
import BaseInput from '@/components/input/BaseInput.vue';
import BaseSelect from '@/components/input/BaseSelect.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import {
  ENRICHMENT_RADIO_DATA, FILE_UPLOAD_URL, getDownloadUrlHtml,
  SEARCH_BUTTON,
  SEARCH_CHROMOSOME_DATA,
  SEARCH_SPECIES_SELECT_DATA
} from '@/assets/ts';
import '@/assets/less/views/search/GenomeLocation.less';
import Base from '@/service/util/base/base';
import Message from '@/service/util/base/message';
import Jump from '@/service/util/base/jump';
import { useRouter } from 'vue-router';
import SelectInput from '@/components/input/SelectInput.vue';
import { InputSelect } from '@/service/model/components/input';
import ArrayUtil from '@/service/util/base/array';
import SearchApi from '@/api/service/searchApi';
import FileUpload from '@/components/upload/FileUpload.vue';
import BaseSwitch from '@/components/switch/BaseSwitch.vue';
import BaseBr from '@/components/divider/BaseBr.vue';
import GroupRadio from '@/components/radio/GroupRadio.vue';
import FileApi from '@/api/service/fileApi';
import Time from '@/service/util/base/time';
import LocalhostApi from '@/api/localhost/localhost';

export default defineComponent({
  name: 'GenomeLocation',
  components: {
    GroupRadio,
    BaseBr,
    BaseSwitch,
    FileUpload,
    SelectInput,
    BaseButton,
    BaseSelect,
    LeftRight,
    BaseInput
  },
  emits: ['startLoading', 'endLoading'],
  setup(props, content) {
    const router = useRouter();
    const biosampleName = ref();
    const radioData = ref();
    const fileSwitch = ref();
    const fileContent = ref();
    const fileUpload = ref();
    const setTip = (value: string) => `Please input the genomic region of ${value} version`;
    const data = reactive({
      isUpload: false,
      fileContentTip: setTip('human'),
      biosampleNameData: [] as Array<InputSelect>,
      gfsId: ''
    });
    // 请求数据
    const getBioNameAndSampleId = () => {
      content.emit('startLoading');
      // 清空
      ArrayUtil.clear(data.biosampleNameData);
      biosampleName.value.select = '';
      // 获取 Biosample Name 集合
      SearchApi.listBiosampleNameBySpecies(radioData.value.radio).then((res: any) => {
        content.emit('endLoading');
        (res as Array<string>).forEach((item: string) => {
          data.biosampleNameData.push({ label: item, value: item });
        });
      });
    };
    // 内容是输入还是上传
    const fileChange = (value: boolean) => {
      data.isUpload = value;
    };
    // 选择 Human or Mouse
    const radioChange = (value: string) => {
      data.fileContentTip = setTip(value);
      getBioNameAndSampleId();
    };
    // 文件上传成功后得到 gfsId
    const uploadSuccess = (gfsId: string) => {
      data.gfsId = gfsId;
    };
    // 文件移除(删除远程 MongoDB 中 GridFS)
    const fileRemove = () => {
      if (Base.noNull(data.gfsId)) {
        FileApi.deleteFile(data.gfsId);
        data.gfsId = '';
      }
    };
    // 加载设置信息
    const mountSet = () => {
      radioData.value.radio = ENRICHMENT_RADIO_DATA[0].label;
      data.fileContentTip = setTip(radioData.value.radio);
      fileSwitch.value.value = false;
      data.isUpload = false;
    };
    // 得到参数
    const getParams = (isFile: number) => ({
      genome: fileContent.value.input,
      speciesType: radioData.value.radio,
      fileId: data.gfsId,
      biosampleName: biosampleName.value.input,
      isFile
    });
    // 得到例子内容
    const getExampleData = () => {
      content.emit('startLoading');
      LocalhostApi.readFile('data/example.bed').then((res: any) => {
        content.emit('endLoading');
        fileContent.value.input = res;
        biosampleName.value.input = 'H1703';
      });
    };
    const buttonClick = (id: String) => {
      // 点击开始搜索, 重设, 例子
      if (id === 'start') {
        if (Base.isNull(biosampleName.value.input)) {
          Message.error('Please input biosample name');
          return;
        }
        // 文件信息
        if (fileSwitch.value.value && Base.isNull(fileUpload.value.fileList)) {
          Message.error('Please input .bed file!');
          return;
        }
        // 判断是否为输出内容
        if (data.isUpload) {
          content.emit('startLoading');
          Time.awaitPromise(data.gfsId, 1000, 5 * 60 * 1000).then(() => {
            content.emit('endLoading');
            // 跳转
            Jump.routerQuery(router, '/search_genome_total', getParams(1));
          });
        } else {
          // 上传文件
          FileApi.formatFile(fileContent.value.input).then((res: any) => {
            // 跳转
            Jump.routerQuery(router, '/search_genome_total', getParams(0));
          });
        }
      }
      if (id === 'reset') {
        fileContent.value.input = '';
        biosampleName.value.input = '';
        mountSet();
        fileUpload.value.fileList = [];
        fileUpload.value.handlerRemove();
      } else if (id === 'example') {
        if (!data.isUpload) {
          getExampleData();
        }
      }
    };
    // 得到数据
    const getData = () => {
      content.emit('startLoading');
      ArrayUtil.clear(data.biosampleNameData);
      biosampleName.value.input = '';
      // 获取 Biosample Name 集合
      SearchApi.listBiosampleName().then((res: any) => {
        data.biosampleNameData.push({ label: 'All', value: 'All' });
        (res as Array<string>).forEach((item: string) => {
          data.biosampleNameData.push({ label: item, value: item });
        });
        content.emit('endLoading');
        // biosampleName.value.input = data.biosampleNameData[1].value;
      });
    };
    onMounted(() => {
      getData();
      mountSet();
    });
    return {
      ...toRefs(data),
      biosampleName,
      radioData,
      fileSwitch,
      fileContent,
      buttonClick,
      getBioNameAndSampleId,
      fileChange,
      radioChange,
      uploadSuccess,
      fileRemove,
      chromosomeData: SEARCH_CHROMOSOME_DATA,
      speciesData: SEARCH_SPECIES_SELECT_DATA,
      buttonContent: SEARCH_BUTTON,
      hgRadioData: ENRICHMENT_RADIO_DATA,
      uploadAction: FILE_UPLOAD_URL,
      fileTip: `bed files with a size less than 100MB, ${getDownloadUrlHtml('example/enrichmentExample.bed', 'Example of Upload File')}`
    };
  }
});
</script>
