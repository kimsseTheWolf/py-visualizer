<script setup>
import { Tag, Popover, List, ListItem, ListItemMeta, Flex, Button, Modal, Input, InputNumber, Select, SelectOption, Form, FormItem } from 'ant-design-vue';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons-vue";
import { ref } from 'vue';
import { dataTypes } from "../js/variableUtil"

const props = defineProps(["varProps", "enableOnClick"])
const emits = defineEmits(["onDelete"])

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
                    <Button type="text" @click="interfaceControl.showModifyModal = true"><EditOutlined/>修改</Button>
                    <Button type="text" danger @click="handleDelete"><DeleteOutlined/>删除</Button>
                </Flex>
            </Flex>
        </template>
        <Tag :color="colors[props['varProps'].type]" style="font-size: 15px; padding: 5px; cursor: pointer;">{{props['varProps'].key}}</Tag>
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
            <Form v-if="props['varProps'].type === dataTypes.list">
                
            </Form>
            <Form v-if="props['varProps'].type === dataTypes.dictionary">
                
            </Form>
        </Flex>
        <template #footer>
            <Button type="primary">应用</Button>
            <Button @click="interfaceControl.showModifyModal = false">取消</Button>
        </template>
    </Modal>
</template>
<style scoped>
</style>