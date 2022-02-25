<template>
  <vue-final-modal name="feedback" classes="modal-container" content-class="vfm__content modal-content set-game-name" v-model="modals['setMyName']">
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
  </vue-final-modal>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'

import bus from '../../socket.js'

import { $vfm, VueFinalModal } from 'vue-final-modal'

export default {
  components: {
    VueFinalModal
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    myName() {
      return this.$store.getters.getMyName
    },
    modals() {
      return this.$store.getters.getModals
    }
  },
  methods: {
    hide () {
      this.$store.dispatch('hideModal', 'setMyName')
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
      bus.emit('sendAddPlayer', {gameName: this.gameName, player: myNameData})
      localStorage.setItem('myName-su', JSON.stringify(myNameData))
      this.hide()
    }
  }
}
</script>

<style lang="scss">
  .set-my-name {
    height: 120px;

    #my-name {
      display: inline-block;
      width: 30%;
      margin-right: 6px;
    }
  }
</style>
