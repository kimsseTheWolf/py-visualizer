<script setup>
const props = defineProps(["isActive"])
</script>
<template>
    <div class="item" :class="{'active': props.isActive}">
        <slot></slot>
    </div>
</template>
<style scoped>
.item {
    margin-bottom: 5px;
    padding: 7px;
    border-radius: 5px;
    height: fit-content;
    cursor: pointer;
    transition: all 0.1s;
    font-size: small;
}
.item:hover {
    background-color: rgba(0, 0, 0, 0.1);
}
.active {
    color: rgb(22, 110, 198);
    background-color: rgba(30, 143, 255, 0.1);
}
.active:hover {
    background-color: rgba(30, 143, 255, 0.2);
}
</style>