<template>
  <div class="row align-items-center justify-content-center">
    <div class="header mb-2 mb-md-4 text-center ">
      <p class="title"><span class="highlight">Шаг 10:</span> выберите иконки
      </p>
      <p class="subtitle"><span class="highlight">выберите</span> 3 понравившихся иконки</p>
      <input
          type="text"
          class="search-input form-control mb-2 mb-md-4"
          placeholder="Воспользуйтесь поиском по иконкам:"
          v-model="searchString"
      />
    </div>

    <div
        class="icons-container"
        :class="{ limited: model.length === 3 }"
    >
      <div
          v-for="(icon, i) in filteredIcons" :key="i"
          class="icon-wrapper"
          :class="{ active: iconSelectIndex(icon) !== -1 }"
          v-html="icon.svg"
          @click="switchIconSelect(icon)"
      />
    </div>

    <div class="row buttons align-items-center d-flex justify-content-center justify-content-md-between">
      <button
          class="btn btn-outline-primary"
          @click="$emit('back')"
      >Назад
      </button>
      <button
          class="btn btn-primary"
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
    value: Array
  },
  emits: ['next', 'back'],

  data: () => ({
    icons: [],
    searchString: ''
  }),

  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },

    filteredIcons() {
      if (this.searchString === '') {
        return this.icons
      } else {
        const search = this.searchString.toLowerCase()
        return this.icons
            .filter(({ name }) => name.toLowerCase().includes(search))
      }
    }
  },

  methods: {
    iconSelectIndex(icon) {
      return this.model.findIndex(iconName => iconName === icon.name)
    },

    switchIconSelect (icon) {
      const iconSelectIndex = this.iconSelectIndex(icon)
      if (iconSelectIndex === -1) {
        if (this.model.length < 3) {
          this.model.push(icon.name)
        }
      } else {
        this.model.splice(iconSelectIndex, 1)
      }
    }
  },

  mounted() {
    API.getIcons()
    .then(data => {
      this.icons = data
    })
  }
}
</script>

<style>
  .icons-container {
    display: flex;
    -ms-flex-flow: wrap;
    flex-flow: wrap;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;

    margin: 20px 0 30px;
  }

  .icon-wrapper {
    width: 100px;
    height: 100px;
    margin: 5px;
    background: #fff;
    border-radius: 50%;
    flex-shrink: 0;
    cursor: pointer;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;

    box-sizing: border-box;
  }

  .icon-wrapper:hover {
    border: 2px solid var(--primary);
  }

  .icon-wrapper.active {
    border: 2px solid var(--primary);
  }

  .icon-wrapper svg {
    max-width: 60px;
    max-height: 60px;
  }

  .icon-wrapper.active svg {
    fill: var(--primary);
  }

  .icons-container.limited .icon-wrapper:not(.active) {
    cursor: default;
  }
  .icons-container.limited .icon-wrapper:not(.active):hover {
    border: none;
  }
</style>
