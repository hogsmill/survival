import Vue from 'vue'
import Vuex from 'vuex'

const shuffle = (array) => {
  let currentIndex = array.length, temporaryValue, randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    thisGame: 'Survival',
    connections: 0,
    showAbout: false,
    walkThrough: false,
    myName: '',
    gameName: '',
    gameState: [],
    gameStarted: false,
    gameFinished: false,
    items: [],
    score: 0,
    maxScore: 0
  },
  getters: {
    thisGame: (state) => {
      return state.thisGame
    },
    lsSuffix: (state) => {
      return 'su'
    },
    getHost: (state) => {
      return state.host
    },
    getShowAbout: (state) => {
      return state.showAbout
    },
    getWalkThrough: (state) => {
      return state.walkThrough
    },
    getMyName: (state) => {
      return state.myName
    },
    getGameName: (state) => {
      return state.gameName
    },
    getItems: (state) => {
      return state.items
    },
    getItemsRandom: (state) => {
      return shuffle(state.items)
    },
    getItemsSorted: (state) => {
      return state.items.sort((a, b) => { return a.score - b.score })
    },
    getItemsOrdered: (state) => {
      return state.items.sort((a, b) => { return a.order - b.order })
    },
    getGameState: (state) => {
      return state.gameState
    },
    getScore: (state) => {
      return state.score
    },
    getMaxScore: (state) => {
      return state.maxScore
    },
    getGameStarted: (state) => {
      return state.gameStarted
    },
    getGameFinished: (state) => {
      return state.gameFinished
    },
    getConnections: (state) => {
      return state.connections
    }
  },
  mutations: {
    updateHost: (state, payload) => {
      state.host = payload
    },
    updateShowAbout: (state, payload) => {
      state.showAbout = payload
    },
    updateWalkThrough: (state, payload) => {
      state.walkThrough = payload
    },
    setMyName: (state, payload) => {
      state.myName = payload
    },
    updateGameState: (state, payload) => {
      state.gameState = payload.gameState
    },
    updateItems: (state, payload) => {
      state.items = payload.items
      let score = 0
      for (let i = 0; i < payload.items.length; i++) {
        score = score + payload.items[i].score
      }
      state.score = score / payload.items.length
    },
    updateGameStarted: (state, payload) => {
      state.gameStarted = payload.gameStarted
    },
    updateGameFinished: (state, payload) => {
      state.gameFinisheded = payload.gameFinished
    },
    loadGame: (state, payload) => {
      state.gameState = payload.gameState
      state.items = payload.items
      state.maxScore = payload.maxScore
    },
    startGame: (state, payload) => {
      state.gameStarted = payload
    },
    endGame: (state, payload) => {
      state.gameFinished = payload
    },
    updateGameName: (state, payload) => {
      state.gameName = payload
    },
    updateConnections: (state, payload) => {
      state.connections = payload
    }
  },
  actions: {
    updateHost: ({ commit }, payload) => {
      commit('updateHost', payload)
    },
    updateShowAbout: ({ commit }, payload) => {
      commit('updateShowAbout', payload)
    },
    updateWalkThrough: ({ commit }, payload) => {
      commit('updateWalkThrough', payload)
    },
    setMyName: ({ commit }, payload) => {
      commit('setMyName', payload)
    },
    updateGameState: ({ commit }, payload) => {
      commit('updateGameState', payload)
    },
    updateItems: ({ commit }, payload) => {
      commit('updateItems', payload)
    },
    updateGameStarted: ({ commit }, payload) => {
      commit('updateGameStarted', payload)
    },
    updateGameFinished: ({ commit }, payload) => {
      commit('updateGameFinished', payload)
    },
    loadGame: ({ commit }, payload) => {
      commit('loadGame', payload)
    },
    startGame: ({ commit }, payload) => {
      commit('startGame', payload)
    },
    endGame: ({ commit }, payload) => {
      commit('endGame', payload)
    },
    updateGameName: ({ commit }, payload) => {
      commit('updateGameName', payload)
    },
    updateConnections: ({ commit }, payload) => {
      commit('updateConnections', payload)
    }
  }
})
