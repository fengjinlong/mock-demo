<template>
  <h1>{{ msg }}</h1>
  <ul>
    <li v-for="el in arr" :key="el.id">
    {{el.time2}}
    <p :style="{color:el.color}">{{el.content}}</p>
    <img :src="el.image" alt="">
    <p>{{el.address}}</p>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { getList } from "../utils/api";

defineProps<{ msg: string }>();
interface O {
[x: string]: any;
  id: number
  content:string
}
let arr:O[] = ref([{id:1,content:'asdf'}])
const count = ref(0);
getList().then((res:any) => {
  console.log("res", res);
  arr.value = res.list
  
});
</script>
<style scoped>
.read-the-docs {
  color: #888;
}
</style>
