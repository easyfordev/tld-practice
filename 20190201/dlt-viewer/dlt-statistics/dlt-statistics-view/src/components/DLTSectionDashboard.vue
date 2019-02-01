<template>
  <div class="dlt-section-dashboard">
    <p style="margin: 2%">Dashboard</p>
    <line-chart :chart-data="datacollection" style="width: 95%; max-height: 50%"></line-chart>
    <line-chart2 :chart-data="datacollection2" style="width: 95%; max-height: 50%; top:50%;"></line-chart2>
    <line-chart3 :chart-data="datacollection3" style="width: 95%; max-height: 50%; top:80%;"></line-chart3>
  </div>
</template>

<script>
/* eslint-disable */
import LineChart from './LineChart'
import LineChart2 from './LineChart2'
import LineChart3 from './LineChart3'

export default {
  name: 'DltSectionDashboard',
  components: { LineChart, LineChart2, LineChart3 },
  data () {
    return {
      datacollection: {},
      datacollection2: {},
      datacollection3: {},
      timer: ''
    }
  },
  created: function () {
   // this.fillData()
    this.getData()
    this.getData2()
    this.getData3()
    this.timer = setInterval(this.getData, 5000) // 5초
    this.timer = setInterval(this.getData2, 5000) // 5초
    this.timer = setInterval(this.getData3, 5000) // 5초

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
    getData2 () {
      let temp_datacollection = {}
      let temp_datasets = []

      this.$http
        .get('http://localhost:3000/v2/history/progress/apid')
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
          this.datacollection2 = temp_datacollection
        })
    },
    getData3 () {
      let temp_datacollection = {}
      let temp_datasets = []

      this.$http
        .get('http://localhost:3000/v2/history/progress/ecuid')
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
          this.datacollection3 = temp_datacollection
        })
    },
    generateRandom () {
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
  width: 47%;
  height: 100%;
  left: 0;
  font-weight: bolder;
  background-color: white;
  overflow: scroll;
}
</style>
