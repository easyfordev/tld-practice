<template>
  <div class="dlt-section">
    <p id="title">DLT Log Statistics</p>
    <div id="set-period">
      <select id="priority" v-model="serverParams.search_key" style="width: 10%">
        <option v-for="item in priorities" :key="item.id" :value="item.value">{{item.text}}</option>
      </select>
      <button type="button" class="btn btn-primary btn-sm" @click="fillData">Search</button>
      <div id ="display-time" style="">
        <span class="highlight">Start time :</span>
        <!--<span class="normal">2019.01.03 12:22:11</span>-->
        <span class="highlight">End time :</span>
        <!--<span class="normal">2019.01.03 13:22:11</span>-->
      </div>
    </div>

    <doughnut-chart :chart-data="datacollection" style="position: absolute; top: 20%; left: 20%; max-width: 1500px; max-height: 1500px"></doughnut-chart>

  </div>
</template>

<script>
/* eslint-disable */
import DoughnutChart from './DoughnutChart'

export default {
  name: 'DLTSection',
  components: { DoughnutChart },
  data () {
    return {
      serverParams: {
        start_date: '',
        end_date: '',
        search_key: '',
        search_value: ''
      },
      priorities: [
        { text: '1 minute', value: 1 },
        { text: '5 minutes', value: 5 },
        { text: '10 minutes', value: 10 }
      ],
      datacollection: {
        datasets: [{
          data: [1, 50, 50],
          backgroundColor: ['#00ffff', '#654684', '#f66255']
        }],
        labels: [
          'Red',
          'Yellow',
          'Blue'
        ]
      }
    }
  },
  methods: {
    fillData () {
      this.$http
        .post('http://localhost:3000/v1/subtype')
        .then(response => {
          console.log(response.data)

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
@import url('https://fonts.googleapis.com/css?family=Roboto:700');

.dlt-section{
  font-family: 'Roboto', sans-serif;
  position: absolute;
  top: 6%;
  width: 100%;
  height: 100%;
  left: 15%;
}
#title{
  font-size: 30px;
  margin: 10px 5px 5px 5px;
}
.normal{
  font-family: Arial;
}
#display-time{
  margin-left: 5px;
  font-size: 15px;
}
</style>
