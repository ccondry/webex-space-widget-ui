import * as types from '../mutation-types'

const state = {
  guestToken: null
}

const mutations = {
  [types.SET_GUEST_TOKEN] (state, data) {
    state.guestToken = data
  }
}

const getters = {
  guestToken: state => state.guestToken
}

const actions = {
  async getGuestToken ({dispatch, getters}, {name, agent, request}) {
    // send websocket message to get guest token and create room
    dispatch('sendWebsocket', {
      name,
      agent,
      request
    })
  },
  setGuestToken({commit}, token) {
    // store in localStorage
    window.localStorage.setItem('guestToken', token)
    // store in state
    commit(types.SET_GUEST_TOKEN, token)
  }
}

export default {
  actions,
  state,
  getters,
  mutations
}