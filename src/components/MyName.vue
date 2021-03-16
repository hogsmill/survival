<template>
  <div class="my-name" v-if="!showAbout">
    <button class="btn btn-sm btn-secondary smaller-font" v-if="!myName" @click="show">
      Set My Name
    </button>
    <span v-if="myName" @click="show" class="rounded mr-2 mt-2 pointer p-2 bg-light">I am: {{ myName.name }}</span>

    <modal name="set-my-name" :height="120" :classes="['rounded', 'set-my-name']">
      <div class="mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>Enter Your Name</h4>
        <div class="set-my-name">
          <input type="text" id="my-name" class="form-control" :value="myName.name">
          <button class="btn btn-sm btn-secondary smaller-font" @click="saveMyName">
            Save
          </button>
        </div>
      </div>
    </modal>
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
    gameName() {
      return this.$store.getters.getGameName
    },
    myName() {
      return this.$store.getters.getMyName
    }
  },
  methods: {
    show () {
      this.$modal.show('set-my-name')
    },
    hide () {
      this.$modal.hide('set-my-name')
    },
    saveMyName: function() {
      const oldName = this.myName
      const newName = document.getElementById('my-name').value
      let myNameData
      if (!oldName.id) {
        const uuid = uuidv4()
        myNameData = {id: uuid, name: newName}
      } else {
        myNameData = {id: this.myName.id, name: newName}
      }
      this.$store.dispatch('setMyName', myNameData)
      bus.$emit('sendAddPlayer', {gameName: this.gameName, player: myNameData})
      localStorage.setItem('myName-su', JSON.stringify(myNameData))
      this.hide()
    }
  }
}
</script>

<style lang="scss">

.my-name {
  width: 120px;
  display: inline-block;
}

.set-my-name {
  height: 120px;

  #my-name {
    display: inline-block;
    width: 30%;
    margin-right: 6px;
  }
}
</style>
