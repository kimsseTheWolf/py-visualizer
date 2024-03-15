
// This file will help the programs to load all block heinarchy json files and let them ready to use

import ioH from "../assets/blockHienarchy/io.json" assert {type: "json"}
import cfH from "../assets/blockHienarchy/cf.json" assert {type: "json"}
import varH from "../assets/blockHienarchy/var.json" assert {type: "json"}

let packageList = [ioH, cfH, varH]

const patterns = {
    paramter: /<([^>]+)>/,
    index: /\[([0-9]+)\]/g,
    acceptTypes: /accept:\s*\{([^}]+)\}/g
}

export function depre_testImport() {
    console.log(ioH)
}

/**
 * Return all blocks info
 * @returns The list with json objects to describe the block hienarchies
 */
export function getBlockInfo() {
    return packageList
}

/**
 * Read and get all slots info of a block from its template.
 * @param {String} contentTemplate The String template of the block
 * @returns A list of undefines with the exact size of slots that the block have
 */
export function parseBlockSlots(contentTemplate) {
    // reset
    let paramSlots = []
    let contents = []
    // console.log("Going through contentTemplate: " + contentTemplate)
    // iterate through the content template and seperate elements
    let contentSegment = ""
    let slotSegment = ""
    let isInSlot = false
    // iterate to seperate content
    for (let i = 0; i < contentTemplate.length; i++) {
        if (contentTemplate.charAt(i) === "<") {
            // register new state
            isInSlot = true
            slotSegment += "<"
            // commit content segment
            contents.push({
                type: "content",
                content: contentSegment
            })
            contentSegment = ""
        }
        else if (contentTemplate.charAt(i) === ">") {
            // register new state
            isInSlot = false
            slotSegment += ">"
            // commit param segment
            contents.push({
                type: "param",
                content: slotSegment,
                index: null,
                acceptTypes: []
            })
            slotSegment = ""
        }
        else {
            // normal append
            isInSlot ? slotSegment += contentTemplate.charAt(i) : contentSegment += contentTemplate.charAt(i)
        }
    }
    if (contentSegment !== "") {
        contents.push({
            type: "content",
            content: contentSegment
        })
        contentSegment = ""
    }
    if (slotSegment !== "") {
        contents.push({
            type: "param",
            content: slotSegment,
            index: null,
            acceptTypes: []
        })
        slotSegment = ""
    }

    let results = []
    // iterate to set param slot information
    for (let i = 0; i < contents.length; i++) {
        if (contents[i].type === "param") {
            results.push(undefined)
        }
    }
    return results
}