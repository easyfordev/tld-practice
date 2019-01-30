<script>
/* eslint-disable */
import VueChartJs from 'vue-chartjs'
import { Doughnut, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: VueChartJs.Doughnut,
  mixins: [reactiveProp],
  mounted () {
    this.renderChart(this.chartData, this.options)
  },
  data: function () {
    return {
      options: {
        responsive: true,
        title: {
          display: true,
          position: "bottom",
          text: "Subtype",
          fontSize: 15,
          fontColor: "#111"
        },
        legend: {
          display: true,
          position: "bottom",
          labels: {
            fontColor: "#727272",
            fontSize: 15
          }
        }
      }
    }
  }
}
</script>
