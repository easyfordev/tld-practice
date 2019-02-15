<template>
  <div class="dlt-section">
    <!--<dlt-section-detail></dlt-section-detail>-->
    <d-l-t-section-dashboard></d-l-t-section-dashboard>
  </div>
</template>

<script>
/* eslint-disable */
import DLTSectionDashboard from './DLTSectionDashboard'
import DltSectionDetail from './DltSectionDetail'

export default {
  name: 'DLTSection',
  components: { DltSectionDetail, DLTSectionDashboard }
}
</script>

<style scoped>
.dlt-section{
  position: absolute;
  top: 5%;
  width: 85%;
  height: 100%;
  left: 15%;
}
</style>
