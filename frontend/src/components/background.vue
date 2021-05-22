<template>
  <div class="hero-bg">
    <div v-if="step === 1">
      <svg class="circles" width="350" height="432" viewBox="0 0 350 432" fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <circle cx="120" cy="312" r="120" fill="#6870F0" fill-opacity="0.1" />
        <circle cx="301" cy="45" r="45" fill="#6870F0" fill-opacity="0.1" />
        <circle cx="322.5" cy="211.5" r="27.5" fill="#6870F0" fill-opacity="0.1" />
      </svg>
      <svg class="circle-bg" width="1827" height="1827" viewBox="0 0 1827 1827" fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <circle cx="914" cy="913" r="384.5" stroke="black" stroke-opacity="0.1" />
        <circle cx="914" cy="913" r="239.5" stroke="black" stroke-opacity="0.1" />
        <circle cx="913.5" cy="913.5" r="572" stroke="black" stroke-opacity="0.1" />
        <circle cx="913.5" cy="913.5" r="746" stroke="black" stroke-opacity="0.1" />
        <circle cx="913.5" cy="913.5" r="913" stroke="black" stroke-opacity="0.1" />
        <circle cx="914" cy="913" r="225" fill="#6870F0" fill-opacity="0.1" />
      </svg>
    </div>

    <div v-else>
      <svg class="circle-bg" width="1827" height="1827" viewBox="0 0 1827 1827" fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <circle cx="914" cy="913" r="384.5" stroke="black" stroke-opacity="0.1" />
        <circle cx="914" cy="913" r="239.5" stroke="black" stroke-opacity="0.1" />
        <circle cx="913.5" cy="913.5" r="572" stroke="black" stroke-opacity="0.1" />
        <circle cx="913.5" cy="913.5" r="746" stroke="black" stroke-opacity="0.1" />
        <circle cx="913.5" cy="913.5" r="913" stroke="black" stroke-opacity="0.1" />
      </svg>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    step: Number
  },

  data: () => ({
  }),

  methods: {
  },

  created () {}
}
</script>

<style scoped>

</style>
