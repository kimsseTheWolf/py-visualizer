<script setup>
import { Dropdown, Menu, MenuItem } from 'ant-design-vue';
import {ref, computed} from "vue"
import BlockSelectableButton from './BlockSelectableButton.vue';
/**
 * Properties of the element. Index is to indicate which element it is, and acceptType is the value tells the element what things are accepted
 */
const props = defineProps(["index", "acceptType", "isInCommand"])
const btnContent = ref("")
const selectableValues = computed(()=>{
    let result = []
    for (let i = 0; i < props.acceptType.length; i++) {
        if (props.acceptType[i] === "var") {
            result.push({
                name: "Variable",
                value: "var"
            })
        }
        else if (props.acceptType[i] === "value") {
            result.push({
                name: "Value",
                value: "value"
            })
        }
    }
    return result
})
const interfaceControl = ref({
    openOverflow: false
})
const interfaceData = ref({
    selectedPage: []
})

</script>
<template>
    <Dropdown v-model:open="interfaceControl.openOverflow" v-if="props.isInCommand">
        <BlockSelectableButton :content="btnContent"/>
        <template #overlay>
            <div class="dropdown-main-box">
                <Menu v-model:selected-keys="interfaceData.selectedPage" mode="inline" class="inbox-menu">
                    <MenuItem v-for="i in selectableValues" :key="i.value">{{ i.name }}</MenuItem>
                </Menu>
                <div class="main-content-box">
                    <div v-if="interfaceData.selectedPage[0] === 'value'" class="content-box"></div>
                    <div v-else-if="interfaceData.selectedPage[0] === 'var'" class="content-box"></div>
                    <div v-else class="content-box full-center">
                        Choose a data type from the menu on the left
                    </div>
                </div>
            </div>
        </template>
    </Dropdown>
    <BlockSelectableButton :content="btnContent" v-if="!props.isInCommand"/>
</template>
<style scoped>
.dropdown-main-box {
    width: 50vh;
    height: 30vh;
    background-color: white;
    border-style: solid;
    border-width: 1px;
    border-color: rgba(0, 0, 0, 0.1);
    border-radius: 7px;
    padding: 5px;
    display: flex;
    flex-direction: row;

}

.inbox-menu {
    box-shadow: none !important;
}

.main-content-box {
    display: flex;
    flex-direction: row;
    flex: auto;
}

.content-box {
    display: flex;
    flex-direction: column;
    flex: auto;
    margin-left: 5px;
}

.full-center {
    justify-content: center;
    align-items: center;
    height: 100%;
}
</style>