<template>
  <div id="common_snp">
    <LeftRight>
      <template #left>
        <BaseSelect title="Species" placeholder="Species  eg:Human" :select-data="speciesData" :change-event="getSampleId" ref="speciesSelect"/>
<!--        <div class="commonsnp_select_input_template">-->
          <BaseSelect title="Type" :select-data="titeleData" ref="titleSelect"/>
<!--          <BaseInput placeholder="eg:SNP ID: rs12364930 or SNP Locus: 93474513" ref="snpInput"/>-->
          <BaseInput title="Please input your data" type="textarea" :rows="5" placeholder="eg:SNP ID: rs3824662 or SNP Locus: chr10:8062245" ref="snpInput"/>
<!--        </div>-->
        <BaseButton :content="buttonContent" :button-click="buttonClick"/>
      </template>
      <template #right>
        <div class="content">
          <span class="font_red">Function introduction:</span>
          <p>
            Users can submit one or more SNP IDs or SNP positions of interest from human or mouse,
            ATACdb 2.0 will return the basic information of these SNPs and their presence across different chromatin accessibility samples.
            On the results page, users can further select a SNP to view detailed information about the chromatin accessible regions it binds to.
          </p>
          <span class="font_red">Parameter explanation:</span>
          <p>
            1) Species: Human and mouse.
            <br/>
            2) Type: SNP ID or SNP position (human Common SNP and mouse SNP of dbSNP ).
            <br/>
            3) Data: One or more SNP IDs or SNP positions can be entered.
            <br/>
            <strong>The default strategy: rs3824662.</strong>
          </p>
        </div>
      </template>
    </LeftRight>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import '@/assets/less/views/search/CommonSnp.less';
import LeftRight from '@/components/layout/LeftRight.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import BaseInput from '@/components/input/BaseInput.vue';
import { SEARCH_BUTTON, SEARCH_SNP_SELECT_DATA, SEARCH_SPECIES_SELECT_DATA } from '@/assets/ts';
import Base from '@/service/util/base/base';
import Message from '@/service/util/base/message';
import Jump from '@/service/util/base/jump';
import BaseSelect from '@/components/input/BaseSelect.vue';
import { InputSelect } from '@/service/model/components/input';

export default defineComponent({
  name: 'CommonSnp',
  components: { BaseSelect, BaseInput, BaseButton, LeftRight },
  emits: ['startLoading', 'endLoading'],
  setup() {
    const router = useRouter();
    const snpInput = ref();
    const speciesSelect = ref();
    const titleSelect = ref();
    const data = reactive({
      sampleIdData: [] as Array<InputSelect>
    });
    const buttonClick = (id: String) => {
      // 点击开始搜索, 重设, 例子
      if (id === 'start') {
        if (Base.isNull(snpInput.value.input)) {
          Message.error('Please input SNP ID!');
          return;
        }
        if (Base.isNull(speciesSelect.value.select)) {
          Message.error('Please select species!');
          return;
        }
        if (Base.isNull(titleSelect.value.select)) {
          Message.error('Please select SNP type!');
          return;
        }
        Jump.routerQuery(router, '/search_common_snp_total', {
          speciesType: speciesSelect.value.select,
          titeleType: titleSelect.value.select,
          snpIdList: snpInput.value.input
        });
      }
      if (id === 'reset') {
        snpInput.value.input = '';
        speciesSelect.value.select = SEARCH_SPECIES_SELECT_DATA[0].value;
        titleSelect.value.select = SEARCH_SNP_SELECT_DATA[0].value;
      } else if (id === 'example') {
        snpInput.value.input = 'rs3824662';
        speciesSelect.value.select = SEARCH_SPECIES_SELECT_DATA[0].value;
        titleSelect.value.select = SEARCH_SNP_SELECT_DATA[0].value;
      }
    };
    const isEmpty = () => {
      if (Base.isNull(titleSelect.value.select)) {
        titleSelect.value.select = SEARCH_SNP_SELECT_DATA[0].value;
        speciesSelect.value.select = SEARCH_SPECIES_SELECT_DATA[0].value;
      }
    };
    onMounted(() => {
      isEmpty();
      // listSampleIds();
    });
    return {
      ...toRefs(data),
      snpInput,
      titleSelect,
      speciesSelect,
      buttonClick,
      isEmpty,
      titeleData: SEARCH_SNP_SELECT_DATA,
      speciesData: SEARCH_SPECIES_SELECT_DATA,
      buttonContent: SEARCH_BUTTON
    };
  }
});
</script>
