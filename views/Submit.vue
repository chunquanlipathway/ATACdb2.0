<template>
  <div id="submit">
    <div class="submit">
      <LeftRight :is-equal-height="true">
        <template #left>
          <div class="share">
            <span class="title">Share Your Data</span>
            <p class="content">
              If you want to share your data, please fill out the necessary information in the form below and we will add it to ATACdb soon. Thank you.
            </p>
          </div>
          <Submitter ref="submitter"/>
        </template>
        <template #right>
          <Sample ref="sample"/>
          <ATACData ref="ATACData"/>
          <BaseButton :content="buttonContent" :button-click="buttonClick"/>
        </template>
      </LeftRight>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import LeftRight from '@/components/layout/LeftRight.vue';
import '@/assets/less/views/Submit.less';
import Submitter from '@/views/submit/Submitter.vue';
import Sample from '@/views/submit/Sample.vue';
import ATACData from '@/views/submit/ATACData.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import SUBMIT_BUTTON from '@/assets/ts/submit';
import SubmitApi from '@/api/service/submitApi';
import Base from '@/service/util/base/base';
import Message from '@/service/util/base/message';

export default defineComponent({
  name: 'Submit',
  components: { BaseButton, ATACData, Sample, Submitter, LeftRight },
  setup() {
    const submitter = ref();
    const sample = ref();
    const ATACData = ref();
    const buttonClick = (id: string) => {
      if (id === 'submit') {
        if (!Base.checkEmail(submitter.value.getEmail())) {
          Message.error('The email format is incorrect. Please re-enter it!');
          return;
        }
        if (Base.isNull(sample.value.getBioSampleType())) {
          Message.error('Biosample type cannot be empty!');
          return;
        }
        if (Base.isNull(sample.value.getTissueType())) {
          Message.error('Tissue type cannot be empty!');
          return;
        }
        if (Base.isNull(sample.value.getBioSampleName())) {
          Message.error('Biosample name cannot be empty!');
          return;
        }
        if (Base.isNull(sample.value.getCancerType())) {
          Message.error('Cancer type cannot be empty!');
          return;
        }
        if (Base.isNull(ATACData.value.getDataSource())) {
          Message.error('Biosample type cannot be empty!');
          return;
        }
        SubmitApi.save({
          userName: submitter.value.getName(),
          userMail: submitter.value.getEmail(),
          description: submitter.value.getDescription(),
          biosampleType: sample.value.getBioSampleType(),
          biosampleName: sample.value.getBioSampleName(),
          tissueType: sample.value.getTissueType(),
          cancerType: sample.value.getCancerType(),
          dataSource: ATACData.value.getDataSource(),
          pubmedId: ATACData.value.getPubmedId()
        });
      } else if (id === 'reset') {
        submitter.value.setName();
        submitter.value.setEmail();
        submitter.value.setDescription();
        sample.value.setBioSampleType();
        sample.value.setBioSampleName();
        sample.value.setTissueType();
        sample.value.setCancerType();
        ATACData.value.setDataSource();
        ATACData.value.setPubmedId();
      }
    };
    return {
      submitter,
      sample,
      ATACData,
      buttonClick,
      buttonContent: SUBMIT_BUTTON
    };
  }
});
</script>

