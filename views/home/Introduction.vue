<template>
  <div id="introduce">
    <LeftRight :is-equal-height="true">
      <template #left>
        <div class="name">
          <span><span>{{ name }}</span>&nbsp;<sub>{{ version }}</sub></span>
        </div>
        <div class="simple">A comprehensive human and mouse chromatin open source platform</div>
        <div class="search">
          <CompositeSelectInput :title-select-data="titleData" :handle-event="searchEvent"/>
        </div>
        <div class="example">
          Example:
          <span v-for="(item, i) in exampleData" :key="i" @click="exampleClick(item)">
            {{ item.label }}: {{ item.value }}
          </span>
        </div>
        <div class="images">
          <BaseCarousel :carousel-img="carouselImg"/>
        </div>
      </template>
      <template #right>
        <div class="title">What is ATACdb2.0?</div>
        <div class="content">
          We have developed a comprehensive human and mouse chromatin accessibility database  (<strong>ATACdb2.0</strong> <a href="http://www.licpathway.net/ATACdb/" target="_blank">http://www.licpathway.net/ATACdb/</a>),
          aiming to provide a large number of available resources on human and mouse chromatin accessibility data, annotated and illustrated with
          potential roles in a tissue/cell type-specific manner. To further enhance the diversity of cell types represented in our dataset, we constructed pseudo-bulk ATAC-seq profiles
          by aggregating scATAC-seq data with known cell labels. The current version of ATACdb 2.0 provides<span style="color: #1070fd"> more than 395,600,000 </span>chromatin accessible regions
          (CARs) (<span style="color: #1070fd">over 7.5-fold </span>increase compared to ATACdb 1.0), derived from<span style="color: #1070fd"> more than 5,300 </span>ATAC-seq
          samples (<span style="color: #1070fd">over 3.5-fold </span>increase compared to ATACdb 1.0).
          This dataset comprises 319,968,559 CARs from 4,031 human samples and 75,639,252 CARs from 1,273 mouse samples. ATACdb2.0 provides a quality control process
          that includes six quality control (QC) metrics. In addition, ATACdb2.0 provides detailed genetic and epigenetic regulatory annotations for CARs,
          including<span style="color: #1070fd"> super-enhancers, typical enhancers, common SNPs, risk SNPs, eQTLs, meQTLs, LD SNPs, DNA methylation sites,
          3D chromatin interactions, TADs, silencer regions, CpG islands, meQTLs, histone modifications, eRNAs, CRISPR/Cas9 target sites,
          TcoFs, TFs, TRs, and conservation scores.
        </span> ATACdb2.0 is a powerful platform that provides the most comprehensive chromatin accessibility data, QC, TF footprint and various other annotations.
        </div>
      </template>
    </LeftRight>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  PROJECT_NAME,
  PROJECT_VERSION,
  HOME_CAROUSEL_IMG, HOME_TITLE_DATA, HOME_EXAMPLE_DATA
} from '@/assets/ts';
import '@/assets/less/views/home/Introduce.less';
import CompositeSelectInput from '@/components/input/CompositeSelectInput.vue';
import { useRouter } from 'vue-router';
import Jump from '@/service/util/base/jump';
import { ElNotification } from 'element-plus';
import LeftRight from '@/components/layout/LeftRight.vue';
import BaseCarousel from '@/components/carousel/BaseCarousel.vue';

export default defineComponent({
  name: 'Introduce',
  components: { BaseCarousel, LeftRight, CompositeSelectInput },
  setup() {
    const router = useRouter();
    const exampleClick = (item: any) => {
      Jump.routerBlank(router, '/type_search', { title: item.label, value: item.value });
    };

    const searchEvent = (title: string, value: string) => {
      if (value === '') {
        ElNotification({ title: 'Search', message: 'Please enter the content!', type: 'info' });
        return;
      }
      Jump.routerBlank(router, '/type_search', { title, value });
    };

    return {
      name: PROJECT_NAME,
      version: PROJECT_VERSION,
      carouselImg: HOME_CAROUSEL_IMG,
      titleData: HOME_TITLE_DATA,
      exampleData: HOME_EXAMPLE_DATA,
      searchEvent,
      exampleClick
    };
  }
});
</script>
