<template>
  <vue-final-modal name="walk-through" classes="modal-container" content-class="vfm__content modal-content walk-through" v-model="modals['walkThrough']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4" v-if="step == 1">
      <h4>Welcome to Survival at Sea</h4>
      <div>
        <p>
          The classic "lost at sea" survival game - what will you keep, and what
          will you throw away? A great exercise on ruthless prioritisation...
        </p>
        <p>
          Any number of players can play this game, each on their own browser/machine;
          the game updates in real time so you can play when team members are remote
          or WFH.
        </p>
        <Facilitation />
      </div>
    </div>
    <div class="mt-4" v-if="step == 2">
      <h4>Welcome to Survival at Sea</h4>
      <div>
        <p>
          To play the game, each player simply needs to set the same gane name, then
          enter their name to create them as a player.
        </p>
        <p>
          Once all players have read the instructions and understand them, start the
          game and make your choices...
        </p>
        <p>
          Enjoy!
        </p>
      </div>
    </div>
    <div class="buttons" v-if="step < 2">
      <button class="btn btn-info" @click="incrementStep">
        Next
      </button>
      <button class="btn btn-info" @click="hide()">
        Skip
      </button>
    </div>
    <div class="buttons" v-if="step == 2">
      <button class="btn btn-info" @click="hide()">
        Play Game
      </button>
    </div>
  </vue-final-modal>
</template>

<script>
import { VueFinalModal } from 'vue-final-modal'

import params from '../../lib/params.js'

export default {
  components: {
    VueFinalModal
  },
  data() {
    return {
      step: 1
    }
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    thisGame() {
      return this.$store.getters.thisGame
    },
    walkThrough() {
      return this.$store.getters.getWalkThrough
    },
    showAbout() {
      return this.$store.getters.getShowAbout
    }
  },
  mounted() {
    const self = this
    if (params.isParam('walkThrough')) {
      self.$store.dispatch('showModal', 'walkThrough')
    }
  },
  methods: {
    skip() {
      this.hide()
    },
    hide() {
      this.$store.dispatch('hideModal', 'walkThrough')
    },
    incrementStep() {
      this.step = this.step + 1
    }
  }
}
</script>

<style lang="scss">
  .buttons {
    padding: 6px;
    position: absolute;
    bottom: 20px;
    width: 100%;
  }

  .walk-through {
    height: 480px;
    p {
      text-align: left;
      margin: 0 24px 12px 24px;

      &.center {
        text-align: center;
      }
    }
    ul {
      margin-bottom: 12px;

      li {
        margin: 6px 24px 12px 36px;
        text-align: left;
      }
    }

    .game {
      background-repeat: no-repeat;
      background-size: contain;
      background-position-x: center;
      width: 500px;
      height: 100px;
      margin: 0 auto;
      border: 1px solid #ccc;
      margin-bottom: 12px;

      &.setup {
        background-image: url("../../assets/img/setup.jpg");
      }
      &.place-boat {
        background-image: url("../../assets/img/place.jpg");
      }
    }
  }
</style>
