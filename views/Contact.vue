<template>
  <div id="contact">
    <div class="content">
      <h2 class="title">
        Contact
      </h2>
      <el-divider></el-divider>
      <LeftRight :leftWidth="50">
        <template #left>
          <p v-for="(contact, i) in contacts" :key="i">
            <strong v-text="contact.title"></strong>
            {{ contact.content }}
          </p>
          <el-divider></el-divider>
          <span>
            We welcome researchers from all over the world to provide valuable advice for <strong>ATACdb</strong>,
            and make <strong>ATACdb</strong> more and more perfect.
          </span>
        </template>
        <template #right>
          <BaseImage :url="img"/>
        </template>
      </LeftRight>
      <BaseBr />
      <Project/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import LeftRight from '@/components/layout/LeftRight.vue';
import { Contacts } from '@/assets/ts';
import '@/assets/less/views/Contact.less';
import BaseImage from '@/components/image/BaseImage.vue';
import BaseBr from '@/components/divider/BaseBr.vue';
import Project from '@/views/home/Project.vue';

const img = require('@/assets/img/contact/contact_map.png');

export default defineComponent({
  name: 'Contact',
  components: { Project, BaseBr, BaseImage, LeftRight },
  setup() {
    // 设置响应数据
    const data = reactive({
      contacts: Contacts
    });
    return {
      ...toRefs(data),
      img
    };
  }
});
</script>
