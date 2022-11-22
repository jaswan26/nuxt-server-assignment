  
<script setup lang="ts">
import { ref, onMounted } from 'vue'

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

interface dataInterface {
  value: number
  category: string
}

let chartdiv3 = ref<HTMLElement | string>("")

onMounted(() => {

  let chart: am4charts.PieChart = am4core.create(chartdiv3.value, am4charts.PieChart);

  chart.paddingRight = 20;

  let data : dataInterface[] = [
    { value: 10, category: "One" },
    { value: 9, category: "Two" },
    { value: 6, category: "Three" },
    { value: 5, category: "Four" },
    { value: 4, category: "Five" },
    { value: 3, category: "Six" },
    { value: 1, category: "Seven" }
  ]

  chart.data = data;

  let series: am4charts.PieSeries = chart.series.push(new am4charts.PieSeries());

  series.startAngle = 180;
  series.endAngle = 360;
  series.alignLabels = false;
  series.dataFields.category = "category";
  series.dataFields.value = "value";


  // chart = chart;
})

am4core.useTheme(am4themes_animated);


</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->

<template>
   <input ref="el" />
  <div class="hello" ref="chartdiv3">
  </div>
</template>
<style scoped>
.hello {
  width: 100%;
  height: 500px;
}

</style>


