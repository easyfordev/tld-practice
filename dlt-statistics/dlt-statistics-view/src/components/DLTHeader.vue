<template>
  <div class="dlt-header">
    <div id="home"><img src="../assets/logo.png"></div>
  </div>
</template>

<script>
export default {
  name: 'DLTHeader'
}
</script>

<style scoped>
.dlt-header{
  position: absolute;
  top: 0px;
  width: 100%;
  height: 6%;
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
img{
  width: 100px;
  height: 50px;
}
</style>
