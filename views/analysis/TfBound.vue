<template>
  <div id="tf_bound">
    <LeftRight>
      <template #left>
        <BaseSelect title="Species" placeholder="Species  eg:Human" :select-data="speciesData" ref="speciesSelect"/>
        <BaseInput title="TF 1 name" placeholder="TF name   eg:TP63" ref="tfName1"/>
        <BaseBr/>
        <BaseInput title="TF 2 name" placeholder="TF name   eg:SPIB" ref="tfName2"/>
        <BaseBr/>
        <BaseInput title="Window length" placeholder="Window length   eg:1000" type="number" ref="windowLength"/>
        <BaseBr/>
        <BaseButton :content="buttonContent" :button-click="buttonClick"/>
        <div class="content">
          <span class="font_red">Parameter explanation:</span>
          <p>
            1) Species: Human and mouse.
            <br/>
            2) TF name: TF official name.
            <br/>
            3) Window length: Extend the length of TF binding sites.
          </p>
        </div>
      </template>
      <template #right>
        <BaseImage :url="url"/>
        <div class="content">
          <span class="font_red">Function introduction:</span>
          <p>
            Users can submit the TFs of interest from human or mouse, and expand the window length for the binding sites of two TFs,
            ATACdb 2.0 will then analyze the overlapping chromatin accessible regions bound by the two TFs.
          </p>
        </div>
      </template>
    </LeftRight>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import LeftRight from '@/components/layout/LeftRight.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import BaseImage from '@/components/image/BaseImage.vue';
import '@/assets/less/views/analysis/TfBound.less';
import {ANALYSIS_BUTTON_CONTENT, SEARCH_SPECIES_SELECT_DATA} from '@/assets/ts';
import BaseInput from '@/components/input/BaseInput.vue';
import Base from '@/service/util/base/base';
import Message from '@/service/util/base/message';
import Jump from '@/service/util/base/jump';
import { useRouter } from 'vue-router';
import BaseBr from '@/components/divider/BaseBr.vue';
import BaseSelect from '@/components/input/BaseSelect.vue';

const url = require('@/assets/img/analysis/analysis_tf.png');

export default defineComponent({
  name: 'TfBound',
  components: { BaseSelect, BaseBr, BaseInput, BaseButton, BaseImage, LeftRight },
  setup() {
    const router = useRouter();
    const tfName1 = ref();
    const tfName2 = ref();
    const windowLength = ref();
    const speciesSelect = ref();
    const buttonClick = (id: string) => {
      // 点击开始搜索, 重设, 例子
      if (id === 'start') {
        if (Base.isNull(tfName1.value.input)) {
          Message.error('Please input TF name 1!');
          return;
        }
        if (Base.isNull(tfName2.value.input)) {
          Message.error('Please input TF name 1!');
          return;
        }
        if (windowLength.value.input <= 0) {
          Message.error('Please input the correct window length!');
          return;
        }
        Jump.routerQuery(router, '/analysis_tf_bound', {
          speciesType: speciesSelect.value.select,
          tfName1: tfName1.value.input,
          tfName2: tfName2.value.input,
          windowLength: windowLength.value.input
        });
      } else if (id === 'reset') {
        speciesSelect.value.select = 'Human';
        tfName1.value.input = '';
        tfName2.value.input = '';
        windowLength.value.input = '';
      } else if (id === 'example') {
        // 定义 sample ID 默认值
        speciesSelect.value.select = 'Human';
        tfName1.value.input = 'TP63';
        tfName2.value.input = 'SPIB';
        windowLength.value.input = 1000;
      }
    };
    onMounted(() => {
      speciesSelect.value.select = 'Human';
    });
    return {
      tfName1,
      tfName2,
      windowLength,
      url,
      speciesSelect,
      buttonClick,
      buttonContent: ANALYSIS_BUTTON_CONTENT,
      speciesData: SEARCH_SPECIES_SELECT_DATA
    };
  }
});
</script>
<style>
.el-button > span {
  display: inline-flex;
  align-items: center;
  color: white;
}
</style>
