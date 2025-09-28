<template>
  <div id="submitter">
    <h3>Submitter Information</h3>
    <BaseInput title="Your Name" placeholder="Non-essential option" ref="name"/>
    <BaseInput title="E-mail" placeholder="It is necessary" ref="email"/>
    <BaseInput title="Other description" placeholder="Non-essential option" ref="description"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import BaseInput from '@/components/input/BaseInput.vue';
import '@/assets/less/views/submit/Submitter.less';

export default defineComponent({
  name: 'Submitter',
  components: { BaseInput },
  setup() {
    const name = ref();
    const email = ref();
    const description = ref();
    const setName = (value = '') => {
      name.value.input = value;
    };
    const setEmail = (value = '') => {
      email.value.input = value;
    };
    const setDescription = (value = '') => {
      description.value.input = value;
    };
    return {
      name,
      email,
      description,
      setName,
      setEmail,
      setDescription,
      getName: () => name.value.input,
      getEmail: () => email.value.input,
      getDescription: () => description.value.input
    };
  }
});
</script>
