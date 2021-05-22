<template>
  <div class="row align-items-center justify-content-center">
    <div class="header mb-2 mb-md-4 text-center ">
      <p class="title">Выберите цветовые сочетания
      </p>
      <p class="subtitle">
        Какие цвета <span class="highlight">больше всего подходят</span> для логотипа
      </p>
    </div>

    <div class="app row text-center mb-2 mb-md-4">
      <div
          v-for="(item, i) in colors" :key="i"
          class="col-md-3"
      >
        <div
            class="app_item mb-4"
            :class="{ active: itemIndex(item) !== -1 }"
            @click="switchColorsItem(item)"
        >
          <div class="colors-item">
            <div :style="{ background: item.set[0] }"/>
            <div :style="{ background: item.set[1] }"/>
          </div>
        </div>
      </div>
    </div>

    <div class="row buttons align-items-center d-flex justify-content-center justify-content-md-between">
      <button
          class="btn btn-outline-primary"
          @click="$emit('back')"
      >Назад
      </button>
      <button
          class="btn btn-primary"
          :disabled="model.length === 0"
          @click="$emit('next')"
      >Вперед
      </button>
    </div>
  </div>
</template>

<script>

import { API } from '../api'

export default {
  props: {
    value: Array,
  },

  data: () => ({
    colors: []
  }),

  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },

  methods: {
    itemIndex(item) {
      return this.model.findIndex(x => x.set[0] === item.set[0] && x.set[1] === item.set[1])
    },

    switchColorsItem (item) {
      const itemSelectIndex = this.itemIndex(item)
      if (itemSelectIndex === -1) {
        this.model.push(item)
      } else {
        this.model.splice(itemSelectIndex, 1)
      }
    }
  },

  mounted () {
    API.getColors()
        .then(data => {
          this.colors = data
        })
  }
}
</script>

<style scoped>
.colors-item {
  border: 1px solid #ccc;
}
.colors-item div {
  height: 50px;
}

</style>
