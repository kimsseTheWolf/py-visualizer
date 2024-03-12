<script setup>
import { Tag, Popover, List, ListItem, ListItemMeta, Flex, Button } from 'ant-design-vue';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons-vue";
import { ref } from 'vue';

const props = defineProps(["varProps"])

const colors= {
    Number: "blue",
    String: "orange",
    Bool: "green"
}

const interfaceControl = ref({
    showHoverPopover: false,
    showClickedPopover: false
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
</script>
<template>
    <Popover :open="interfaceControl.showHoverPopover" :title="props['varProps'].key + '详情'" trigger="hover" placement="topLeft" @open-change="handleHoverChange">
        <template #content>
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
                <ListItem>
                    <b>变量ID：</b> {{ props['varProps'].id }}
                </ListItem>
            </List>
        </template>
        <Popover :open="interfaceControl.showClickedPopover" :title="props['varProps'].key + '详情'" trigger="click" placement="topLeft" @open-change="handleClickChange">
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
                        <ListItem>
                            <b>变量ID：</b> {{ props['varProps'].id }}
                        </ListItem>
                    </List>
                    <Flex :vertical="false" gap="small">
                        <Button type="text"><EditOutlined/>修改</Button>
                        <Button type="text" danger><DeleteOutlined/>删除</Button>
                    </Flex>
                </Flex>
            </template>
            <Tag :color="colors[props['varProps'].type]" style="font-size: 15px; padding: 5px;">{{props['varProps'].key}}</Tag>
        </Popover>
    </Popover>
</template>
<style scoped>
</style>