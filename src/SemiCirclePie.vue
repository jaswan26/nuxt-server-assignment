<template>
  <div class="hello" ref="chartdiv3">
  </div>
</template>
  
<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);


export default {
  name: 'HelloWorld',
  mounted() {
    let chart = am4core.create(this.$refs.chartdiv3, am4charts.PieChart);

    chart.paddingRight = 20;

    let data = [
      { value: 10, category: "One" },
      { value: 9, category: "Two" },
      { value: 6, category: "Three" },
      { value: 5, category: "Four" },
      { value: 4, category: "Five" },
      { value: 3, category: "Six" },
      { value: 1, category: "Seven" }
    ]
    // let visits = 10;
    // for (let i = 1; i < 30; i++) {
    //   visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
    //   data.push({ date: new Date(2018, 0, i), name: "name" + i, value: visits });
    // }

    chart.data = data;

    // let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    // dateAxis.renderer.grid.template.location = 0;

    // let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.tooltip.disabled = true;
    // valueAxis.renderer.minWidth = 35;

    let series = chart.series.push(new am4charts.PieSeries());

    series.startAngle = 180;
    series.endAngle = 360;
    series.alignLabels = false;
    series.category = "category"
    series.value = "value"
    series.dataFields.category = "category";
    series.dataFields.value = "value";


    this.chart = chart;
  },

  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  width: 100%;
  height: 500px;
}
</style>


