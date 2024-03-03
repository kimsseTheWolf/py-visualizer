<script setup>
import draggable from "vuedraggable"
import {ref, computed} from "vue"
import {getCurrentLanguage} from "../js/languageUtil"
import {getBlockInfo} from "../js/blockLoaderUtil"
import Block from "./Block.vue"
import { Dropdown, Menu, MenuItem } from "ant-design-vue"

const currentBlocks = ref([])

/**
 * This element will contains full information and unite them into a map for quick rendering
 */
const fullBlockInfoList = computed(()=>{
    let fullBlockInfo = {}
    const blocks = getBlockInfo()
    for (let i = 0; i < blocks.length; i++) {
        for (let j = 0; j < Object.keys(blocks[i]["blocks"]).length; j++) {
            const currKeyName = Object.keys(blocks[i]["blocks"])[j]
            fullBlockInfo[currKeyName] = blocks[i]["blocks"][currKeyName]
        }
    }
    return fullBlockInfo
})

</script>
<template>
    <div class="main-box">
        <div>
            {{ currentBlocks }}
        </div>
        <draggable
        :list="currentBlocks"
        group="blocks"
        item-key="id">
            <template #item="{ element }">
                <Dropdown :trigger="['contextmenu']">
                    <template #overlay>
                        <Menu>
                            <MenuItem>Delete</MenuItem>
                        </Menu>
                    </template>
                    <Block :id="element" :content-template="fullBlockInfoList[element]['visualize'][getCurrentLanguage()]" :code-template="fullBlockInfoList[element]['code']"></Block>
                </Dropdown>
            </template>
        </draggable>
    </div>
</template>
<style scoped>
.main-box {
    display: flex;
    flex-direction: column;
}
</style>