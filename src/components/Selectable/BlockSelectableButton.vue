<script setup>
import {ref} from "vue"
const props = defineProps(["content"])
</script>
<template>
    <div class="select-btn-main">
        <div>{{ props.content === "" ? "Value" : props.content }}</div>
    </div>
</template>
<style scoped>
.select-btn-main {
    margin: 5px;
    padding: 5px;
    border-radius: 7px;
    height: fit-content;
    width: fit-content;
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: small;
    background-color: rgba(30, 143, 255, 0.1);
    color: dodgerblue;
    transition: all 0.1s;
}
.select-btn-main:hover {
    background-color: rgba(30, 143, 255, 0.2);
}
</style>