<script setup lang="ts">
type ResponseData = {
  _id: string;
  author: string;
  title: string;
  category: string;

};

defineProps<{ dataSource: ResponseData }>();


</script>

<template>

  <a-descriptions v-if="void 0 !== dataSource" :column="{ xs: 1, sm: 2 }">
   
    <a-descriptions-item label="Author">{{ dataSource.author }}</a-descriptions-item>

    <a-descriptions-item label="Title">{{ dataSource.title }}</a-descriptions-item>

    <a-descriptions-item label="Category">{{ dataSource.category }}</a-descriptions-item>

  </a-descriptions>
</template>
