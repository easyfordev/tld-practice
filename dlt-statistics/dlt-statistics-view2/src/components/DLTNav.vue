<template>
  <div class="dlt-nav">
    <div id="histroy" style="position: absolute; width: 100%; top:5%;">
      <span id="title">History</span>

      <div id="item-list">
        <ul>
          <li v-for="item in histories" :key="item.id" @click="selected(item.hid)">
            <span style="color: #002c5f; font-weight: bolder; margin-right: 6%">{{item.hid}}</span>
            <span :style="hoverStyle" @mouseover="mouseOver(true)" @mouseleave="mouseOver(false)">{{item.end_time}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DLTNav',
  data () {
    return {
      histories: [ ],
      timer: '',
      hoverState: false,
      hoverStyle: ''
    }
  },
  created: function () {
    this.getHistoryList()
    this.timer = setInterval(this.getHistoryList, 5000) // 5초
  },
  methods: {
    getHistoryList () {
      this.$http
        .get('http://localhost:3000/v2/history/search/meta')
        .then(response => {
          this.histories = response.data.data
        })
    },
    selected (id) {
      this.$store.commit('app/hid', id)
      // console.log(this.$store.state.app.hid)
      // this.$router.push({name: 'dlt-section-detail'})
      this.$router.push({name: 'dlt-section-detail', params: { name: id }})
      // this.$router.push({name: 'dlt-section-detail'})
    },
    mouseOver (state) {
      this.hoverState = state
      if (state === true) {
        this.hoverStyle = 'cursor: pointer;'
      } else if (state === false) {
        this.hoverStyle = 'font-size: 13px'
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Roboto');
.dlt-nav{
  position: absolute;
  top: 7%;
  left: 0;
  width: 15%;
  height: 100%;
  background-color: #e4dcd3;
  border-right: 3px solid white;
  border-top: 3px solid white;
  z-index: 5;
}
#title{
  font-family: 'Roboto', sans-serif;
  font-size: 17px;
  font-weight: bold;
  margin-left: 35%;
}
#item-list li{
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
  margin-bottom: 7%;
  margin-top: 5%;
  list-style: none;
}
</style>
