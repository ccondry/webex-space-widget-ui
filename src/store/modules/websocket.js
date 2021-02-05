import * as types from '../mutation-types'
import {ToastProgrammatic as Toast} from 'buefy/src'

let loc = window.location
let wsAddress
if (loc.protocol === 'https:') {
  wsAddress = 'wss:'
} else {
  wsAddress = 'ws:'
}

if (process.env.NODE_ENV === 'production') {
  // production
  wsAddress += '//' + loc.host + '/api/v1'
} else {
  // dev
  wsAddress += '//localhost:4010/api/v1'
  // wsAddress = 'wss://isg.cxdemo.net/api/v1'
}

const state = {
  wsAddress,
  websocket: null,
  websocketOpen: false
}

const getters = {
  wsAddress: state => state.wsAddress,
  websocket: state => state.websocket
}

const mutations = {
  [types.SET_WEB_SOCKET_OPEN] (state, data) {
    state.websocketOpen = data
  },
  [types.SET_WEB_SOCKET] (state, data) {
    state.websocket = data
  }
}

const actions = {
  closeWebsocket ({commit}) {
    // close websocket
    commit(types.SET_WEB_SOCKET_OPEN, false)
    commit(types.SET_WEB_SOCKET, null)
  },
  sendWebsocket ({getters, dispatch}, body) {
    const json = JSON.stringify(body)
    try {
      getters.websocket.send(json)
    } catch (e) {
      console.log('error sending websocket message:', e.message)
      dispatch('closeWebsocket')
    }
  },
  connectWebsocket ({ commit, dispatch, getters }) {
    // Create a socket instance
    const socket = new window.WebSocket(getters.wsAddress)
  
    // Open the socket
    socket.onopen = function (event) {
      console.log('websocket open to', getters.wsAddress)
      // set open in state
      commit(types.SET_WEB_SOCKET_OPEN, true)
    }
  
    // Listen for messages
    socket.onmessage = function (event) {
      const json = JSON.parse(event.data)
      console.log('websocket received a message:', json)
      // dispatch message to store it in state
      // dispatch('addWsMessage', JSON.parse(event.data))
      if (json.spaceId) {
        // have user join space ID now
        dispatch('joinSpace', json.spaceId)
      }
    }
  
    // Listen for socket close
    socket.onclose = function (event) {
      console.log('websocket closed:', event)
      // mark socket closed
      commit(types.SET_WEB_SOCKET_OPEN, false)
      if (event.code === 1005) {
        // server closed connection due to expired session - don't reconnect
        // dispatch('addWsMessage', {
        //   text: 'Your chat session has ended.',
        //   type: 'system'
        // })
      } else if (event.code === 1006) {
        // web socket disconnected due to network interference or sparky-api
        // service restarting.
        // reconnect the web socket in a moment.
        setTimeout(function () {
          dispatch('connectWebsocket')
        }, 1000)
      }
    }
    commit(types.SET_WEB_SOCKET, socket)
  },
  getRooms ({dispatch, getters}) {
    dispatch('fetch', {
      message: 'get helper bot rooms',
      group: 'room',
      type: 'list',
      url: getters.endpoints.rooms,
      mutation: types.SET_ROOMS
    })
  },
  getRoomDetails ({dispatch, getters}, roomId) {
    dispatch('fetch', {
      message: 'get helper bot room details',
      group: 'room',
      type: roomId,
      url: getters.endpoints.rooms + '/' + roomId,
      mutation: types.SET_ROOM_DETAILS
    })
  },
  async joinSupportRoom ({dispatch, getters}, {id, title}) {
    const response = await dispatch('fetch', {
      message: 'join support room',
      group: 'room',
      type: 'join',
      url: getters.endpoints.rooms + '/' + id + '/join',
      options: {
        method: 'POST'
      }
    })
    if (response instanceof Error) {
      // error
      if (response.status === 409) {
        Toast.open({
          message: `You are already a member of ${title}.`,
          duration: 6 * 1000,
          type: 'is-success'
        })
      }
    } else {
      // success
      Toast.open({
        message: `You have been added to the ${title}.`,
        duration: 6 * 1000,
        type: 'is-success'
      })
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}