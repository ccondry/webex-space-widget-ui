<template>
  <div>
    <!-- <pre>{{ isLoggedIn }}</pre> -->
    <!-- <pre>{{ me }}</pre> -->
    <b-loading :active="true" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'isLoggedIn',
      'me'
    ])
  },

  watch: {
    isLoggedIn (val, oldVal) {
      // if (val && !oldVal) {
      //   // user just completed login. forward to agent page
      //   this.$router.push({name: 'Agent'})
      // }
    },
    me (val, oldVal) {
      // if (val && !oldVal) {
      //   // user just loaded profile. forward to agent page
      //   this.$router.push({name: 'Agent'})
      // }
    }
  },

  mounted () {
    this.completeOauth2()
  },

  methods: {
    ...mapActions([
      'completeOauth2'
    ])
  }
}
</script>
