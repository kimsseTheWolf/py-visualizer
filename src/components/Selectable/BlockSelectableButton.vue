<script setup>
import {ref} from "vue"
const props = defineProps(["content"])
</script>
<template>
    <div class="select-btn-main">
        <div>{{ props.content === "" ? "Undefined Value" : props.content }}</div>
    </div>
</template>
<style scoped>
.select-btn-main {
    margin: 5px;
    padding: 5px;
    border-radius: 7px;
    height: fit-content;
    width: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: small;
    background-color: dodgerblue;
    color: white;
    transition: all 0.1s;
}
.select-btn-main:hover {
    background-color: rgb(21, 102, 182);
}
</style>