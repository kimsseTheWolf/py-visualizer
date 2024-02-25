
// This file will help the programs to load all block heinarchy json files and let them ready to use

import ioH from "../assets/blockHienarchy/io.json" assert {type: "json"}
import cfH from "../assets/blockHienarchy/cf.json" assert {type: "json"}
import varH from "../assets/blockHienarchy/var.json" assert {type: "json"}

let packageList = [ioH, cfH, varH]

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