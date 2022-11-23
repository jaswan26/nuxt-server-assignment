<template>
    <div class="hello" ref="chartdiv">
    </div>
  </template>
  
  <script setup lang="ts">
  import * as am4core from "@amcharts/amcharts4/core";
  import * as am4charts from "@amcharts/amcharts4/charts";
  import am4themes_animated from "@amcharts/amcharts4/themes/animated";
  import { onMounted, ref } from "vue";

am4core.useTheme(am4themes_animated);
 
let chartdiv = ref <HTMLElement | string>("")

  onMounted(()=> {
    let chart: am4charts.XYChart = am4core.create(chartdiv.value, am4charts.XYChart);

      chart.paddingRight = 20;
  
      let data = [];
      let visits = 10;
      for (let i = 1; i < 366; i++) {
        visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
        data.push({ date: new Date(2018, 0, i), name: "name" + i, value: visits });
      }
  
      chart.data = data;
  
      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.grid.template.location = 0;
  
      let valueAxis: am4charts.ValueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.minWidth = 35;
  
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "date";
      series.dataFields.valueY = "value";
  
      series.tooltipText = "{valueY.value}";
      chart.cursor = new am4charts.XYCursor();
  
      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;
    
  })
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  .hello {
    width: 100%;
    height: 500px;
  }
  </style>
