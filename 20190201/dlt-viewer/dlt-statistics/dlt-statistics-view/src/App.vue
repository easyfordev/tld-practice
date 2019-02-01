<template>
  <div id="app">
    <dlt-header></dlt-header>
    <dlt-nav></dlt-nav>
    <dlt-section></dlt-section>
    <router-view/>
  </div>
</template>

<script>
import DltHeader from './components/DLTHeader'
import DltNav from './components/DLTNav'
import DltSection from './components/DLTSection'

export default {
  name: 'App',
  components: { DltHeader, DltNav, DltSection }
}
</script>

<style>

</style>
