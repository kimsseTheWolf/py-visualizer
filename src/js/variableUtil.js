
import { v4 as uuidv4 } from "uuid";

/**
 * Place where store all created variables
 */
let varPool = []

/**
 * Single element template. ID is the real var name using in program to avoid unsupported character type
 */
const varElement = {
    id: null,
    key: null,
    type: undefined,
    value: undefined
}

/**
 * All accepted dataTypes
 */
export const dataTypes = {
    number: "Number",
    string: "String",
    boolean: "Bool",
    list: "List",
    dictionary: "Dictionary"
}

/**
 * Check the existance of a variable
 * @param {String} key The name of the variable
 * @returns {Boolean} Whether the variable exists
 */
function isNameExists(key) {

    for (let i = 0; i < varPool.length; i++) {
        if (varPool[i]["key"] === key) {
            return true;
        }
    }
    return false;
}

/**
 * Generate an ID for the variable
 * @returns ID for the variable
 */
function generateVarID() {
    let targetID = uuidv4()

    // replace all "-" to "_"
    targetID = targetID.replace(/-/g, "_")
    return "var_id_" + targetID
}

export function createNewVar(key, type, value=null) {
    // check existance
    if (isNameExists(key)) {
        return false;
    }

    // create a new variable
    let newVar = {
        id: generateVarID(),
        key: key,
        type: type,
        value: value
    }

    // append
    varPool.push(newVar)
    return newVar
}

// TODO: modify
/**
 * Change the value of the variable
 * @param {String} id Name of the variable
 * @param {any} value The new value of the variable
 * @returns Success
 */
export function setValue(id, value) {
    for (let i = 0; i < varPool.length; i++) {
        if (varPool[i].id === id) {
            varPool[i].value = value
            return true
        }
    }
    return false
}

/**
 * Change the variable name
 * @param {String} id The ID of the string
 * @param {String} newKey The new name of the string
 * @returns Success
 */
export function changeVarSignature(id, newKey) {
    for (let i = 0; i < varPool.length; i++) {
        if (varPool[i].id === id) {
            varPool[i].key = newKey
            return true
        }
    }
    return false
}

// TODO: getVar
export function getValue(key) {
    for (let i = 0; i < varPool.length; i++) {
        if (varPool[i].key === key) {
            return varPool[i]
        }
    }
    return undefined
}

export function getAll() {
    return [...varPool]
}

// TODO: delete
export function deleteVar(id) {
    let i = 0;
    let found = false
    for (; i < varPool.length; i++) {
        if (varPool[i].id === id) {
            found = true
            break;
        }
    }
    if (found) {
        varPool.splice(i, 1);
        return true
    }
    return false
}

export function deleteAll() {
    varPool = []
}