import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor';
import './style.css';
import {createI18n} from "vue-i18n"
import {languages, getCurrentLanguage} from "./js/languageUtil"

import enUS from "./locales/enUS.json" assert {type: "json"}
import zhCN from "./locales/zhCN.json" assert {type: "json"}

const i18n = createI18n({
    locale: getCurrentLanguage(),
    legacy: false,
    fallbackLocale: languages.enUS.value,
    messages: {
        "en-US": enUS,
        "zh-CN": zhCN
    }
})

createApp(App).use(Antd).use(i18n).use(VueMonacoEditorPlugin, {
    paths: {
        vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs"
    }
}).mount('#app')
