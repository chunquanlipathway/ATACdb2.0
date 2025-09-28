<template>
  <div id="help">
    <LeftRight :leftWidth="40">
      <template #left>
        <el-affix :offset="50">
          <div class="card">
            <ul class="list-group list-group-flush">
              <li :class="item.isActive ? 'list-group-item active' : 'list-group-item'" v-for="(item, i) in helpMenus" :key="i" @click="cardClick(item)">
                <a :href="item.href" v-html="item.title"></a>
              </li>
            </ul>
          </div>
        </el-affix>
      </template>
      <template #right>
        <div :id="helpMenus[0].index">
          <SourceCard :title="helpMenus[0].title">
            <video style="display:block; margin:0 auto; width:60%;" controls autoplay>
              <source :src="vido" type="video/mp4">
            </video>
            <p><a :href="helpPage">You can download the "Help" page</a>, allowing you to save the document for offline reference.</p>
          </SourceCard>
        </div>
        <div :id="helpMenus[1].index">
          <SourceCard :title="helpMenus[1].title">
            <p>
              Chromatin accessibility, as an important structural feature for identifying gene regulatory elements,
              not only reflects the transcriptional activity of chromatin, but also reveals the binding status of
              regulatory factors to chromatin, which plays a key role in the regulation of gene expression, cell
              fate determination, and disease development and other life processes.With the wide application of
              ATAC-seq technology, human and mouse ATAC-seq data are rapidly accumulating, and a systematic collection
              and standardization of these datasets is necessary to facilitate subsequent analysis and functional annotation.
            </p>
            <p>
              Here, we developed a comprehensive human and mouse chromatin accessibility database (ATACdb2.0 <a href="http://www.licpathway.net/ATACdb/" target="_blank">http://www.licpathway.net/ATACdb/</a>),
              aiming to provide a large number of available resources on human and mouse chromatin accessibility data,
              annotated and illustrated with potential roles in a tissue/cell type-specific manner.
              To expand the cell types of bulk ATAC-seq data, we used single-cell data with existing cell type annotations from
              <a href="https://bio.liclab.net/scATAC-Ref/" target="_blank">scATAC-ref</a>
              to generate pseudo-bulk ATAC-seq data for human and mouse by aggregating data from the same cell type. The current
              version of ATACdb2.0 records a total of <span style="color: red">395,607,811</span> regions from <span style="color: red">more than 5,300</span> chromatin-accessible ATAC-seq
              samples, including <span style="color: red">4,031</span> samples from human and 1,273 samples from mouse. ATACdb2.0 provides a quality control
              process that includes six quality control (QC) metrics. In addition, ATACdb2.0 provides additional detailed genetic
              annotation information for chromatin-accessible regions, <span style="color: red">including super-enhancers, typical enhancers, common SNPs,
              risk SNPs, eQTLs, meQTLs, LD SNPs, DNA methylation sites, 3D chromatin interactions, TADs, silencer regions,CpG islands, meQTLs, histone modifications, eRNAs,
              CRISPR/Cas9 target sites, TcoFs, TFs, TRs, and conservation scores.</span> ATACdb2.0 is a powerful platform that provides the most comprehensive chromatin data,
              QC, TF footprint and various other annotations.
            </p>
          </SourceCard>
        </div>
        <br/>
        <div :id="helpMenus[2].index">
          <SourceCard :title="helpMenus[2].title">
            <p>
              The current version of ATACdb2.0 records a total of <span style="color: red">395,607,811</span> regions from <span style="color: red">more than 5,300</span> chromatin-accessible
              ATAC-seq samples, including <span style="color: red">4,031</span> samples from human and <span style="color: red">1,273</span> samples from mouse.
              ATACdb2.0 integrates manually bulk ATAC-seq samples from NCBI GEO/SRA, and generates pseudo-bulk ATAC-seq data by aggregating scATAC-seq datasets with existing
              cell type annotations from scATAC-ref, in order to expand the coverage of cell types. Identify chromatin accessible regions using a unified system environment
              and software parameters. ATACdb2.0 provides a convenient user interface for querying, browsing, analyzing and
              downloading chromatin accessible regions and their related annotation information. For more detailed statistics,
              please refer to the "Statistics" page.
            </p>
          </SourceCard>
        </div>
        <br/>
        <div :id="helpMenus[3].index">
          <SourceCard :title="helpMenus[3].title">
            <p>
              ATACdb2.0 provides the comprehensive chromatin accessibility regions about human and mouse ATAC-seq data.
              ATACdb2.0 also provides quality control report and other detailed (epi) genetic information, including super-enhancers, typical enhancers, common SNPs,
              risk SNPs, eQTLs, meQTLs, LD SNPs, DNA methylation sites, 3D chromatin interactions, TADs, silencer regions,CpG islands, meQTLs, histone modifications, eRNAs,
              CRISPR/Cas9 target sites, TcoFs, TFs, TRs, and conservation scores. Furthermore, ATACdb2.0 includes analytical tools and personalized genome browser to discover
              potential biological effects of chromatin accessible regions.
            </p>
            <BaseImage :url="help1"/>
          </SourceCard>
        </div>
        <br/>
        <div :id="helpMenus[4].index">
          <SourceCard :title="helpMenus[4].title">
          </SourceCard>
          <div :id="helpMenus[5].index">
            <SourceCard :title="helpMenus[5].title">
              <p>
                The "Browse" page is organized as an interactive table for quickly searching for samples and customizing
                filters using <span style="color: red">"Biosample Type", "Biosample Name", "Cell Type", "Tissue Type" , "Disease"</span> and <span style="color: red">"Category"</span>.
                Users can click the "Show entries" in a dropdown menu to change the number of records displayed per page.
                Users can click on "Sample ID" to view details of chromatin accessibility data for a given sample.
              </p>
              <BaseImage :url="helpBorwse"/>
            </SourceCard>
          </div>
        </div>
        <br/>
        <div :id="helpMenus[6].index">
          <SourceCard :title="helpMenus[6].title">
          </SourceCard>
          <div :id="helpMenus[7].index">
            <SourceCard :title="helpMenus[7].title" style="text-align: left">
              <p>
                Users input the <span style="color: red"> "species", "Biosample name" </span>, and <span style="color: red"> "genomic position" </span>,
                ATACdb 2.0 will identify chromatin accessible regions overlapping with the submitted region.
              </p>
              <BaseImage :url="help25"/>
              <p>
                This is the result obtained by searching for <span style="color: green"> "genome region" </span>.
              </p>
              <BaseImage :url="help26"/>
              <p>
                This is a detailed display of the accessible chromatin region <span style="color: red"> "Sample_H_0001_1"</span>.
              </p>
              <BaseImage :url="help25A"/>
              <p>This is a detailed display of the<span style="color: green"> "H1703"</span> footprint analysis result.</p>
              <BaseImage :url="help27"/>
              <!--            <p>This is a detailed display of the region associated closest genes information.</p>-->
              <!--            <BaseImage :url="help28"/>-->
              <p>This is a detailed display of the<span style="color: green"> "H1703"</span> peak annotaion visualization.</p>
              <BaseImage :url="help29"/>
            </SourceCard>
          </div>
          <div :id="helpMenus[8].index">
            <SourceCard :title="helpMenus[8].title">
              <p>
                Based on the tissue type, users select the <span style="color: red">"Biosample type" and "Tissue type"</span> of interest from human or mouse,
                and ATACdb will query chromatin accessible regions associated with the specified tissue type.
              </p>
              <BaseImage :url="help2"/>
              <p>
                This is the result obtained by searching for <span style="color: green"> "Tissue type" </span>.
              </p>
              <BaseImage :url="help3"/>
              <p>This is a detailed display of the accessible chromatin sample <span style="color: green"> "Sample_H_0036" </span>.
              </p>
              <BaseImage :url="help4"/>
              <p>
                ATACdb2.0 predicts TFBS with footprints using HINT, which is based on hidden markov models. TFs
                with the Tag Count (TC), protection score, number of binding sites and footprint logo were identified
                for each sample. TC_score has been shown to be the best strategy for ranking footprint predictions. TF
                protection score can indicate footprints of TFs with potentially short binding times. The profiles for
                each motif, which can indicate the activity of TF intuitively. <span style="color: red">We have filtered out TFs with ≤ 10
              binding sites. We have now added some ‘Threshold’ options, including ‘Protection score threshold’</span>,
                ‘TC threshold’ and ‘Number of binding sites threshold’, which allows users to set different thresholds
                to ensure TFs are high-activity and cell-type-specific. For example, we set a default threshold of the number of binding sites.
              </p>
              <BaseImage :url="help5"/>
              <p>ATACdb2.0 implemented visualization function of peak annotation. We support visualization of ATAC-seq peaks
                in different ways, including displays of peaks coverage over chromosomes and profiles of peaks binding to
                TSS region.</p>
              <BaseImage :url="help6"/>
              <p>Users can click <span style="color: green">'Sample_H_0036_2' </span>and the detail information about the region will be displayed on the next page.</p>
              <BaseImage :url="help7"/>
              <p>Overview information includes "Region ID", "Biosample name", "Tissue type", "genomic region", "region length", "Fold change", "-Log10Pvalue", "-Log10Qvalue" and Genome Browser.</p>
              <BaseImage :url="help8"/>
              <p>This is a detailed display of the <span style="color: green">'Sample_H_0036_2'</span> annotation.</p>
              <BaseImage :url="help9"/>
              <p>This is a detailed display of the <span style="color: green">'Sample_H_0036_2'</span> TF footprint analysis.</p>
              <BaseImage :url="help10"/>
              <p>This is a detailed display of the <span style="color: green">'Sample_H_0036_2'</span> target gene.</p>
              <BaseImage :url="help11"/>
              <p>ATACdb identified individual candidate binding sites or protein motifs in a total of 395,607,811 accessible
                chromatin regions in ATACdb. We found that<span style="color: red"> some motifs are short. They may not be found if users set a
              too stringent P-value of FIMO.</span> Therefore, we identified DNA-binding sequence motifs with<span style="color: red"> a P-value
                threshold of 1e−6</span>, make sure that short motifs were also well represented in our database. We further<span style="color: red"> added
                some ‘FIMO threshold’ options</span> allowing users to select different parameters.</p>
              <BaseImage :url="help12"/>
              <p>This is a detailed display of the <span style="color: green">'Sample_H_0036_2'</span> expression of associated gene.</p>
              <BaseImage :url="help13"/>
            </SourceCard>
          </div>
        </div>
        <br/>

        <div :id="helpMenus[9].index">
          <SourceCard :title="helpMenus[9].title">
            <p>
              Users can enter one or more TF names of interest from human or mouse, ATACdb 2.0 will return the basic information
              of these TFs and the number of chromatin accessibility samples they are found in. Users can further explore a specific TF
              to view the chromatin accessible regions it binds to, which are primarily identified through TF footprinting and motif scanning.
            </p>
            <BaseImage :url="help16"/>
            <p>
              This is the result obtained by searching for <span style="color: green"> "TF" </span>.
            </p>
            <BaseImage :url="help16A"/>
            <p>
              This is a detailed display of the<span style="color: green"> "EGR1"</span> overview and footprint analysis result.
            </p>
            <BaseImage :url="help17"/>
            <p>This is a detailed display of the<span style="color: green"> "EGR1"</span> motif scan analysis information</p>
            <BaseImage :url="help18"/>
            <p>This is a detailed display of the<span style="color: green"> disease </span>  information about <span style="color: green">"EGR1"</span></p>
            <BaseImage :url="help19"/>
            <p>This is a detailed display of the<span style="color: green"> "EGR1"</span> expression information</p>
            <BaseImage :url="help20"/>
          </SourceCard>
        </div>
        <div :id="helpMenus[10].index">
          <SourceCard :title="helpMenus[10].title">
            <p>
              Users can enter one or more genes of interest from human or mouse, ATACdb 2.0 will return the basic information of these genes, the number
              of chromatin accessibility samples, and the presence of each gene across different target gene identification strategies. On the results page,
              users can further select a target gene identification strategy and then click on a specific gene to view the detailed distribution of chromatin
              accessibility associated with that gene.
            </p>
            <BaseImage :url="help21"/>
            <p>
              Users submit "species type" and "gene name", ATACdb2.0 will identify
              chromatin accessible regions associated with it via relationships between the chromatin accessible regions and associated genes.
            </p>
            <BaseImage :url="help21A"/>
            <p>This is a detailed display of the chromatin accessible regions about<span style="color: green"> "AGRN"</span>.</p>
            <BaseImage :url="help22"/>
            <p>This is a detailed display of the disease information about<span style="color: green"> "AGRN"</span>.</p>
            <BaseImage :url="help23"/>
            <p>This is a detailed display of the<span style="color: green"> "AGRN"</span> expression information.</p>
            <BaseImage :url="help24"/>
          </SourceCard>
        </div>
        <br/>
        <div :id="helpMenus[11].index">
          <SourceCard :title="helpMenus[11].title">
            <p>
              Users can submit one or more SNP IDs or SNP positions of interest from human or mouse, ATACdb 2.0 will return the basic information
              of these SNPs and their presence across different chromatin accessibility samples. On the results page, users can further select a SNP
              to view detailed information about the chromatin accessible regions it binds to.
            </p>
            <BaseImage :url="help30"/>
            <p>This is the result obtained by searching for <span style="color: green">"SNP"</span> . </p>
            <BaseImage :url="help31A"/>
            <p>This is a detailed display of the <span style="color: green">"rs3824662"</span></p>
            <BaseImage :url="help31"/>
            <p>This is a detailed presentation of the linkage disequilibrium SNP results of <span style="color: green">"Sample_H_1775_12970"</span>. </p>
            <BaseImage :url="help32"/>
          </SourceCard>
        </div>
        <br/>
        <div :id="helpMenus[12].index">
          <SourceCard :title="helpMenus[12].title">
          </SourceCard>
          <div :id="helpMenus[13].index">
            <SourceCard :title="helpMenus[13].title">
              <p>
                In the <span style="color: red">'Differential-Overlapping-Region analysis'</span>, users can submit the ‘Biosample name’s of interest from human or mouse,
                ATACdb2.0 analyze differential and overlapping chromatin accessible regions between two samples.
              </p>
              <BaseImage :url="help32A"/>
              <BaseImage :url="analysisSampleResult"/>
            </SourceCard>
          </div>
        </div>
        <br/>
        <br/>
        <div :id="helpMenus[14].index">
          <SourceCard :title="helpMenus[14].title">
            <p>
              In the <span style="color: red">'Overlapping chromatin accessible regions bound by two TFs analysis'</span>, users can submit the TFs of interest from human or mouse,
              and expand the window length for the binding sites of two TFs, ATACdb 2.0 will then analyze the overlapping chromatin accessible regions bound by the two TFs.
            </p>
            <BaseImage :url="help34"/>
            <BaseImage :url="helpTFResult"/>
          </SourceCard>
        </div>
        <br/>
        <div :id="helpMenus[15].index">
          <SourceCard :title="helpMenus[15].title">
            <p>
              In the <span style="color: red">'Genomic regions enrichment analysis'</span>, users can submit genomic regions of interest from human or mouse and select
              tissue types and a P-value threshold, ATAC 2.0 will perform enrichment analysis on the submitted regions.
            </p>
            <BaseImage :url="help36"/>
            <BaseImage :url="help37"/>
          </SourceCard>
        </div>
        <br/>
        <div :id="helpMenus[16].index">
          <SourceCard :title="helpMenus[16].title">
            <p>
              In the <span style="color: red">'Gene-CAR overlapping analysis'</span>, users can submit genes of interest from human or mouse and select the tissue types,
              ATAC 2.0 will analyze the chromatin accessible regions overlapping with these genes and present the results in the form of samples.
            </p>
            <BaseImage :url="help38"/>
            <BaseImage :url="help39"/>
            <BaseImage :url="help39A"/>
          </SourceCard>
        </div>
        <br/>
        <div :id="helpMenus[17].index">
          <SourceCard :title="helpMenus[17].title">
            <p>
              To help users view proximity information of chromatin accessible regions in genomes, we developed a
              personalized genome browser using JBrowse with useful tracks.
            </p>
            <BaseImage :url="download"/>
          </SourceCard>
        </div>
        <br/>
        <div :id="helpMenus[18].index">
          <SourceCard :title="helpMenus[18].title">
            <p>
              The data of chromatin accessible sample information, chromatin accessible regions, TF footprints and Associated genes of all samples are provided
              for download in the ‘Download’ page. ATACdb supports the download of .bed format, .csv format, .zip format and .txt format.
            </p>
            <BaseImage :url="help41"/>
          </SourceCard>
        </div>
        <div :id="helpMenus[19].index">
          <SourceCard :title="helpMenus[19].title">
            <BaseImage :url="help42"/>
          </SourceCard>
        </div>
        <div :id="helpMenus[20].index">
          <SourceCard :title="helpMenus[20].title">
            <BaseImage :url="help43"/>
          </SourceCard>
        </div>
          <div :id="helpMenus[21].index">
            <SourceCard :title="helpMenus[21].title">
              <BaseImage :url="help44"/>
            </SourceCard>
        </div>
          <div :id="helpMenus[22].index">
            <SourceCard :title="helpMenus[22].title">
              <p>&nbsp;&nbsp;ATACdb 2.0 is freely available to researchers at <a href="http://www.licpathway.net/ATACdb/" target="_blank">http://www.licpathway.net/ATACdb/</a>
                without requiring registration or login.
                ATACdb 2.0 adopts a front-end and back-end decoupled architecture. The back-end is developed using Java 17.0.1
                and MySQL 8.0.32 . The front-end is built with Vue 3.2.4 , integrated with Bootstrap v5.1.3  and Element-UI (element-plus 2.2.0)  for layout and interface design,
                providing a user-friendly experience and visually appealing interface.
              </p>
              <p>
                &nbsp;&nbsp;To ensure a smooth browsing experience, users are recommended to access
                the website using modern browsers that support the HTML5 standard, such as Firefox, Google Chrome, or Microsoft Edge.
              </p>
            </SourceCard>
          </div>
        <br/>
      </template>
    </LeftRight>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import LeftRight from '@/components/layout/LeftRight.vue';
import { HELP_MENUS_NEW, STATIC_DETAIL_PATH } from '@/assets/ts';
import '@/assets/less/views/Help.less';
import SourceCard from '@/components/card/SourceCard.vue';
import BaseImage from '@/components/image/BaseImage.vue';
import { NavLeft } from '@/service/model/components/nav';

const help1 = require('@/assets/img/help/help1.png');
const vido = require('@/assets/help.mp4');
const helpBorwse = require('@/assets/img/help/helpBorwse.png');
const help2 = require('@/assets/img/help/help2.png');
const help3 = require('@/assets/img/help/help3.png');
const help4 = require('@/assets/img/help/help4.png');
const help5 = require('@/assets/img/help/help5.png');
const help6 = require('@/assets/img/help/help6.png');
const help7 = require('@/assets/img/help/help7.png');
const help8 = require('@/assets/img/help/help8.png');
const help9 = require('@/assets/img/help/help9.png');
const help10 = require('@/assets/img/help/help10.png');
const help11 = require('@/assets/img/help/help11.png');
const help12 = require('@/assets/img/help/help12.png');
const help13 = require('@/assets/img/help/help13.png');
const analysisSampleResult = require('@/assets/img/help/analysis_sample_result.png');
// const analysis_enrichment = require('@/assets/img/help/analysis_enrichment.png');
// const analysis_enrichment_result = require('@/assets/img/help/analysis_enrichment_result.png');
const helpTFResult = require('@/assets/img/help/help_tf_result.png');
const download = require('@/assets/img/help/download.png');
const help16 = require('@/assets/img/help/help16.png');
const help16A = require('@/assets/img/help/help16_1.png');
const help17 = require('@/assets/img/help/help17.png');
const help18 = require('@/assets/img/help/help18.png');
const help19 = require('@/assets/img/help/help19.png');
const help20 = require('@/assets/img/help/help20.png');
const help21 = require('@/assets/img/help/help21.png');
const help21A = require('@/assets/img/help/help21_1.png');
const help22 = require('@/assets/img/help/help22.png');
const help23 = require('@/assets/img/help/help23.png');
const help24 = require('@/assets/img/help/help24.png');
const help25 = require('@/assets/img/help/help25_1.png');
const help25A = require('@/assets/img/help/help26.png');
const help26 = require('@/assets/img/help/help25.png');
const help27 = require('@/assets/img/help/help27.png');
const help28 = require('@/assets/img/help/help28.png');
const help29 = require('@/assets/img/help/help29.png');
const help30 = require('@/assets/img/help/help30.png');
const help31 = require('@/assets/img/help/help31.png');
const help31A = require('@/assets/img/help/help31_1.png');
const help32 = require('@/assets/img/help/help32.png');
const help32A = require('@/assets/img/help/help32_1.png');
const help34 = require('@/assets/img/help/help34.png');
const help36 = require('@/assets/img/help/help36.png');
const help37 = require('@/assets/img/help/help37.png');
const help38 = require('@/assets/img/help/help38.png');
const help39 = require('@/assets/img/help/help39.png');
const help39A = require('@/assets/img/help/help39_1.png');
const help40 = require('@/assets/img/help/help40.png');
const help33 = require('@/assets/img/help/help43.png');
const help41 = require('@/assets/img/help/help41.png');
const help42 = require('@/assets/img/help/help42.png');
const help43 = require('@/assets/img/help/help43.png');
const help44 = require('@/assets/img/help/help44.png');

export default defineComponent({
  name: 'Help',
  components: { BaseImage, SourceCard, LeftRight },
  setup() {
    // 设置响应数据
    const data = reactive({
      active: '1',
      // 由子组件通过该函数设置值, 并将这个值传入到 LeftNav 组件中
      changeActive: (value: string) => {
        data.active = value;
      },
      helpMenus: HELP_MENUS_NEW
    });
    const cardClick = (value: NavLeft) => {
      data.helpMenus.forEach((item: NavLeft) => {
        item.isActive = value.title === item.title;
      });
    };
    return {
      ...toRefs(data),
      cardClick,
      // baseUrl: PROJECT_WEB_URL,
      helpBorwse,
      vido,
      help1,
      help2,
      help3,
      help4,
      help5,
      help6,
      help7,
      help8,
      help9,
      help10,
      help11,
      help12,
      help13,
      analysisSampleResult,
      helpTFResult,
      download,
      help16,
      help16A,
      help17,
      help18,
      help19,
      help20,
      help21,
      help21A,
      help22,
      help23,
      help24,
      help25,
      help25A,
      help26,
      help27,
      help28,
      help29,
      help34,
      help36,
      help30,
      help31,
      help31A,
      help32,
      help32A,
      help33,
      help37,
      help38,
      help39,
      help39A,
      help40,
      help41,
      help42,
      help43,
      help44,
      helpPage: `${STATIC_DETAIL_PATH}help.docx`
    };
  }
});
</script>
