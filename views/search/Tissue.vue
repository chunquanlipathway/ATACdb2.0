<template>
  <div id="tissue">
    <LeftRight :leftWidth="40" ref="leftRight" class="leftRight">
      <template #left>
        <BaseSelect title="Species" placeholder="Species  eg:Human" :select-data="speciesData" :change-event="getBioNameAndSampleIdBySpecies" ref="speciesSelect"/>
        <BaseSelect title="Biosample type" :select-data="biosampleTypeData" ref="biosampleType"/>
        <SelectInput title="Tissue type" :select-data="tissueTypeData" :handle-event="getBiosampleType" ref="tissueType"/>
        <BaseButton :content="buttonContent" :button-click="buttonClick"/>
        <div class="content">
          <span class="font_red">Function introduction:</span>
          <p>
            Users select the Biosample and tissue types of interest from human or mouse, and ATACdb will query chromatin accessible regions associated with the specified tissue type.
          </p>
          <span class="font_red">Parameter explanation:</span>
          <p>
            1) Species: Human and mouse.
            <br/>
            2) Biosample type: Cell type classification of samples.
            <br/>
            <strong>The default Biosample type: Tissue.</strong>
            <br/>
            3) Tissue type: Select the tissue of interest.
          </p>
        </div>
      </template>
      <template #right>
        <Echarts :option="optionHuman" :resize-value="resizeData" ref="echartsHuman" v-show="isHuman"/>
        <Echarts :option="optionMouse" :resize-value="resizeData" ref="echartsMouse" v-show="!isHuman"/>
      </template>
    </LeftRight>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import LeftRight from '@/components/layout/LeftRight.vue';
import BaseSelect from '@/components/input/BaseSelect.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import {
  SEARCH_BIOSAMPLE_TYPE_DATA,
  SEARCH_BUTTON,
  SEARCH_SPECIES_SELECT_DATA,
  SEARCH_TISSUE_HUMAN_OPTION,
  SEARCH_TISSUE_MOUSE_OPTION
} from '@/assets/ts';
import SelectInput from '@/components/input/SelectInput.vue';
import { InputSelect } from '@/service/model/components/input';
import '@/assets/less/views/search/Tissue.less';
import Echarts from '@/components/echarts/Echarts.vue';
import ArrayUtil from '@/service/util/base/array';
import SearchApi from '@/api/service/searchApi';
import Time from '@/service/util/base/time';
import Base from '@/service/util/base/base';
import Message from '@/service/util/base/message';
import Jump from '@/service/util/base/jump';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Tissue',
  components: { Echarts, SelectInput, BaseSelect, BaseButton, LeftRight },
  emits: ['startLoading', 'endLoading'],
  setup() {
    const router = useRouter();
    const tissueType = ref();
    const biosampleType = ref();
    const leftRight = ref();
    const speciesSelect = ref();
    const echarts = ref();
    const data = reactive({
      tissueTypeData: [] as Array<InputSelect>,
      biosampleTypeData: [] as Array<InputSelect>,
      speciesData: [] as Array<InputSelect>,
      isHuman: true,
      resizeData: {
        width: 650,
        height: 700
      }
    });
    // 请求数据
    const getBiosampleType = () => {
      // 清空
      ArrayUtil.clear(data.biosampleTypeData);
      data.speciesData.push({ label: 'All', value: 'All' });
      data.speciesData.push({ label: 'Human', value: 'human' });
      data.speciesData.push({ label: 'Mouse', value: 'Mus musculus' });
      // SearchApi.listBiosampleType(tissueType.value.input).then((res: any) => {
      //   (res as Array<string>).forEach((item: string) => {
      //     data.biosampleTypeData.push({ label: item, value: item });
      //   });
      // });
    };
    const getBioNameAndSampleIdBySpecies = () => {
      const species = speciesSelect.value?.select;

      if (species) {
        // 清空数据
        ArrayUtil.clear(data.tissueTypeData);
        ArrayUtil.clear(data.biosampleTypeData);

        // 获取 Biosample Name 集合
        SearchApi.listTissueBySpecies(species).then((res: any) => {
          (res as Array<string>).forEach((item: string) => {
            data.tissueTypeData.push({ label: item, value: item });
          });
        });

        // 获取 SampleID 集合
        SearchApi.listBiosampleTypeBySpecies(species).then((res: any) => {
          (res as Array<string>).forEach((item: string) => {
            data.biosampleTypeData.push({ label: item, value: item });
          });
        });

        // 是否为 Human
        data.isHuman = species === 'human';
      }
    };
    const getData = () => {
      ArrayUtil.clear(data.tissueTypeData);
      // 获取 Biosample Name 集合
      SearchApi.listTissueType().then((res: any) => {
        (res as Array<string>).forEach((item: string) => {
          data.tissueTypeData.push({ label: item, value: item });
        });
        // tissueType.value.input = data.tissueTypeData[0].value;
        getBiosampleType();
      });
    };
    const buttonClick = (id: String) => {
      // 点击开始搜索, 重设, 例子
      if (id === 'start') {
        if (Base.isNull(tissueType.value.input)) {
          Message.error('Please input Tissue type!');
          return;
        }
        if (Base.isNull(biosampleType.value.select)) {
          Message.error('Please input Biosample type!');
          return;
        }
        Jump.routerQuery(router, '/search_tissue', {
          speciesType: speciesSelect.value.select,
          tissueType: tissueType.value.input,
          biosampleType: biosampleType.value.select
        });
      }
      if (id === 'reset') {
        speciesSelect.value.select = '';
        tissueType.value.input = '';
        biosampleType.value.select = '';
        getBiosampleType();
      } else if (id === 'example') {
        speciesSelect.value.select = 'Human';
        tissueType.value.input = 'Brain';
        getBiosampleType();
        Time.awaitData(() => {
          const filterData = data.biosampleTypeData.filter((biosampleType: InputSelect) => biosampleType.label === 'Tissue');
          biosampleType.value.select = Base.noNull(filterData) ? filterData[0].label : data.biosampleTypeData[1].label;
        }, data.biosampleTypeData);
      }
    };
    // 自适应 Echarts 大小
    const resize = () => {
      Time.sleep(100).then(() => {
        if (leftRight.value) {
          // 设置 echarts 大小
          data.resizeData = {
            width: leftRight.value.getRightLabel().offsetWidth,
            height: leftRight.value.getLeftLabel().offsetHeight + 200
          };
        }
      });
    };
    onMounted(() => {
      getData();
      speciesSelect.value.select = 'Human';
      // 自动适应大小
      window.onresize = resize;
    });
    return {
      ...toRefs(data),
      tissueType,
      biosampleType,
      leftRight,
      echarts,
      speciesSelect,
      buttonClick,
      getBiosampleType,
      resize,
      getBioNameAndSampleIdBySpecies,
      buttonContent: SEARCH_BUTTON,
      speciesData: SEARCH_SPECIES_SELECT_DATA,
      biosampleTypeData: SEARCH_BIOSAMPLE_TYPE_DATA,
      optionHuman: SEARCH_TISSUE_HUMAN_OPTION,
      optionMouse: SEARCH_TISSUE_MOUSE_OPTION
    };
  }
});
</script>
