<template>
  <div class="row align-items-center justify-content-center">
    <div class="header mb-2 mb-md-5 text-center">
      <p class="title">
        <span class="highlight">Шаг {{step}}:</span>
        {{ paramNames[stepParam] }}
      </p>
      <p class="subtitle"><span class="highlight">выберите</span> наиболее понравившийся шрифт</p>
    </div>

    <div class="app row text-center">
      <div
          v-for="i in [0, 1, 2]" :key="i"
          class="col-md-4"
      >
        <transition mode="out-in">
          <div
              v-if="variants[i]"
              class="app_item mb-4"
              :class="{ active: curParamValue === i }"
              @click="onVariantSelect(i)"
          >
            <div v-html="variants[i].sample"/>

            <div class="font-desc">{{ paramVariantDescriptions[stepParam][i]}}</div>
          </div>
        </transition>
      </div>
    </div>

    <div class="row buttons align-items-center d-flex justify-content-center justify-content-md-between">
      <button
          class="btn btn-outline-primary"
          @click="$emit('back');"
      >Назад
      </button>
      <button
          class="btn btn-primary"
          :disabled="curParamValue === null"
          @click="$emit('next')"
      >Вперед
      </button>
    </div>
  </div>
</template>

<script>


import { API } from '../api'
import { stepParams, paramVariants, paramNames, paramVariantDescriptions} from '../font-params'

export default {
  props: {
    step: Number,
    value: Object,
    text: String
  },
  emits: ['next', 'back'],

  data: () => ({
    stepParams,
    paramNames,
    paramVariantDescriptions,

    // { font, sample }[]
    variants: []
  }),

  computed: {
    model: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },

    stepParam() {
      return this.stepParams[this.step]
    },

    curParamValue() {
      return this.model[this.stepParam]
    }
  },

  watch: {
    step() {
      this.loadFontVariants()
    }
  },

  methods: {
    onVariantSelect(variantIdx) {
      this.model[this.stepParam] = variantIdx
      this.$emit('next')
    },

    loadFontVariants () {
      this.variants = []

      // Формируем список параметров для подбора рекомендуемого шрифта
      // Используем все параметры, заданные ДО текущего шага.
      // Для остальных параметров ставим дефолтное значение: 0.5

      const fontParams = {}
      Object.entries(stepParams).forEach(([step, param]) => {
        if (+step === this.step) {
          fontParams[param] = null
        } else {
          if (+step < this.step) {
            fontParams[param] = paramVariants[param][this.model[param]]
          } else {
            fontParams[param] = 0.5
          }
        }
      })

      const variableParam = this.stepParam
      const variableParamVariants = paramVariants[variableParam]

      const data = {
        fontParams,
        variableParam,
        variableParamVariants,
        text: this.text
      }
      API.getRecommendedFonts(data)
          .then(data => {
            this.variants = data
          })
    }
  },

  mounted () {
    this.loadFontVariants()
  }
}
</script>

<style scoped>

.v-enter-active,
.v-leave-active {
  transition: .2s ease;
}

.v-enter {
  opacity: 0;
  transform: translate(0, -5%);
}

.v-leave-to {
  opacity: 0;
  transform: translate(0, 2%);
}

</style>
