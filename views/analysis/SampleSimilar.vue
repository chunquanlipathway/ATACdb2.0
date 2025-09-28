<template>
  <div id="sample_similar">
    <LeftRight>
      <template #left>
        <span class="sample1">Sample 1</span>
        <SelectInput title="Biosample name" :select-data="biosampleNameData" :handle-event="getSampleId1" ref="biosampleName1"/>
        <BaseSelect title="Sample ID" :select-data="sampleIdData1" ref="sampleId1"/>
        <span class="sample2">Sample 2</span>
        <SelectInput title="Biosample name" :select-data="biosampleNameData" :handle-event="getSampleId2" ref="biosampleName2"/>
        <BaseSelect title="Sample ID" :select-data="sampleIdData2" ref="sampleId2"/>
        <BaseBr/>
        <BaseButton :content="buttonContent" :button-click="buttonClick"/>
        <div class="content">
          <span class="font_red">Parameter explanation:</span>
          <p>
            1) Biosample name: Biosample name is made of cell/tissue/cell line name, treatment condition, processing time, etc.
            <br/>
            2) Sample ID: Sample ID in ATACdb2.0.
          </p>
        </div>
      </template>
      <template #right>
        <BaseImage :url="url"/>
        <div class="content">
          <span class="font_red">Function introduction:</span>
          <p>
            Users can submit the ‘Biosample name’s of interest from human or mouse, ATACdb2.0 analyze differential and overlapping chromatin accessible regions between two samples.
          </p>
        </div>
      </template>
    </LeftRight>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import LeftRight from '@/components/layout/LeftRight.vue';
import '@/assets/less/views/analysis/SampleSimilar.less';
import BaseImage from '@/components/image/BaseImage.vue';
import { ANALYSIS_BUTTON_CONTENT } from '@/assets/ts';
import BaseButton from '@/components/button/BaseButton.vue';
import Time from '@/service/util/base/time';
import SelectInput from '@/components/input/SelectInput.vue';
import BaseSelect from '@/components/input/BaseSelect.vue';
import { InputSelect } from '@/service/model/components/input';
import ArrayUtil from '@/service/util/base/array';
import SearchApi from '@/api/service/searchApi';
import Base from '@/service/util/base/base';
import Message from '@/service/util/base/message';
import Jump from '@/service/util/base/jump';
import { useRouter } from 'vue-router';
import BaseBr from '@/components/divider/BaseBr.vue';

const url = require('@/assets/img/analysis/analysis_region.png');

export default defineComponent({
  name: 'SampleSimilar',
  components: { BaseBr, BaseSelect, SelectInput, BaseButton, BaseImage, LeftRight },
  emits: ['startLoading', 'endLoading'],
  setup(props, content) {
    const router = useRouter();
    const biosampleName = ref();
    const biosampleName1 = ref();
    const sampleId1 = ref();
    const biosampleName2 = ref();
    const sampleId2 = ref();
    const data = reactive({
      biosampleNameData: [] as Array<InputSelect>,
      sampleIdData1: [] as Array<InputSelect>,
      sampleIdData2: [] as Array<InputSelect>
    });

    const getSampleId = (biosampleNameLabel: any, sampleIdLabel: any, sampleIdData: Array<InputSelect>) => {
      if (biosampleNameLabel && biosampleNameLabel.input && biosampleNameLabel.input !== '') {
        content.emit('startLoading');
        ArrayUtil.clear(sampleIdData);
        sampleIdLabel.select = '';
        SearchApi.listSampleId(biosampleNameLabel.input).then((res: any) => {
          content.emit('endLoading');
          (res as Array<string>).forEach((item: string) => {
            sampleIdData.push({ label: item, value: item });
          });
        });
      }
    };

    const getSampleId1 = () => {
      getSampleId(biosampleName1.value, sampleId1.value, data.sampleIdData1);
    };
    const getSampleId2 = () => {
      getSampleId(biosampleName2.value, sampleId2.value, data.sampleIdData2);
    };
    const getSampleIdAnalysis = () => {
      if (biosampleName1.value && biosampleName2.value) {

        if (biosampleName1.value.input === biosampleName2.value.input && biosampleName2.value.input && biosampleName2.value.input !== '') {
          content.emit('startLoading');
          ArrayUtil.clear(data.sampleIdData1);
          ArrayUtil.clear(data.sampleIdData2);
          sampleId1.value.select = '';
          sampleId2.value.select = '';
          SearchApi.listSampleId(biosampleName2.value.input).then((res: any) => {
            content.emit('endLoading');
            (res as Array<string>).forEach((item: string) => {
              data.sampleIdData1.push({ label: item, value: item });
              data.sampleIdData2.push({ label: item, value: item });
            });
          });
        } else {
          getSampleId1();
          getSampleId2();
        }
      }
    };
    const getData = () => {
      ArrayUtil.clear(data.sampleIdData1);
      ArrayUtil.clear(data.sampleIdData2);
      biosampleName1.value.input = '';
      biosampleName2.value.input = '';
      sampleId1.value.select = '';
      sampleId2.value.select = '';

      SearchApi.listBiosampleName().then((res: any) => {
        (res as Array<string>).forEach((item: string) => {
          data.biosampleNameData.push({ label: item, value: item });
        });
        getSampleIdAnalysis();
      });
    };
    onMounted(() => {
      ArrayUtil.clear(data.biosampleNameData);
      getData();
    });
    const buttonClick = (id: string) => {

      if (id === 'start') {
        if (Base.isNull(biosampleName1.value.input)) {
          Message.error('Please input Biosample Name of Sample1!');
          return;
        }
        if (Base.isNull(biosampleName2.value.input)) {
          Message.error('Please input Biosample Name of Sample2!');
          return;
        }
        if (Base.isNull(sampleId1.value.select)) {
          Message.error('Please input Sample ID of Sample1!');
          return;
        }
        if (Base.isNull(sampleId2.value.select)) {
          Message.error('Please input Sample ID of Sample2!');
          return;
        }
        Jump.routerQuery(router, '/analysis_sample', {
          biosampleName1: biosampleName1.value.input,
          biosampleName2: biosampleName2.value.input,
          sampleId1: sampleId1.value.select,
          sampleId2: sampleId2.value.select
        });
      } else if (id === 'reset') {
        getData();
      } else if (id === 'example') {
        biosampleName1.value.input = 'Kasumi-1';
        biosampleName2.value.input = 'Kasumi-1';
        getSampleIdAnalysis();

        Time.awaitData(() => {
          // sampleId1.value.select = data.sampleIdData1[0].label;
          sampleId1.value.select = 'Sample_H_3042';
        }, data.sampleIdData1);
        Time.awaitData(() => {
          // sampleId2.value.select = data.sampleIdData2[0].label;
          sampleId2.value.select = 'Sample_H_3043';
        }, data.sampleIdData2);
      }
    };
    return {
      ...toRefs(data),
      biosampleName,
      biosampleName1,
      biosampleName2,
      sampleId1,
      sampleId2,
      getSampleId1,
      getSampleId2,
      buttonClick,
      url,
      buttonContent: ANALYSIS_BUTTON_CONTENT
    };
  }
});
</script>

