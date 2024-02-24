
import {localStorageKeys, isKeyNotSetup} from "./keysUtil"

export const languages = {
    enUS: {
        name: "United States English",
        value: "en-US"
    },
    zhCN: {
        name: "简体中文",
        value: "zh-CN"
    }
}

/**
 * Initialize the language records and services
 */
export function initializeLanguage() {
    if (isKeyNotSetup(localStorageKeys.language)) {
        // initialize a var for the language
        localStorage.setItem(localStorageKeys.language, languages.enUS)
    }
}

/**
 * Get current using language
 * @returns Current language's value
 */
export function getCurrentLanguage() {
    return localStorage.getItem(localStorageKeys.language)
}

/**
 * Set the current language
 * @param {String} langKey the key value of the languages, from the dict `languages`
 */
export function setCurrentLanguage(langKey) {
    localStorage.setItem(localStorageKeys.language, langKey)
}