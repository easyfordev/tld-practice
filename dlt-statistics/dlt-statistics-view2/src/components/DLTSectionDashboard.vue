<template>
  <div class="dlt-section-dashboard">
    <h2 style="margin: 2%">Dashboard</h2>
    <line-chart :chart-data="datacollection" style="width: 80%; max-height: 50%"></line-chart>
  </div>
</template>

<script>
/* eslint-disable */
import LineChart from './LineChart'

export default {
  name: 'DltSectionDashboard',
  components: { LineChart },
  data () {
    return {
      datacollection: {},
      timer: ''
    }
  },
  created: function () {
   // this.fillData()
    this.getData()
    this.timer = setInterval(this.getData, 5000) // 5초
  },
  methods: {
    getData () {
      let temp_datacollection = {}
      let temp_datasets = []

      this.$http
        .get('http://localhost:3000/v2/history/progress/subtype')
        .then(response => {
          let receivedData = response.data.data

          for(var key in receivedData) {
            let temp_data0 = {}
            temp_data0['label'] = key
            temp_data0['data'] = receivedData[key]
            temp_data0['fill'] = false
            temp_data0['borderColor'] = temp_data0['backgroundColor'] = this.generateRandom()
            temp_datasets.push(temp_data0)
          }

          temp_datacollection['labels'] = response.data.hid
          temp_datacollection['datasets'] = temp_datasets
          this.datacollection = temp_datacollection
        })
    },
    generateRandom () {
      // var ranNum = Math.floor(Math.random()*(max-min+1)) + min
      return '#' + ((1 << 24) * Math.random() | 0).toString(16)
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Roboto');

.dlt-section-dashboard{
  font-family: 'Roboto', sans-serif;
  position: absolute;
  width: 50%;
  height: 100%;
  left: 0;
  font-weight: bolder;
  background-color: white;
}
</style>
