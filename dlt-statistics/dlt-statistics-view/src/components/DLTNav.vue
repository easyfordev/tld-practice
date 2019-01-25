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
        { text: '2019-01-01 11:11:13', value: 'file_name' },
        { text: '2019-01-01 11:11:43', value: 'article_id' },
        { text: '2019-01-01 11:12:13', value: 'office_id' },
        { text: '2019-01-01 11:12:43', value: 'office_id' },
        { text: '2019-01-01 11:13:13', value: 'office_id' },
        { text: '2019-01-01 11:13:43', value: 'office_id' }

      ]
    }
  }
}
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Roboto+Condensed');
.dlt-nav{
  position: absolute;
  top: 7%;
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
