
import { v4 as uuidv4 } from "uuid";
import { generateVarID } from "./variableUtil"

let contextPool = [[]]

/**
 * Single element template. ID is the real var name using in program to avoid unsupported character type
 */
const varElement = {
    id: null,
    key: null,
}

/**
 * Create a new local scope to the pool, always add one to the end
 */
export function createNewScope() {
    contextPool.push([])
}

/**
 * Check whether the variable name exists in the indicated scope
 * @param {Number} scope Target scope that wants to find
 * @param {String} name Variable key name
 * @returns Returns true if exists, otherwise return false
 */
function isNameExistsInScope(scope, name) {
    for (let i = 0; i < contextPool[scope].length; i++) {
        if (contextPool[scope][i].key === name) {
            return true
        }
    }
    return false
}

/**
 * Check whether the variable name exists globally
 * @param {String} name Variable key name
 * @returns Returns true if exists, otherwise return false
 */
function isNameExistsGlobally(name) {
    for (let j = 0; j < contextPool.length; j++) {
        for (let i = 0; i < contextPool[j].length; i++) {
            if (contextPool[j][i].key === name) {
                return true
            }
        }
    }
    return false
}

/**
 * Check whether a scope is exists
 * @param {Number} scope Number of the scope
 * @returns Returns true if target scope does exists, otherwise returns false
 */
export function isScopeExists(scope) {
    return scope < contextPool.length
}

/**
 * Delete the last scope in the pool, return the deleted item
 * @returns The last scope element, which is a list
 */
export function deleteScope() {
    let returnElement = contextPool[contextPool.length - 1]
    contextPool.splice(contextPool.length - 1, 1)
    return returnElement
}

/**
 * Create a new scope variable 
 * @param {Number} scope Target scope num that the variable would add on
 * @param {String} name The name of the variable (User Friendly Name)
 * @returns Returns true with the created object if added successfully, otherwise returns false in an array.
 */
export function createScopeVariable(scope, name) {
    if (scope >= contextPool.length) {
        return [false]
    }
    let newObj = {
        id: generateVarID(),
        name: name
    }
    contextPool[scope].push(newObj)
    return [true, newObj]
}

/**
 * Delete a context variable from scope
 * @param {Number} scope The target scope
 * @param {String} id The ID of the scope variable
 * @returns Returns true if delete successfully, returns false if var does not exist
 */
export function deleteScopeVariable(scope, id) {
    for (let i = 0; i < contextPool[scope].length; i++) {
        if (contextPool[scope][i].id === id) {
            contextPool[scope].splice(i, 1);
            return true
        }
    }
    return false
}

/**
 * Get all context variables from scopes
 * @param {Number} scope Current scope that object requires
 * @returns Full list of context variables from the global scope to current scope in an array
 */
export function getCurrentContextVariables(scope) {
    let result = []
    for (let i = 0; i < scope; i++) {
        result.push([...contextPool[i]])
    }
    return result
}