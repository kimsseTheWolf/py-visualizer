<script setup>
import { Tag } from 'ant-design-vue';

const props = defineProps(["varProps"])

const colors= {
    Number: "blue",
    String: "orange",
    Bool: "green"
}
</script>
<template>
    <Tag :color="colors[props['varProps'].type]" style="font-size: 15px; padding: 5px;">{{props['varProps'].key}}</Tag>
</template>
<style scoped>
</style>