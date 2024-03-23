<script setup>
import { Dropdown, Menu, MenuItem, MenuDivider, Button, Input, Tabs, TabPane, Modal, ButtonGroup, Select, SelectOption, message, Flex, Textarea, notification } from 'ant-design-vue';
import {
  UploadOutlined, 
  SaveOutlined, 
  ExportOutlined, 
  CopyOutlined, 
  PaperClipOutlined,
  EditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  InfoCircleOutlined,
  GithubOutlined,
  GlobalOutlined
} from '@ant-design/icons-vue'
import { ref, computed } from 'vue';
import MenuBtn from "./components/MenuBtn.vue"
import BlockSectionSelector from "./components/BlockSectionSelector.vue";
import BlockPanel from "./components/BlockPanel.vue";
import CommandPanel from "./components/CommandPanel.vue";
import {initializeLanguage, languages, getCurrentLanguage, setCurrentLanguage} from "./js/languageUtil"
import {getBlockInfo} from "./js/blockLoaderUtil"
import { useI18n } from "vue-i18n";

initializeLanguage()

const {t} = useI18n()

const fileName = ref("")
const interfaceControl = ref({
  showFileNameInput: false,
  showCodePreview: true,
  showLanguageModal: false,
  showOpenFileModal: false,
  showSaveContentModal: false,
  onSaveTrigger: false,
  onLoadTrigger: false
})
const interfaceData = ref({
  blockTabActiveKey: "basic.io",
  currentSelectedLang: getCurrentLanguage(),
  openedFileContent: "",
  convertedOpenedFileContent: {},
  savedContent: []
})
const VSOPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  readOnly: true
}
const WorkPanelFlex = computed(()=> {
  if (interfaceControl.value.showCodePreview) {
    return {flex: "2"}
  }
  else {
    return {flex: "4"}
  }
})
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

const commandPanelValue = ref([])

/**
 * Get the event from the tab box. Change the blocks to the contents that belongs to the tab. (Handler)
 * @param {String} tabID The received target tabID
 */
function onTabChangeHandler(tabID) {
    interfaceData.value.blockTabActiveKey = tabID
    console.log("Tab changed")
}

function handleSetLanguage() {
  setCurrentLanguage(interfaceData.value.currentSelectedLang)
  message.success("Success! In order to take effect, save your work and refresh this page")
}

function triggerOnSave() {
  interfaceControl.value.onSaveTrigger = true
}

function handleOnSave(_setter, savedContent) {
  interfaceControl.value.onSaveTrigger = false
  interfaceData.value.savedContent = JSON.stringify(savedContent)

  // trigger on save modal
  interfaceControl.value.showSaveContentModal = true
}

function triggerOnLoad() {
  console.log("Triggered")
  try {
    interfaceData.value.convertedOpenedFileContent = JSON.parse(interfaceData.value.openedFileContent)
    console.log(interfaceData.value.convertedOpenedFileContent)
  } catch (error) {
    notification.error("Unable to load metadata file: Syntax error or file corrupted!")
    return
  }
  interfaceControl.value.onLoadTrigger = true
}

function handleOnLoad() {
  interfaceControl.value.onLoadTrigger = false
}
</script>

<template>
  <div class="main-window">
    <div class="title-bar">
      <div style="width: 20px;">&nbsp;</div>
      <div class="column item">
        <div class="row">
          <div class="file-name item" style="margin-left: 5px;">
            <div v-if="!interfaceControl.showFileNameInput">{{ fileName === "" ? t('toolBar.defaultNewFileName') : fileName }}</div>
            <Input v-if="interfaceControl.showFileNameInput" placeholder="New File Name" v-model:value="fileName"/>
          </div>
          <Button type="primary" size="small" @click="interfaceControl.showFileNameInput = !interfaceControl.showFileNameInput">
            <EditOutlined/>
            {{ t('toolBar.changeNameButton') }}
          </Button>
        </div>
        <div class="row" style="margin-bottom: 0;">
          <Dropdown>
            <MenuBtn>{{ t('toolBar.menu.file.title') }}</MenuBtn>
            <template #overlay>
              <Menu>
                <MenuItem key="1" @click="interfaceControl.showOpenFileModal = true">
                  <UploadOutlined/>
                  {{ t('toolBar.menu.file.upload') }}
                </MenuItem>
                <MenuItem key="2" @click="triggerOnSave">
                  <SaveOutlined/>
                  {{ t('toolBar.menu.file.save') }}
                </MenuItem>
                <MenuItem key="3">
                  <ExportOutlined/>
                  {{ t('toolBar.menu.file.exportMetacode') }}
                </MenuItem>
                <MenuItem key="4">
                  <ExportOutlined/>
                  {{ t('toolBar.menu.file.exportPython') }}
                </MenuItem>
              </Menu>
            </template>
          </Dropdown>
          <Dropdown>
            <MenuBtn>{{ t('toolBar.menu.edit.title') }}</MenuBtn>
            <template #overlay>
              <Menu>
                <MenuItem key="1">
                  <CopyOutlined/>
                  {{ t('toolBar.menu.edit.copy') }}
                </MenuItem>
                <MenuItem key="2">
                  <PaperClipOutlined/>
                  {{ t('toolBar.menu.edit.paste') }}
                </MenuItem>
                <MenuDivider/>
                <MenuItem key="3" @click="interfaceControl.showLanguageModal = true">
                  <GlobalOutlined/>
                  {{ t('toolBar.menu.edit.languages') }}
                </MenuItem>
              </Menu>
            </template>
          </Dropdown>
          <Dropdown>
            <MenuBtn>{{ t('toolBar.menu.views.title') }}</MenuBtn>
            <template #overlay>
              <Menu>
                <MenuItem key="1" @click="interfaceControl.showCodePreview = !interfaceControl.showCodePreview">
                  <EyeOutlined v-if="!interfaceControl.showCodePreview"/>
                  <EyeInvisibleOutlined v-if="interfaceControl.showCodePreview"/>
                  {{ t('toolBar.menu.views.codePreview') }}
                </MenuItem>
              </Menu>
            </template>
          </Dropdown>
          <Dropdown>
            <MenuBtn>{{ t('toolBar.menu.help.title') }}</MenuBtn>
            <template #overlay>
              <Menu>
                <MenuItem key="1">
                  <InfoCircleOutlined/>
                  {{ t('toolBar.menu.help.about') }}
                </MenuItem>
                <MenuItem key="2">
                  <GithubOutlined/>
                  {{ t('toolBar.menu.help.github') }}
                </MenuItem>
              </Menu>
            </template>
          </Dropdown>
        </div>
      </div>
    </div>

    <div class="main-body">
      <div class="block-panel panel">
        <BlockSectionSelector @on-tab-change="onTabChangeHandler"/>
        <BlockPanel :currentid="interfaceData.blockTabActiveKey"/>
      </div>
      <div class="work-panel panel" :style="WorkPanelFlex">
        <CommandPanel :save-trigger="interfaceControl.onSaveTrigger" @on-save-trigger="handleOnSave" :load-trigger="interfaceControl.onLoadTrigger" :load-file-content="interfaceData.convertedOpenedFileContent" @on-load-trigger="handleOnLoad"/>
      </div>
      <div class="code-panel panel" v-if="interfaceControl.showCodePreview">
        <vue-monaco-editor
        theme="vs-light"
        language="python"
        :options="VSOPTIONS"
        />
      </div>
    </div>
  </div>


  <Modal :title="t('toolBar.languageSelector.title')" v-model:visible="interfaceControl.showLanguageModal">
    <div style="display: flex; flex-direction: column;">
      <div>{{ t('toolBar.languageSelector.direction') }}</div>
      <Select v-model:value="interfaceData.currentSelectedLang" style="margin-top: 5px;">
        <SelectOption v-for="i in languages" :value="i.value">{{ i.name }}</SelectOption>
      </Select>
      <div style="margin-top: 5px;">{{ t('toolBar.languageSelector.community1') }}</div>
      <div style="margin-top: 5px;">{{ t('toolBar.languageSelector.community2') }}</div>
    </div>
    <template #footer>
      <Button type="primary" @click="handleSetLanguage">Apply</Button>
      <Button @click="interfaceControl.showLanguageModal = !interfaceControl.showLanguageModal">Cancle</Button>
    </template>
  </Modal>

  <Modal title="Upload file" v-model:open="interfaceControl.showOpenFileModal">
    <Flex :vertical="true" gap="small">
      <div>Copy and paste Metadata file content to the textbox below:</div>
      <Textarea :bordered="false" :auto-size="{ minRows: 2, maxRows: 10 }" placeholder="Copy and paste content here" v-model:value="interfaceData.openedFileContent"></Textarea>
    </Flex>
    <template #footer>
      <Button type="primary" @click="triggerOnLoad">Load</Button>
      <Button @click="interfaceControl.showOpenFileModal = false">Cancel</Button>
    </template>
  </Modal>
  <Modal title="Save file" v-model:visible="interfaceControl.showSaveContentModal">
    <div>Copy and paste Metadata file content to the textbox below:</div>
    <Textarea :bordered="false" :auto-size="{ minRows: 2, maxRows: 10 }" v-model:value="interfaceData.savedContent" readonly></Textarea>
    <template #footer>
        <Button @click="interfaceControl.showSaveContentModal = false">Cancel</Button>
      </template>
  </Modal>
</template>

<style scoped>

</style>
