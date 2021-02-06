<template>
  <div>
    <!-- <pre>{{ qrUrl }}</pre> -->
    <!-- <pre>{{ websocket ? 'yes' : 'no'}}</pre> -->
    <!-- <pre>{{ websocket ? 'yes' : 'no'}}</pre> -->
    <panel v-if="me" v-show="!spaceId" :title="`Welcome ${me.firstName}`">
      <b-loading :active="isLoading" :is-full-page="false" />
      <!-- agent is not ready -->
      <div v-show="!websocketOpen">
        <p>Go ready to become available for chat.</p>
        <b-field>
          <b-button
          rounded
          expanded
          type="is-success"
          @click="clickGoReady"
          >
            Go Ready
          </b-button>
        </b-field>
      </div>

      <div v-show="websocketOpen">
        <p v-if="qrUrl">
          Have your customer scan this QR code to chat with you!
        </p>
        <span
        v-if="qrUrl"
        style="display: flex; justify-content: space-around;"
        >
          <vue-qr :text="qrUrl" />
        </span>
        <!-- agent is ready -->
        <b-field>
          <b-button
          rounded
          expanded
          type="is-danger"
          @click="clickGoNotReady"
          >
            Go Not Ready
          </b-button>
        </b-field>
      </div>
    </panel>

    <!-- webex space widget -->
    <div
    v-show="spaceId"
    id="agent-widget"
    style="width: 80vw; height: 80vh;"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import VueQr from 'vue-qr'
 
export default {
  components: {
    VueQr
  },

  data () {
    return {
      isLoading: false
    }
  },

  computed: {
    ...mapGetters([
      'me',
      'token',
      'websocket',
      'spaceId',
      'websocketOpen'
    ]),
    qrUrl () {
      if (this.me && Array.isArray(this.me.emails)) {
        return `${window.location.protocol}//${window.location.host}/customer?agent=${this.me.emails[0]}`
      } else {
        return null
      }
    }
  },

  watch: {
    spaceId () {
      // const widgetEl = this.$refs['webex-widget']
      const widgetEl = document.getElementById('agent-widget')
      // Init a new widget
      window.webex.widget(widgetEl).spaceWidget({
        accessToken: this.token,
        destinationId: this.spaceId,
        destinationType: 'spaceId'
      })
    },
    websocketOpen (val) {
      if (val === true) {
        console.log('websocket open. sending message...')
        // send token to websocket server to register as ready
        this.sendWebsocket({token: this.token})
      }
    }
  },

  mounted () {
    // check if no token in state yet - check localstorage for it, or forward home if not
    if (!this.token) {
      this.checkToken()
    }
  },

  methods: {
    ...mapActions([
      'checkToken',
      'sendWebsocket',
      'connectWebsocket',
      'closeWebsocket'
    ]),
    clickGoReady () {
      // connect to websocket server
      this.connectWebsocket()
    },
    clickGoNotReady () {
      this.closeWebsocket()
    }
  }
}
</script>
