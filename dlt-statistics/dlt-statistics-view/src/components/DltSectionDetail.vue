<template>
  <div class="dlt-section-detail">
    <!--<h2>{{$store.state.app.hid}}</h2>-->
    <h2>{{$props.name}}</h2>
    <!--<button type="button" class="btn btn-success" @click="refreshData" style="margin: 2%">Refresh data</button>-->
    <!--<button type="button" class="btn btn-danger" @click="refreshData" style="margin: 2%">Truncate data</button>-->
    <doughnut-chart :chart-data="datacollection" style="position: absolute; top: 55%; left: 3%;  max-width: 2000px; max-height: 2000px"></doughnut-chart>
    <bar-chart :chart-data="datacollection2" style="position: absolute; top: 3%; left: 3%; width: 80%; height: 40px"></bar-chart>
    <doughnut-chart2 :chart-data="datacollection3" style="position: absolute; top: 55%; right: 7%;  max-width: 2000px; max-height: 2000px"></doughnut-chart2>
  </div>
</template>

<script>
/* eslint-disable */
import DoughnutChart from './DoughnutChart'
import DoughnutChart2 from './DoughnutChart2'
import BarChart from './BarChart'
import LineChart from './LineChart'

export default {
  name: 'DltSectionDetail',
  components: { DoughnutChart, BarChart, LineChart, DoughnutChart2 },
  props: ['name'],
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
      timer: '',
      num: -1
    }
  },
  created: function () {
    this.num = this.$props.name
   // this.fillData()
    // alert(this.num)
  },
  updated () {
    this.num = this.$props.name
    // this.fillData()
    // alert("업데이트ㅡ 되었다 이자식아")
  },
  methods: {
    // refreshData () {
    //   this.fillData3()
    //   this.fillData2()
    //   this.fillData()
    // },
    fillData () {
      let ttt = this.num

      this.$http
        .get('http://localhost:3000/v2/subtype?hid='+ ttt)
        .then(response => {
          let temp_datacollection = { }
          let temp_datasets = []
          let temp_datasets_json = {}
          let temp_backgroundColor = []
          let len = response.data.data.length
          // for(let i=0; i<len ;i++){
          //   let rand_color = this.generateRandom()
          //   temp_backgroundColor.push(rand_color)
          //  }
          temp_datasets.push(temp_datasets_json)
          temp_datasets_json["data"] = response.data.data
          //temp_datasets_json["backgroundColor"] = ['#71ff9c', '#8ec9ff', '#ff2900']
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
        .get('http://localhost:3000/v2/subtype?hid='+ this.num)
        .then(response => {
          console.log("FillData1 !!!")
          console.log(response.data)
        })
    },
    fillData3 () {
      this.$http
        .get('http://localhost:3000/v2/subtype?hid='+ this.num)
        .then(response => {
          console.log("FillData1 !!!")
          console.log(response.data)
        })
    },
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
  top: 7%;
  right: 0;
  font-weight: bolder;
  background-color: #f6f3f2;
}
</style>
