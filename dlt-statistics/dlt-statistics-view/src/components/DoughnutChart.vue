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
          position: "top",
          text: "Subtype",
          fontSize: 18,
          fontColor: "#111"
        },
        legend: {
          display: true,
          position: "bottom",
          labels: {
            fontColor: "#727272",
            fontSize: 16
          }
        }
      }
    }
  }
}
</script>
