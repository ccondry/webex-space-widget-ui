<template>
  <div
  id="main-container"
  class="container is-fluid is-marginless app-content"
  >
    <!-- top-right buttons -->
    <div
    class="buttons"
    style="float: right; position: absolute; right: 10px; top: 10px;"
    >
      <!-- home button -->
      <b-button
      v-if="atAdmin"
      type="is-info"
      rounded
      @click="clickHome"
      >
        Home
      </b-button>
    </div>
    <section class="main">
      <!-- vue-router container -->
      <transition
      mode="out-in"
      enter-active-class="fadeIn"
      leave-active-class="fadeOut"
      appear
      >
        <keep-alive>
          <router-view />
        </keep-alive>
      </transition>

      <!-- copyright and version -->
      <app-footer />
    </section>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppFooter from './components/app-footer'

export default {
  components: {
    AppFooter
  },

  computed: {
    ...mapGetters([
      'isLoggedIn',
      'me'
    ]),
    atHome () {
      try {
        return this.$route.name === 'Home'
      } catch (e) {
        return false
      }
    },
    atAdmin () {
      try {
        return this.$route.name === 'Admin'
      } catch (e) {
        return false
      }
    }
  },

  mounted () {
    // get REST API version
    this.getApiVersion()
  },

  methods: {
    ...mapActions([
      'logout',
      'getApiVersion'
    ]),
    clickLogout () {
      this.logout()
    },
    clickHome () {
      this.$router.push({name: 'Home'}).catch(e => {})
    }
  }
}
</script>
