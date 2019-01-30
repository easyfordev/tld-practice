<template>
  <div class="dlt-header">
    <div id="home" :style="hoverStyle" @mouseover="mouseOver" @click="gotohome"><img src="../assets/logo2.png"  style="left: 0; margin-top: 4%; width: 35%; height: 65%">
      <span style="font-size: 13px; font-weight: bolder;">DLT Log Statistics</span>
    </div>
    <div id="not-home">
      <div class="userinput">
        <label for="minute" style="font-size: 12px;">Minute : </label>
        <input type="text" id="minute" placeholder="0-60" style="width: 40px;font-size: 10px" v-model="serverParams.interval_m">
        <label for="minute" style="font-size: 12px;">Second : </label>
        <input type="text" id="second" placeholder="0-60" style="width: 40px;font-size: 10px" v-model="serverParams.interval_s">
        <!--<button type="button" class="btn btn-primary btn-sm" @click="changeInterval">Change!</button>-->
        <button id="change-button" @click="changeInterval">Change!</button>
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
      timer: '',
      hoverStyle: ''
    }
  },
  created: function () {
    // this.timer = setInterval(this.fillData, 2000) // 5초
    this.initInterval()
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
    },
    initInterval () {
      this.$http
        .get('http://localhost:3000/v1/interval')
        .then(response => {
          this.serverParams.interval_s = response.data.interval_s
          this.serverParams.interval_m = response.data.interval_m
        })
    },
    gotohome () {
      this.$router.push({name: 'Home'})
    },
    mouseOver () {
      this.hoverStyle = 'cursor: pointer;'
    }
  }
}
</script>

<style scoped>
.dlt-header{
  position: absolute;
  top: 0;
  width: 100%;
  height: 7%;
  left: 0;
  background-color: #e4dcd3;
}
#home{
  position: absolute;
  left: 0;
  width: 15%;
  height: 100%;
  z-index: 2;
  border-right: 3px solid white;
}
#not-home{
  position: absolute;
  left:  15%;
  width: 100%;
  height: 100%;
}
.userinput{
  position: absolute;
  right: 17%;
  top: 25%;
}
img{
  width: 80px;
  height: 40px;
}
#change-button{
  background-color: #002c5f;
  color: white;
  font-size: 13px;
  border-radius: 8px;
  width: 70px;
  height: 40px;
}
</style>
