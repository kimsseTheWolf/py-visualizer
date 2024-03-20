<script setup>
import { Tag, Popover, List, ListItem, ListItemMeta, Flex, Button, Modal, Input, InputNumber, Select, SelectOption, Form, FormItem, message, Empty, Alert } from 'ant-design-vue';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from "@ant-design/icons-vue";
import { ref } from 'vue';
import { dataTypes } from "../js/variableUtil"

const props = defineProps(["varProps", "enableOnClick"])
const emits = defineEmits(["onDelete", "onModify", "click"])

const colors= {
    Number: "blue",
    String: "orange",
    Bool: "green",
    List: "purple",
    Dictionary: "red"
}

const interfaceControl = ref({
    showHoverPopover: false,
    showClickedPopover: false,
    showModifyModal: false,
    showNewKeyArea: false
})

const interfaceData = ref({
    newKeyName: "",
    newKeyValue: ""
})

const newVarValue = ref({
    Number: 0,
    String: "",
    Bool: false,
    List: [],
    Dictionary: {}
})

function closePopover() {
    interfaceControl.value.showClickedPopover = false
    interfaceControl.value.showHoverPopover = false
}

function handleHoverChange(visible) {
    interfaceControl.value.showHoverPopover = visible
    interfaceControl.value.showClickedPopover = false
}

function handleClickChange(visible) {
    interfaceControl.value.showHoverPopover = false
    interfaceControl.value.showClickedPopover = visible
}

function handleDelete() {
    emits("onDelete", props.varProps.id)
}

function handleOpenModal() {
    // apply the current value to the modify value first
    newVarValue.value[props['varProps'].type] = props['varProps'].value
    interfaceControl.value.showModifyModal = true
}

function handleOnValueChange() {
    const newValueInfo = {
        id: props['varProps'].id,
        type: props['varProps'].type,
        value: JSON.parse(JSON.stringify(newVarValue.value[props['varProps'].type]))
    }
    emits("onModify", newValueInfo)
    message.info("已修改变量")
    interfaceControl.value.showModifyModal = false
}

function addListItem() {
    newVarValue.value.List.push("")
}

function removeListItem(index) {
    newVarValue.value.List.splice(index, 1)
}

function addDictionaryItem(key, value) {
    newVarValue.value.Dictionary[interfaceData.value.newKeyName] = interfaceData.value.newKeyValue
    interfaceData.value.newKeyName = ""
    interfaceData.value.newKeyValue = ""
}

function removeDictionaryItem(key) {
    delete newVarValue.value.Dictionary[key]
}

function handleOnClick() {
    if (props.enableOnClick === true) {
        emits("click")
    }
}
</script>
<template>
    <Popover :title="props['varProps'].key + '详情'" placement="topLeft" style="z-index: 10000;">
        <template #content>
            <Flex :vertical="true" gap="small">
                <List size="small">
                    <ListItem>
                        <b>变量名称：</b> {{ props['varProps'].key }}
                    </ListItem>
                    <ListItem>
                        <b>变量类型：</b> <Tag :color="colors[props['varProps'].type]"> {{ props['varProps'].type }}</Tag>
                    </ListItem>
                    <ListItem>
                        <b>变量初始值：</b> {{ props['varProps'].value }}
                    </ListItem>
                    <ListItem v-if="!enableOnClick">
                        <b>变量ID：</b> {{ props['varProps'].id }}
                    </ListItem>
                </List>
                <Flex :vertical="false" gap="small" v-if="!enableOnClick">
                    <Button type="text" @click="handleOpenModal()"><EditOutlined/>修改</Button>
                    <Button type="text" danger @click="handleDelete"><DeleteOutlined/>删除</Button>
                </Flex>
            </Flex>
        </template>
        <Tag :color="colors[props['varProps'].type]" style="font-size: 15px; padding: 5px; cursor: pointer;" @click="handleOnClick">{{props['varProps'].key}}</Tag>
    </Popover>
    <Modal title="修改变量初始值" v-model:open="interfaceControl.showModifyModal">
        <Flex :vertical="true" gap="small">
            <div>变量初始值编辑</div>
            <InputNumber v-if="props['varProps'].type === dataTypes.number" v-model:value="newVarValue.Number"></InputNumber>
            <Input v-if="props['varProps'].type === dataTypes.string" v-model:value="newVarValue.String"></Input>
            <Select v-if="props['varProps'].type === dataTypes.boolean" v-model:value="newVarValue.Bool">
                <SelectOption :value="true">True</SelectOption>
                <SelectOption :value="false">False</SelectOption>
            </Select>
            <Form v-if="props['varProps'].type === dataTypes.list" style="max-height: 500px; overflow-y: auto;">
                <FormItem>
                    <Button type="primary" @click="addListItem"><PlusCircleOutlined/>添加新的列表项</Button>
                </FormItem>
                <FormItem v-if="newVarValue.List.length === 0">
                    <Empty description="空列表，点击添加按钮添加第一个列表项"/>
                </FormItem>
                <FormItem v-for="({i}, index) in newVarValue.List">
                    <Flex :vertical="false" gap="small">
                        <DeleteOutlined @click="removeListItem(index)"/>
                        <Input v-model:value="newVarValue.List[index]" placeholder="在此处输入列表对应的元素"></Input>
                    </Flex>
                </FormItem>
            </Form>
            <Form v-if="props['varProps'].type === dataTypes.dictionary" style="max-height: 500px; overflow-y: auto;">
                <Alert message="不要设置相同的键值，否则某些功能将会异常！" type="warning" closable banner style="margin-bottom: 10px;"></Alert>
                <FormItem>
                    <Button type="primary" @click="interfaceControl.showNewKeyArea = !interfaceControl.showNewKeyArea"><PlusCircleOutlined/>添加新的键</Button>
                </FormItem>
                <FormItem v-if="interfaceControl.showNewKeyArea">
                    <Flex :vertical="false" gap="small" align="center">
                        <Flex :vertical="true" gap="small">
                            <div>键名称</div>
                            <Input v-model:value="interfaceData.newKeyName"></Input>
                        </Flex>
                        <Flex :vertical="true" gap="small">
                            <div>值</div>
                            <Input v-model:value="interfaceData.newKeyValue"></Input>
                        </Flex>
                        <Flex :vertical="true" gap="small">
                            <div>&nbsp;</div>
                            <Button type="primary" @click="addDictionaryItem(interfaceData.newKeyName, interfaceData.newKeyValue)">创建</Button>
                        </Flex>
                    </Flex>
                </FormItem>
                <FormItem v-if="Object.keys(newVarValue.Dictionary).length === 0">
                    <Empty description="空字典，点击添加按钮添加第一个字典项"/>
                </FormItem>
                <FormItem v-for="i in Object.keys(newVarValue.Dictionary)">
                    <Flex :vertical="false" gap="small">
                        <DeleteOutlined @click="removeDictionaryItem(i)"/>
                        <div style="width:15%">{{ i }}</div>
                        <Input v-model:value="newVarValue.Dictionary[i]" placeholder="在此处输入列表对应的元素"></Input>
                    </Flex>
                </FormItem>
            </Form>
        </Flex>
        <template #footer>
            <Button type="primary" @click="handleOnValueChange()">应用</Button>
            <Button @click="interfaceControl.showModifyModal = false">取消</Button>
        </template>
    </Modal>
</template>
<style scoped>
</style>