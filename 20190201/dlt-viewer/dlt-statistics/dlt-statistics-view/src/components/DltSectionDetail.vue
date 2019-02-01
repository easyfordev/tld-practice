<template>
  <div class="dlt-section-detail">
    <p style="margin: 2%">Detail  <span style="position: absolute; font-weight: bold; font-size: 12px; right: 13%; margin-top: 1%">{{$route.query.startTime}} ----- {{$route.query.endTime}}</span></p>

    <doughnut-chart :chart-data="datacollection" style="position: absolute; top: 55%; left: 0%;  max-width: 2000px; max-height: 2000px"></doughnut-chart>
    <bar-chart :chart-data="datacollection2" style="position: absolute; top: 5%; left: 3%; width: 80%; height: 40px"></bar-chart>
    <doughnut-chart2 :chart-data="datacollection3" style="position: absolute; top: 55%; right: 4%;  max-width: 2000px; max-height: 2000px"></doughnut-chart2>
  </div>
</template>

<script>
/* eslint-disable */
import DoughnutChart from './DoughnutChart'
import DoughnutChart2 from './DoughnutChart2'
import BarChart from './BarChart'

export default {
  name: 'DltSectionDetail',
  components: {DoughnutChart, BarChart, DoughnutChart2},
  props: ['hid'],
  data() {
    return {
      datacollection: {},
      datacollection2: {},
      datacollection3: {}
    }
  },
  created: function () {
    this.getData()
  },
  methods: {
    getData() {
      // alert("Changed!" + this.$props.hid)
      this.fillData()
      this.fillData2()
      this.fillData3()
    },
    fillData() {
      let ttt = this.$props.hid

      this.$http
        .get('http://localhost:3000/v2/subtype?hid=' + ttt)
        .then(response => {
          let temp_datacollection = {}
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
          this.datacollection = temp_datacollection
        })
    },
    generateRandom() {
      // var ranNum = Math.floor(Math.random()*(max-min+1)) + min
      return '#' + ((1 << 24) * Math.random() | 0).toString(16)
    },
    fillData2 () {
      let ttt = this.$props.hid

      this.$http
        .get('http://localhost:3000/v2/apid?hid='+ ttt)
        .then(response => {
          let temp_datacollection = { }
          let temp_datasets = []
          let temp_datasets_json = {}
          let temp_backgroundColor = []
          temp_datacollection["labels"] = response.data.labels
         /* console.log(response.data)

          labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
            datasets: [
            {
              label: "Population (millions)",
              backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
              data: [2478,5267,734,784,433]
            }
          ]*/
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
      let ttt = this.$props.hid
      this.$http
        .get('http://localhost:3000/v2/ecuid?hid='+ ttt)
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
    }
  },
  watch: {
    '$route.path': 'getData'
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Roboto');

.dlt-section-detail{
  font-family: 'Roboto', sans-serif;
  position: absolute;
  width: 50%;
  height: 100%;
  top: 5%;
  right: 0;
  left: 55%;
  font-weight: bolder;
  background-color: #f6f3f2;
}
</style>
