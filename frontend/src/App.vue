<template>
  <div
      class="page-container"
      :class="step === 1 ? 'hero-block' : 'change-block'"
  >
    <div class="hero">
      <Background :step="step"/>

      <div class="container">

        <transition
            mode="out-in"
            :name="transition"
        >
          <StepName
              v-if="step === 1"
              v-model="brandName"
              @next="onNext"
          />
          <StepFont
              v-if="[2,3,4,5,6,7,8].includes(step)"
              :step="step"
              :text="brandName"
              v-model="fontParamsSelectedVariants"
              @back="onBack"
              @next="onNext"
          />
          <StepColor
              v-if="step === 9"
              v-model="colors"
              @back="onBack"
              @next="onNext"
          />
          <StepIcon
              v-if="step === 10"
              v-model="icons"
              @back="onBack"
              @next="generateLogos"
          />
          <Result
              v-if="step === 11"
              :logos="logos"
          />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>

import StepName from './components/step-name'
import Background from './components/background'
import StepFont from './components/step-font'
import StepIcon from './components/step-icon'
import StepColor from './components/step-color'
import Result from './components/result'
import { API } from './api'
import { paramVariants } from './font-params'

export default {
  name: 'App',

  components: { StepColor, StepIcon, StepFont, Background, StepName, Result },

  data: () => ({
    step: 1,
    transition: 'next',

    brandName: '',
    // Выбранные для каждого параметра значения (0 || 1 || 2)
    fontParamsSelectedVariants: {
      type: null,
      era: null,
      maturity: null,
      weight: null,
      personality: null,
      definition: null,
      concept: null
    },
    colors: [],
    icons: [],

    logos: []
  }),

  methods: {
    onNext () {
      this.transition = 'next'
      this.step++
    },
    onBack () {
      this.transition = 'prev'
      this.step--
    },

    testGenerate () {

      const payload = {
        'fontParams': {
          'type': 'serif',
          'era': 0.5,
          'maturity': 1,
          'weight': 0.5,
          'personality': 0,
          'definition': 0.5,
          'concept': 1
        },
        'brandName': 'Statystyki',
        'colors': [['#845EC2', '#333333'], ['#B0A8B9', '#FFFFEE'], ['#C34A36', '#666666']],
        'icons': ['algolia', 'air-freshener', 'angellist']
      }

      API.generateLogos(payload)
          .then(data => {
            this.logos = data
            this.step = 11
          })
    },

    generateLogos () {
      const fontParams = {}
      Object.entries(this.fontParamsSelectedVariants)
          .forEach(([param, value]) => {
            fontParams[param] = paramVariants[param][value]
          })

      const { brandName, colors, icons } = this

      API.generateLogos({ fontParams, brandName, colors, icons })
          .then(data => {
            this.logos = data
            this.step = 11
          })
    }
  }
}
</script>

<style scoped>
.prev-enter-active,
.prev-leave-active,
.next-enter-active,
.next-leave-active {
  transition: .2s ease;
}

.next-enter {
  opacity: 0;
  transform: translate(100%, 0);
}

.next-leave-to {
  opacity: 0;
  transform: translate(-100%, 0);
}

.prev-enter {
  opacity: 0;
  transform: translate(-100%, 0);
}

.prev-leave-to {
  opacity: 0;
  transform: translate(100%, 0);
}

</style>
