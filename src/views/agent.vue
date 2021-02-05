<template>
  <div>
    <panel v-if="me" v-show="!spaceId" title="Welcome">
      <p>Hello {{ me.firstName }}!</p>
      <b-field>
        <b-button
        v-show="!websocket"
        rounded
        type="is-success"
        @click="clickConnect"
        >
          Connect WebSocket
        </b-button>
        <b-button
        v-show="websocket"
        rounded
        type="is-success"
        @click="clickSendWebSocket"
        >
          Send WebSocket Message
        </b-button>
      </b-field>
      <b-field>
        <b-button
        rounded
        type="is-success"
        @click="clickStart"
        >
          Start Webex Widget
        </b-button>
      </b-field>
    </panel>

    <panel v-show="spaceId">
      <div
      id="my-webexteams-widget"
      style="width: 800px; height: 600px;"
      />
    </panel>
    <b-loading :active="isLoading" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
// import webex from 'webex'

export default {
  computed: {
    ...mapGetters([
      'me',
      'token',
      'websocket',
      'spaceId'
    ]),
    isLoading () {
      return !this.me
    }
  },

  watch: {
    me () {
      this.checkInit()
    },
    spaceId () {
      // const widgetEl = this.$refs['webex-widget']
      const widgetEl = document.getElementById('my-webexteams-widget')
      // Init a new widget
      window.webex.widget(widgetEl).spaceWidget({
        accessToken: this.token,
        destinationId: this.spaceId,
        destinationType: 'spaceId'
      })
    }
  },

  mounted () {
    // logged in but not started webex widget yet
    this.checkInit()
    // check if no token in state yet - check localstorage for it, or forward home if not
    if (!this.token) {
      this.checkToken()
    }
  },

  methods: {
    ...mapActions([
      'checkToken',
      'connectWebsocket',
      'sendWebsocket'
    ]),
    clickStart () {
      this.initWebex()
    },
    clickConnect () {
      this.connectWebsocket()
    },
    clickSendWebSocket () {
      this.sendWebsocket({token: this.token})
    },
    checkInit () {
      // is user logged in?
      if (this.me) {
        // connect the web socket now
        // this.connectWebsocket()
      }
    }
  }
}
</script>
