import {
  addUrlQueryParams,
  getUrlQueryParams
} from '../../utils'
import {ToastProgrammatic as Toast} from 'buefy/src'
import * as types from '../mutation-types'
import router from '../../router'

const state = {
  token: null,
  me: null,
  spaceId: null
}

const mutations = {
  [types.SET_TOKEN] (state, data) {
    state.token = data
  },
  [types.SET_ME] (state, data) {
    state.me = data
  },
  [types.SET_SPACE_ID] (state, data) {
    state.spaceId = data
  }
}

const getters = {
  spaceId: state => state.spaceId,
  token: state => state.token,
  isLoggedIn: (state, getters) => {
    try {
      return getters.me.emails.length > 0
    } catch (e) {
      return false
    }
  },
  me: state => state.me,
  oauthRedirectUri: () => {
    // the URL the browser should return to once SSO is done
    return `${window.location.protocol}//${window.location.host}/oauth`
  },
  oauthClientId: () => {
    // TODO get from REST API
    return 'C7a20b4c7208212f740fe24e40afa18229cb247e0881c3c455bc28605e27924c6'
  },
  oauthUrl: (state, getters) => {
    const endpoint = 'https://webexapis.com/v1/authorize'
    // TODO get these from REST API? maybe?
    const scopes = [
      'spark:kms',
      'spark:all'
    ]
    const params = {
      // TODO get client_id from REST API since it is defined there
      client_id: getters.oauthClientId,
      response_type: 'code',
      redirect_uri: getters.oauthRedirectUri,
      scope: scopes.join(' '),
      // arbitrary value for our use
      state: 'webex-login'
    }
    return addUrlQueryParams(endpoint, params)
  }
}

const actions = {
  async joinSpace ({commit}, data) {
    // Toast.open({
    //   message: 'join space ' + data,
    //   type: 'is-info',
    //   duration: 16 * 1000
    // })
    commit(types.SET_SPACE_ID, data)
  },
  async getMe ({dispatch, getters}) {
    const response = await dispatch('fetch', {
      url: 'https://webexapis.com/v1/people/me',
      group: 'webex',
      type: 'me',
      message: 'get webex user details',
      options: {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + getters.token
        }
      },
      mutation: types.SET_ME
    })
    if (response instanceof Error) {
      // error
    } else {
      // success
    }
  },
  setToken ({commit, dispatch}, token) {
    // put token JSON in state
    commit(types.SET_TOKEN, token)
    // put JWT in localStorage
    window.localStorage.setItem('token', token)
    // get user info from webex API
    dispatch('getMe')
  },
  unsetToken ({commit}) {
    // remove JWT from state
    commit(types.SET_TOKEN, null)
    // remove JWT from localStorage
    window.localStorage.removeItem('token')
  },
  logout ({dispatch}) {
    dispatch('unsetToken')
  },
  checkToken ({dispatch, getters}) {
    // check if there is a token in localstorage, and restore it to state
    const token = window.localStorage.getItem('token')
    if (token) {
      console.log('token found in localstorage:', token)
      // token is in localstorage. put token in state.
      dispatch('setToken', token)
    }
  },
  async completeOauth2 ({dispatch, getters}) {
    // get current URL query params
    const query = getUrlQueryParams()
    if (query.state === 'webex-login' && query.code) {
      // no JWT in localstorage, but has SSO login auth code. complete SSO login.
      const response = await dispatch('fetch', {
        url: getters.endpoints.oauth2,
        group: 'webex',
        type: 'oauth2',
        message: 'complete Webex OAUTH2 login',
        options: {
          method: 'POST',
          // pass our current URL query params to REST API body
          body: query
        }
      })
      if (response instanceof Error) {
        // timeout, old code, reused code, etc. Go Home.
        router.push({name: 'Home'})
      } else {
        // save the new webex token. user is now logged in.
        dispatch('setToken', response.access_token)
        // remove SSO code from the current URL query parameters
        delete query.code
        delete query.state
        // and go to agent page
        router.push({name: 'Agent', query})
      }
    } else {
      // no JWT and no SSO auth code - send user to SSO login
      window.location = getters.oauthUrl
    }
  }
}

export default {
  actions,
  state,
  getters,
  mutations
}