<template>
  <div class="dlt-header">
    <div id="home"><img src="../assets/logo2.png" style="margin-top: 7%">
      <span style="font-size: 13px; font-weight: bolder;">DLT Log Statistics</span>
    </div>
    <div id="set-period">
      <div class="userinput" style="right: 0">
        <label for="minute" style="font-size: 10px;">Minute : </label>
        <input type="text" id="minute" placeholder="0-60" style="width: 40px;font-size: 10px" v-model="serverParams.interval_m">
        <label for="minute" style="font-size: 10px;">Second : </label>
        <input type="text" id="second" placeholder="0-60" style="width: 40px;font-size: 10px" v-model="serverParams.interval_s">
        <button type="button" class="btn btn-primary btn-sm" @click="changeInterval">Change!</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DLTHeader',
  data () {
    return {
      serverParams: {
        interval_s: 0,
        interval_m: 0
      },
      timer: ''
    }
  },
  created: function () {
    // this.timer = setInterval(this.fillData, 2000) // 5초
  },
  methods: {
    changeInterval () {
      let json = {}
      json['interval_s'] = this.serverParams.interval_s
      json['interval_m'] = this.serverParams.interval_m

      this.$http
        .post('http://localhost:3000/v1/interval', json)
        .then(response => {
          alert(response.statusText)
        })
    }
  }
}
</script>

<style scoped>
.dlt-header{
  position: absolute;
  top: 0px;
  width: 100%;
  height: 7%;
  left: 0;
  background-color: #ccc4bf;
}
#home{
  position: absolute;
  left: 0;
  width: 15%;
  height: 100%;
  z-index: 2;
  border-right: 3px solid white;
}
#set-period{
  position: absolute;
  left: 15%;
  width: 85%;
  height: 100%;
  margin-top: 1.5%;
  margin-left: 2%;
  z-index: 2;
  /*background-color: #ccc4bf;*/
}
img{
  width: 80px;
  height: 40px;
}
</style>
