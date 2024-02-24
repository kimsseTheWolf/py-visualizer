
// keysUtil is a place to record all keywords that will need within the program

const prefix = "lazer:"

export const localStorageKeys = {
    language: prefix + "lang"
}

/**
 * Check whether the key is in the localStorage
 * @param {String} keyName the key name for the localStorage
 * @returns Whether the field is exist or not
 */
export function isKeyNotSetup(keyName) {
    return localStorage.getItem(keyName) === null || localStorage.getItem(keyName) === undefined
}