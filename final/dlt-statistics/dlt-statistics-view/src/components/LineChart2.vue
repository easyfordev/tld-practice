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
  },
  data: function () {
    return {
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'apid',
          fontSize: 15,
          fontColor: "#111"
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: false
        },
        scales: {
          xAxes: [{
            display: true,
            distribution: 'series',
            scaleLabel: {
              display: true,
              labelString: 'Time'
            },
            ticks: {
              source: 'labels'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Count'
            }
          }]
        }
      }
    }
  }
}
</script>
