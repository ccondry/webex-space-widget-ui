<template>
  <panel :title="`Welcome!`" aria-id="welcome">
    <p>
      Welcome to the Cisco dCloud ISG Webex instant demo.
    </p>
  </panel>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'me'
    ])
  }
}
</script>