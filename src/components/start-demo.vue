<template>
  <panel title="Choose your role" aria-id="start-demo">
    <b-field>
      <b-button
      type="is-primary"
      rounded
      expanded
      @click="clickMobileOperator"
      >
        Mobile Operator
      </b-button>
    </b-field>

    <b-field>
      <b-button
      type="is-primary"
      rounded
      expanded
      @click="clickConsultant"
      >
        Consultant
      </b-button>
    </b-field>
  </panel>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'oauthUrl'
    ])
  },

  methods: {
    clickMobileOperator () {
      console.log('clickMobileOperator')
      // user is a customer. pop dialog with info on scanning QR code from
      // consultant desktop
    },
    clickConsultant () {
      console.log('clickConsultant')
      // user is an agent. pop dialog and forward to webex sso.
      // window.location = 
      const message = 'You will be forwarded to Webex sign in page. Sign in as a consultant using your Webex credentials.'
      this.$buefy.dialog.confirm({
        title: 'Sign In',
        message,
        cancelText: 'Cancel',
        confirmText: 'Sign In',
        type: 'is-success',
        rounded: true,
        onConfirm: () => {
          window.location = this.oauthUrl
        }
      })
    }
  }
}
</script>