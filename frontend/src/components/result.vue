<template>
  <div class="row align-items-center justify-content-center">
    <div class="header mb-2 mb-md-4 text-center ">
      <p class="title"><span class="highlight">Ваши</span> логотипы:</p>
    </div>

    <div class="app row text-center mb-2 mb-md-4">
      <div
          v-for="(logo, i) in logos" :key="i"
          class="col-md-4 logo-wrapper"
      >
        <div v-html="logo"/>
        <div
            class="btn-download"
            @click="downloadSvg(logo)"
        />
      </div>
    </div>

  </div>
</template>

<script>

export default {
  props: {
    logos: Array
  },

  data: () => ({}),

  methods: {
    downloadSvg (svg) {
      const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
      const svgUrl = URL.createObjectURL(svgBlob)
      const downloadLink = document.createElement('a')
      downloadLink.href = svgUrl
      downloadLink.download = 'logo.svg'
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  },

  created () {}
}
</script>

<style>
.logo-wrapper {
  position: relative;
  padding: 5px;
}

.logo-wrapper > div:first-child {
  background: white;
  overflow: hidden;
  border-radius: 5px;
}

.logo-wrapper:hover .btn-download {
  opacity: 1;
}
</style>
