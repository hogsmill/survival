<template>
  <div>
    <button
      v-if="walkThrough && !showAbout"
      class="btn btn-sm btn-info"
      @click="help"
    >
      Explain this for me...
    </button>
    <modal name="walk-through" id="walk-through" :classes="['rounded']">
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
    </modal>
  </div>
</template>

<script>
import params from '../../lib/params.js'

export default {
  data() {
    return {
      step: 1,
      default: { width: 600, height: 520 },
      positions: {
        1: { }
      }
    }
  },
  computed: {
    walkThrough() {
      return this.$store.getters.getWalkThrough
    },
    showAbout() {
      return this.$store.getters.getShowAbout
    },
  },
  mounted() {
    const self = this
    if (params.isParam('walkThrough')) {
      self.$store.dispatch('updateWalkThrough', true)
      self.$modal.show('walk-through')
    }
  },
  methods: {
    setDefault() {
      const elem = document.getElementsByClassName('vm--modal')[0].getBoundingClientRect()
      this.default = {
        top: elem.top,
        left: elem.left,
        width: elem.width,
        height: elem.height
      }
    },
    show() {
      this.$modal.show('walk-through')
    },
    hide() {
      this.$modal.hide('walk-through')
    },
    help() {
      this.step = 1
      this.show()
    },
    incrementStep() {
      if (this.step == 1) {
        this.setDefault()
      }
      this.step = this.step + 1
      const elem = document.getElementsByClassName('vm--modal')[0]
      let target, positions = {}
      if (this.positions[this.step] && this.positions[this.step].target) {
        target = document.getElementById(this.positions[this.step].target)
        target = target.getBoundingClientRect()
        positions.left = target.left + 30
        positions.top = target.top + 30
      } else {
        positions = this.default
      }
      if (this.positions[this.step].width) {
        positions.width = this.positions[this.step].width
      }
      if (this.positions[this.step].height) {
        positions.height = this.positions[this.step].height
      }
      elem.style.left = positions.left + 'px'
      elem.style.top = positions.top + 'px'
      elem.style.width = positions.width + 'px'
      elem.style.height = positions.height +'px'
    }
  },
}
</script>

<style lang="scss">

  .buttons {
    padding: 6px;
  }

  #walk-through p {
    margin-left: 8px;
    margin-right: 8px;
  }

  .walkthrough-button {
    background-color: #6c757d;
    width: 150px;
    color: #fff;
    padding: .25rem .5rem;
    margin: 0 auto 12px auto;
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

</style>
