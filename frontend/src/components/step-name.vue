<template>
  <div class="row align-items-center flex-column-reverse flex-lg-row">
    <div class="left col-lg-6 col-xl-7 col-xxl-6 mb-lg-5">
      <h1 class="title">Вам нужен <span class="highlight">лого?</span></h1>
      <p class="subtitle">Попробуйте <span class="highlight">конструктор логотипов</span> для стартапов, бизнеса и
        предпринимателей
      </p>

      <div class="form flex-wrap row" action="action">
        <div class="col-auto mb-3">
          <input
              type="text"
              class="form-control"
              placeholder="Имя вашей компании"
              v-model="model"
              @keydown="nameKeydown($event)"
          />
        </div>
        <div class=" col-auto">
          <button
              type="submit"
              class="btn btn-primary"
              :disabled="!model"
              @click="$emit('next')"
          >Создать лого
          </button>
        </div>
      </div>
    </div>
    <div class="right col-md-7 col-lg-6 col-xl-5 col-xxl-6">
      <img class="hero-img" src="images/hero.png" alt="Визитки">
    </div>
  </div>
</template>

<script>

// const NAME_PATTERN = /[^A-Za-z0-9!?:"'\\[]()]/gi

export default {
  props: {
    value: String
  },
  emits: ['next'],

  data: () => ({}),

  computed: {
    model: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },

  methods: {
    nameKeydown(e) {
      // Фильтруем вводимое значение от недопустимых символов
      // if (/[^A-Z]/g.test(e.key)) {
      if (/[^A-Za-z0-9 ,.!?:;"'\\(){}[\]\-_=^&@%*$~|]/g.test(e.key)) {
        e.preventDefault();
      }
    }
  },

  created () {}
}
</script>

<style scoped>

</style>
