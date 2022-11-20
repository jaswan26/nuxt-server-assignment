<template>
  <div class="hello" ref="chartdiv4">
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
    let chart = am4core.create(this.$refs.chartdiv4, am4charts.PieChart);

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


    chart.data = data;


    let series = chart.series.push(new am4charts.PieSeries());

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


