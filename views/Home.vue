<template>
  <div id="home">
    <Introduction/>
    <div class="line"></div>
    <BaseImage :url="url"/>
    <div class="line"></div>
    <HomeStatistics/>
    <div class="line"></div>
    <Project/>
    <br/>
    <LeftRight :is-equal-height="true" :padding="0" :leftWidth="40">
      <template #left>
        <BaseCard icon="fas fa-heart" title="Contact" class="card-shadow" style="height: 500px">
          <div class="card-contact">
            <div class="content">
              <div class="info-item">
                <i class="fas fa-user"></i>
                <p>Principal Investigator: Chunquan Li, Ph.D.</p>
              </div>
              <div class="info-item">
                <i class="fas fa-hospital"></i>
                <p>The First Affiliated Hospital, Hengyang Medical School, University of South China</p>
              </div>
              <div class="info-item">
                <i class="fas fa-envelope"></i>
                <p>Email: lcqbio@163.com</p>
              </div>
              <hr>
              <p class="welcome-message">We welcome researchers from all over the world to provide valuable advice for ATACdb2.0, and make ATACdb more and more perfect.</p>
            </div>
          </div>
        </BaseCard>
      </template>
      <template #right>
        <BaseCard icon="fas fa-globe-americas" title="Visitors" class="card-shadow" style="margin-left: 1%; height: 100%">
          <a href="https://clustrmaps.com/site/1c7e2" title="Visit tracker"><img src="//clustrmaps.com/map_v2.png?cl=ffffff&w=800&t=tt&d=gQiSTiXTQPWhCzHqCJAz2OcB4IGYoKqmAb0aNHOzmsU&co=87ccea" style="max-width: 100%; height: auto; display: block"/></a>
        </BaseCard>
      </template>
    </LeftRight>
    <br/>
    <el-divider></el-divider>
    <p>ATACdb1.0 link is <a href="http://www.licpathway.net/ATACdbv1/">http://www.licpathway.net/ATACdbv1/</a></p>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import '@/assets/less/views/Home.less';
import Introduction from '@/views/home/Introduction.vue';
import Project from '@/views/home/Project.vue';
import BaseImage from '@/components/image/BaseImage.vue';
import HomeStatistics from '@/views/home/HomeStatistics.vue';
import BaseCard from '@/components/card/BaseCard.vue';
import LeftRight from '@/components/layout/LeftRight.vue';

const index = require('@/assets/img/home/overview.png');

export default defineComponent({
  name: 'Home',
  components: {
    LeftRight,
    BaseCard,
    HomeStatistics,
    BaseImage,
    Introduction,
    Project
  },
  setup() {
    const data = reactive({
      url: index
    });
    return {
      ...toRefs(data)
    };
  }
});
</script>
