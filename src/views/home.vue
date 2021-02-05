<template>
  <div>
    <!-- welcome -->
    <welcome />

    <!-- start demo buttons -->
    <start-demo />
  </div>
</template>

<script>
import Welcome from '../components/welcome'
import StartDemo from '../components/start-demo'

export default {
  components: {
    Welcome,
    StartDemo
  }
}
</script>
