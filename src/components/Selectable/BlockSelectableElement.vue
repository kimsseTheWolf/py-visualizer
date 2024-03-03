<script setup>
import { Dropdown, Menu, MenuItem } from 'ant-design-vue';
import {ref, computed} from "vue"
import BlockSelectableButton from './BlockSelectableButton.vue';
/**
 * Properties of the element. Index is to indicate which element it is, and acceptType is the value tells the element what things are accepted
 */
const props = defineProps(["index", "acceptType"])
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
    <Dropdown v-model:open="interfaceControl.openOverflow">
        <BlockSelectableButton :content="btnContent"/>
        <template #overlay>
            <div class="dropdown-main-box">
                <Menu v-model:selected-keys="interfaceData.selectedPage" mode="inline" class="inbox-menu">
                    <MenuItem v-for="i in selectableValues" :key="i.value">{{ i.name }}</MenuItem>
                </Menu>
            </div>
        </template>
    </Dropdown>
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
</style>