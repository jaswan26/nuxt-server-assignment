<template>
  <div class="hello" ref="chartdiv">
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
    let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);


    // Add data
    chart.data = [{
      "category": "Example 1",
      "from": 0,
      "to": 15,
      "name": "Stage #1",
      "fill": am4core.color("#0ca948")
    }, {
      "category": "Example 2",
      "from": 15,
      "to": 75,
      "name": "Stage #2",
      "fill": am4core.color("#93da49")
    }, {
      "category": "Example 3",
      "from": 75,
      "to": 90,
      "name": "Stage #3",
      "fill": am4core.color("#ffd100")
    }, {
      "category": "Example 4",
      "from": 90,
      "to": 95,
      "name": "Stage #4",
      "fill": am4core.color("#cd213b")
    }, {
      "category": "Example 5",
      "from": 95,
      "to": 100,
      "name": "Stage #5",
      "fill": am4core.color("#9e9e9e")
    }];

    // Create axes
    let yAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    yAxis.dataFields.category = "category";
    yAxis.renderer.grid.template.disabled = true;
    yAxis.renderer.labels.template.disabled = true;

    let xAxis = chart.xAxes.push(new am4charts.ValueAxis());
    xAxis.renderer.grid.template.disabled = true;
    xAxis.renderer.grid.template.disabled = true;
    xAxis.renderer.labels.template.disabled = true;
    xAxis.min = 0;
    xAxis.max = 100;

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = "to";
    series.dataFields.openValueX = "from";
    series.dataFields.categoryY = "category";
    series.columns.template.propertyFields.fill = "fill";
    series.columns.template.strokeOpacity = 0;
    series.columns.template.height = am4core.percent(100);

    // Ranges/labels
    chart.events.on("beforedatavalidated", function (ev) {
      let data = chart.data;
      for (var i = 0; i < data.length; i++) {
        let range = xAxis.axisRanges.create();
        range.value = data[i].to;
        range.label.text = data[i].to + "%";
        range.label.horizontalCenter = "right";
        range.label.paddingLeft = 5;
        range.label.paddingTop = 5;
        range.label.fontSize = 10;
        range.grid.strokeOpacity = 0.2;
        range.tick.length = 18;
        range.tick.strokeOpacity = 0.2;
      }
    });

    // Legend
    let legend = new am4charts.Legend();
    legend.parent = chart.chartContainer;
    legend.itemContainers.template.clickable = false;
    legend.itemContainers.template.focusable = false;
    legend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.default;
    legend.align = "right";
    legend.data = chart.data;

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
