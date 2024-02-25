<script setup>
import {getCurrentLanguage} from "../js/languageUtil"
import {getBlockInfo} from "../js/blockLoaderUtil"
import {ref, computed} from "vue"
import BlockSelectableElement from "./Selectable/BlockSelectableElement.vue";

const props = defineProps(["currentID"])

/**
 * Get all tabs info. In future embedding in apps, will also add support to load local third party language extensions
 */
 const tabsInfo = computed(()=>{
    let list = getBlockInfo()
    console.log(list[0]["name"][getCurrentLanguage()])
    let result = []
    for (let i = 0; i < list.length; i++) {
        result.push({
            "id": list[i]["id"],
            "name": list[i]["name"][getCurrentLanguage()],
            "blocks": list[i]["blocks"]
        })
    }
    return result
})

</script>
<template>
    <div class="temp">
        <div>Print</div>
        <BlockSelectableElement :index="0" :accept-type="['var', 'value']"></BlockSelectableElement>
    </div>
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