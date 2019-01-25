<script>
/* eslint-disable */
import VueChartJs from 'vue-chartjs'
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: VueChartJs.Line,
  mixins: [reactiveProp],
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
</script>
