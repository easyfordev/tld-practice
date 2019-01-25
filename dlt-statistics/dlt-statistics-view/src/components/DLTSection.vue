<template>
  <div class="dlt-section">
    <!--<div id="set-period">-->
      <!--<div class="userinput" style="right: 0">-->
        <!--<label for="minute" style="font-size: 10px;">Minute : </label>-->
        <!--<input type="text" id="minute" placeholder="0-60" style="width: 40px;font-size: 10px" v-model="serverParams.interval_m">-->
        <!--<label for="minute" style="font-size: 10px;">Second : </label>-->
        <!--<input type="text" id="second" placeholder="0-60" style="width: 40px;font-size: 10px" v-model="serverParams.interval_s">-->
        <!--<button type="button" class="btn btn-primary btn-sm" @click="changeInterval">Change!</button>-->
      <!--</div>-->
    <!--</div>-->
    <button type="button" class="btn btn-success" @click="refreshData" style="margin: 2%">Refresh data</button>
    <doughnut-chart :chart-data="datacollection" style="position: absolute; top: 10%; right: 17%;  max-width: 2000px; max-height: 2000px"></doughnut-chart>
    <bar-chart :chart-data="datacollection2" style="position: absolute; top: 10%; left: 3%; width: 57%"></bar-chart>
    <!--<line-chart :chart-data="datacollection" style="position: absolute; top: 10%; left: 5%; max-width: 2000px; max-height: 1200px"></line-chart>-->
    <doughnut-chart2 :chart-data="datacollection3" style="position: absolute; top: 50%; right: 17%;  max-width: 2000px; max-height: 2000px"></doughnut-chart2>
  </div>
</template>

<script>
/* eslint-disable */
import DoughnutChart from './DoughnutChart'
import DoughnutChart2 from './DoughnutChart2'
import BarChart from './BarChart'
import LineChart from './LineChart'

export default {
  name: 'DLTSection',
  components: { DoughnutChart, BarChart, LineChart, DoughnutChart2 },
  data () {
    return {
      serverParams: {
        interval_s:0,
        interval_m:0
      },
      priorities: [
        { text: '1 minute', value: 1 },
        { text: '5 minutes', value: 5 },
        { text: '10 minutes', value: 10 }
      ],
      datacollection: { },
      datacollection2:{ },
      datacollection3:{ },
      timer: ''
    }
  },
  created: function () {

    this.fillData3()
    this.fillData2()

    this.fillData()
    // this.timer = setInterval(this.fillData, 2000) // 5초
  },
  methods: {
    refreshData () {
      this.fillData3()
      this.fillData2()
      this.fillData()
    },
    changeInterval(){
      let json = {}
      json["interval_s"] = this.serverParams.interval_s
      json["interval_m"] = this.serverParams.interval_m

      this.$http
        .post('http://localhost:3000/v1/interval',json)
        .then(response => {
          alert(response.statusText)
        })
    },
    fillData () {
      this.$http
        .post('http://localhost:3000/v1/subtype')
        .then(response => {
          // console.log(response.data)

          let temp_datacollection = { }
          let temp_datasets = []
          let temp_datasets_json = {}
          let temp_backgroundColor = []


          let len = response.data.data.length
          for(let i=0; i<len ;i++){
            let rand_color = this.generateRandom()
            temp_backgroundColor.push(rand_color)
          }
          temp_datasets.push(temp_datasets_json)

          temp_datasets_json["data"] = response.data.data
          temp_datasets_json["backgroundColor"] = ['#71ff9c', '#8ec9ff', '#ff2900']

          temp_datasets.push(temp_datasets_json)

          temp_datacollection["datasets"] = temp_datasets
          temp_datacollection['labels'] = response.data.labels

          this.datacollection = temp_datacollection
        })
    },
    generateRandom () {
      // var ranNum = Math.floor(Math.random()*(max-min+1)) + min
      return '#' + ((1 << 24) * Math.random() | 0).toString(16)
    },
    fillData2 () {
      this.$http
        .get('http://localhost:3000/v1/apid')
        .then(response => {
          console.log(response.data)

          let temp_datacollection = { }
          let temp_datasets = []
          let temp_datasets_json = {}
          let temp_backgroundColor = []


         // temp_datacollection["labels"] = response.data.labels

          // console.log(response.data)
          //
          // labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
          //   datasets: [
          //   {
          //     label: "Population (millions)",
          //     backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
          //     data: [2478,5267,734,784,433]
          //   }
          // ]

          let len = response.data.data.length
          for(let i=0; i<len ;i++){
            let rand_color = this.generateRandom()
            temp_backgroundColor.push(rand_color)
          }
          temp_datasets.push(temp_datasets_json)

          temp_datasets_json["data"] = response.data.data
          temp_datasets_json["backgroundColor"] = temp_backgroundColor
          temp_datasets_json["label"] = "logs per apid"

          temp_datasets.push(temp_datasets_json)

          temp_datacollection["datasets"] = temp_datasets
          temp_datacollection['labels'] = response.data.labels

          this.datacollection2 = temp_datacollection
        })
    },
    fillData3 () {
      this.$http
        .get('http://localhost:3000/v1/ecuid')
        .then(response => {
          // console.log(response.data)

          let temp_datacollection = { }
          let temp_datasets = []
          let temp_datasets_json = {}
          let temp_backgroundColor = []


          let len = response.data.data.length
          for(let i=0; i<len ;i++){
            let rand_color = this.generateRandom()
            temp_backgroundColor.push(rand_color)
          }
          temp_datasets.push(temp_datasets_json)

          temp_datasets_json["data"] = response.data.data
          temp_datasets_json["backgroundColor"] = temp_backgroundColor

          temp_datasets.push(temp_datasets_json)

          temp_datacollection["datasets"] = temp_datasets
          temp_datacollection['labels'] = response.data.labels

          this.datacollection3 = temp_datacollection
        })
    },
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Roboto');

.dlt-section{
  font-family: 'Roboto', sans-serif;
  position: absolute;
  top: 7%;
  width: 100%;
  height: 100%;
  left: 15%;
  font-weight: bolder;
}
#set-period{
  /*background: #f9f9f9;*/
  margin-left: 1.5%;
  margin-top: 1.5%;
  margin-right: 20%;
}
.normal{
  font-family: Arial;
}
#display-time{
  margin-left: 5px;
  font-size: 15px;
}
</style>
