<template>
  <div id="gene">
    <LeftRight>
      <template #left>
        <BaseSelect title="Species" placeholder="Species  eg:Human" :select-data="speciesData" ref="speciesSelect"/>
        <BaseInput title="Gene symbol" type="textarea" :rows="5" placeholder="Gene symbol   eg:AGRN" ref="geneInput"/>
        <BaseButton :content="buttonContent" :button-click="buttonClick"/>
        <div class="content">
          <span class="font_red">Function introduction:</span>
          <p>
            Users can enter one or more genes of interest from human or mouse,
            ATACdb 2.0 will return the basic information of these genes, the number of chromatin accessibility samples,
            and the presence of each gene across different target gene identification strategies. On the results page,
            users can further select a target gene identification strategy and then click on a specific gene to view the detailed distribution of chromatin accessibility associated with that gene.
          </p>
          <span class="font_red">Parameter explanation:</span>
          <p>
            1) Species: Human and mouse.
            <br/>
            2) Gene symbol: One or more gene symbols are supported.
            <br/>
            <strong>Strategies/Algorithm</strong>
            <br/>
            &nbsp;Human: Proximal, closest, overlap, Disease Enhancer, ABC, ENdb, meQTL and eQTL
            <br/>
            &nbsp;Mouse: Proximal, closest, overlap, ENdb
            <br/>
            <strong>The default strategy: closest.</strong>
            <br/>
          </p>
        </div>
      </template>
      <template #right>
        <BaseImage :url="url"/>
      </template>
      <p>

      </p>
    </LeftRight>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import LeftRight from '@/components/layout/LeftRight.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import BaseImage from '@/components/image/BaseImage.vue';
import BaseInput from '@/components/input/BaseInput.vue';
import {
  SEARCH_BUTTON,
  SEARCH_SPECIES_SELECT_DATA_ALL
} from '@/assets/ts';
import '@/assets/less/views/search/Gene.less';
import BaseSelect from '@/components/input/BaseSelect.vue';
import Base from '@/service/util/base/base';
import Message from '@/service/util/base/message';
import Jump from '@/service/util/base/jump';
import { useRouter } from 'vue-router';

const url = require('@/assets/img/search/search_associated_gene.png');

export default defineComponent({
  name: 'Gene',
  components: { BaseSelect, BaseButton, BaseImage, LeftRight, BaseInput },
  setup() {
    const router = useRouter();
    const geneSelect = ref();
    const speciesSelect = ref();
    const geneInput = ref();
    const getParams = () => ({
      speciesType: speciesSelect.value.select,
      geneName: geneInput.value.input
    });
    const buttonClick = (id: String) => {
      // 点击开始搜索, 重设, 例子
      if (id === 'start') {
        if (Base.isNull(geneInput.value.input)) {
          Message.error('Please input Gene symbol!');
          return;
        }
        if (Base.isNull(speciesSelect.value.select)) {
          Message.error('Please input Species!');
          return;
        }
        Jump.routerQuery(router, '/search_gene_total', getParams());
      }
      if (id === 'reset') {
        speciesSelect.value.select = 'Human';
        geneInput.value.input = '';
      } else if (id === 'example') {
        speciesSelect.value.select = 'Human';
        geneInput.value.input = 'AGRN\nSPI1';
      }
    };
    return {
      geneSelect,
      geneInput,
      speciesSelect,
      buttonClick,
      speciesData: SEARCH_SPECIES_SELECT_DATA_ALL,
      buttonContent: SEARCH_BUTTON,
      url
    };
  }
});
</script>
