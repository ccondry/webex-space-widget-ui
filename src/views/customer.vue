<template>
  <div>
    <!-- <pre>{{ options }}</pre> -->
    <panel v-show="!spaceId" title="Welcome">
      <b-loading :active="isLoading" :is-full-page="false" />
      <p>Welcome!</p>
      <b-field label="Your Agent">
        <div>{{ $route.query.agent }}</div>
      </b-field>
      <b-field label="Your Name">
        <b-input v-model="form.name" />
      </b-field>
      <b-field label="Your Request">
        <b-input v-model="form.request" />
      </b-field>

      <b-field>
        <b-button
        rounded
        expanded
        type="is-success"
        @click="clickStartChat"
        >
          Start Chat
        </b-button>
      </b-field>
    </panel>

    <!-- webex space widget -->
    <panel v-show="guestToken && spaceId">
      <div
      id="customer-widget"
      style="width: 500px; height: 400px;"
      />
    </panel>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      form: {
        name: 'Coty Condry',
        request: 'Help'
      },
      isLoading: false
    }
  },

  computed: {
    ...mapGetters([
      'websocket',
      'guestToken',
      'spaceId',
      'websocketOpen'
    ]),
    options () {
      return {
        guestToken: this.guestToken,
        // accessToken: this.guestToken,
        destinationId: this.spaceId,
        destinationType: 'spaceId'
      }
    }
  },

  watch: {
    spaceId () {
      const widgetEl = document.getElementById('customer-widget')
      // Init a new widget
      window.webex.widget(widgetEl).spaceWidget(this.options)
    },
    websocketOpen (val) {
      if (val === true) {
        console.log('websocket open. sending message...')
        // send token to websocket server to register as ready
        this.sendWebsocket({
          agent: this.$route.query.agent,
          name: this.form.name,
          request: this.form.request
        })
        this.isLoading = true
      }
    }
  },

  methods: {
    ...mapActions([
      'connectWebsocket',
      'sendWebsocket'
    ]),
    clickStartChat () {
      this.connectWebsocket()
    }
  }
}
</script>
