<template>
  <div id="tf">
    <LeftRight>
      <template #left>
        <BaseSelect title="Species" placeholder="Species  eg:Human" :select-data="speciesData" ref="speciesSelect"/>
        <BaseInput title="TF name" type="textarea" :rows="5" placeholder="TF name  eg:EGR1" ref="tfInput"/>
        <BaseButton :content="buttonContent" :button-click="buttonClick"/>
        <div class="content">
          <span class="font_red">Function introduction:</span>
          <p>
            Users can enter one or more transcription factor (TF) names of interest from human or mouse,
            ATACdb 2.0 will return the basic information of these TFs and the number of chromatin accessibility samples they are found in.
            Users can further explore a specific TF to view the chromatin accessible regions it binds to, which are primarily identified through
            <strong>TF footprinting and motif scanning.</strong>
          </p>
        </div>
      </template>
      <template #right>
        <BaseImage :url="url"/>
      </template>
    </LeftRight>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseInput from '@/components/input/BaseInput.vue';
import '@/assets/less/views/search/Tf.less';
import LeftRight from '@/components/layout/LeftRight.vue';
import BaseImage from '@/components/image/BaseImage.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import {
  SEARCH_BUTTON,
  SEARCH_SPECIES_SELECT_DATA_ALL
} from '@/assets/ts';
import Jump from '@/service/util/base/jump';
import Base from '@/service/util/base/base';
import Message from '@/service/util/base/message';
import BaseSelect from '@/components/input/BaseSelect.vue';

const url = require('@/assets/img/search/search_TF.png');

export default defineComponent({
  name: 'Tf',
  components: { BaseSelect, BaseButton, BaseImage, LeftRight, BaseInput },
  setup() {
    const router = useRouter();
    const tfInput = ref();
    const speciesSelect = ref();
    const getParams = () => ({
      speciesType: speciesSelect.value.select,
      tfName: tfInput.value.input
    });
    const buttonClick = (id: String) => {
      if (id === 'start') {
        if (Base.isNull(tfInput.value.input)) {
          Message.error('Please input TF name!');
          return;
        }
        if (Base.isNull(speciesSelect.value.select)) {
          Message.error('Please input Species!');
          return;
        }
        console.log(tfInput.value.input);
        Jump.routerQuery(router, '/search_tf_total', getParams());
        return;
      }
      tfInput.value.input = id === 'reset' ? '' : id === 'example' ? 'EGR1\nHEY2' : '';
      speciesSelect.value.select = id === 'reset' ? '' : id === 'example' ? 'Human' : '';
    };
    return {
      tfInput,
      speciesSelect,
      buttonClick,
      getParams,
      buttonContent: SEARCH_BUTTON,
      speciesData: SEARCH_SPECIES_SELECT_DATA_ALL,
      url
    };
  }
});
</script>


