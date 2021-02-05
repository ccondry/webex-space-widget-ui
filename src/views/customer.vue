<template>
  <div>
    <panel title="Welcome">
      <p>Welcome Customer!</p>
      <b-field label="Your Name">
        <b-input v-model="form.name" />
      </b-field>
      <b-field label="Your Request">
        <b-input v-model="form.request" />
      </b-field>

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
    </panel>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      form: {
        name: '',
        request: ''
      }
    }
  },

  computed: {
    ...mapGetters([
      'websocket'
    ])
  },

  methods: {
    ...mapActions([
      'connectWebsocket',
      'sendWebsocket'
    ]),
    clickConnect () {
      this.connectWebsocket()
    },
    clickSendWebSocket () {
      this.sendWebsocket({
        agent: 'ccondry@cisco.com',
        issuerId: 'test',
        name: this.form.name,
        request: this.form.request
      })
    }
  }
}
</script>
