<template>
  <div class="my-name" v-if="!showAbout">
    <button class="btn btn-sm btn-secondary smaller-font" v-if="!myName" @click="show">
      Set My Name
    </button>
    <span v-if="myName" @click="show" class="rounded mr-2 mt-2 pointer p-2 bg-light">I am: {{ myName.name }}</span>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'

import bus from '../socket.js'

export default {
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    myName() {
      return this.$store.getters.getMyName
    }
  },
  methods: {
    show () {
      this.$store.dispatch('showModal', 'setMyName')
    }
  }
}
</script>

<style lang="scss">
  .my-name {
    min-width: 120px;
    display: inline-block;
  }
</style>
