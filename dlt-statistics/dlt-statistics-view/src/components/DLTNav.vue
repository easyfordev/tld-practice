<template>
  <div class="dlt-nav">
    <div id="histroy" style="position: absolute; width: 100%; top: 50%;border-top:1px solid ">
      <span id="title">History</span>
      <div id="item-list">
        <p v-for="item in priorities" :key="item.id" :value="item.value">{{item.text}}</p>
        <!--<select id="priority" v-model="serverParams.search_key">-->
        <!--<option v-for="item in priorities" :key="item.id" :value="item.value">{{item.text}}</option>-->
        <!--</select>-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DLTNav',
  data () {
    return {
      priorities: [
        { text: 'File Name', value: 'file_name' },
        { text: 'Article ID', value: 'article_id' },
        { text: 'Office ID', value: 'office_id' }
      ]
    }
  }
}
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Roboto+Condensed');
.dlt-nav{
  position: absolute;
  top: 6%;
  left: 0;
  width: 15%;
  height: 100%;
  background-color: #f9f9f9;
  border-right: 3px solid white;
}
#title{
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 17px;
  font-weight: bold;
}
#item-list p{
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 10px;
  margin: 0;
}
</style>
