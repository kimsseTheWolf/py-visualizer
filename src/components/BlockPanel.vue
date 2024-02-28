<script setup>
import {getCurrentLanguage} from "../js/languageUtil"
import {getBlockInfo} from "../js/blockLoaderUtil"
import {ref, computed} from "vue"
import BlockSelectableElement from "./Selectable/BlockSelectableElement.vue";
import Block from "./Block.vue";

const props = defineProps(["currentid"])

const blocks = ref([])

const currentBlocks = computed(()=>{
    blocks.value = getBlockInfo()
    console.log(blocks.value)
    for (let i = 0; i < blocks.value.length; i++) {
        console.log(blocks.value[i], " ", props["currentid"])
        if (blocks.value[i].id === props["currentid"]) {
            console.log("Block information updated")
            console.log("Block value: ", blocks.value[i])
            return blocks.value[i];
        }
    }
    console.log("Nothing found!")
})

console.log("Properties: ", props["currentid"])

</script>
<template>
    <Block v-for="i in currentBlocks['blocks']" :id="i['code']" :content-template="i['visualize'][getCurrentLanguage()]" :code-template="i['code']"></Block>
</template>
<style scoped>
.temp {
    margin: 5px;
    padding: 5px;
    height: fit-content;
    border-radius: 7px;
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    align-items: center;
}
</style>