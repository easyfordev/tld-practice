<script>
/* eslint-disable */
import VueChartJs from 'vue-chartjs'
import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: VueChartJs.Bar,
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
          text: "Apid",
          fontSize: 15,
          fontColor: "#111"
        },
        legend: {
          display: false,
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
