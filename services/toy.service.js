const fs = require('fs')
const { resolve } = require('path')

const gToys = require('../data/toys.json')

module.exports = {
    query,
    getById,
    remove,
    save,
}

function query(filterBy) {
    return Promise.resolve(_filter(filterBy))
}

function getById(toyId) {
    const toy = gToys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}

function remove(toyId) {
    const idx = gToys.findIndex(toy => toy._id === toyId)
    console.log(`idx:`, idx)
    if (idx < 0) return
    gToys.splice(idx, 1)
    return _saveToysToFile()
}

function _filter(filterBy) {
    const { name, label, sort, inStock } = filterBy

    const regex = new RegExp(name, 'i')
    let filteredToys = gToys.filter(toy => regex.test(toy.name))

    sort === 'name' ?
        filteredToys.sort((toy1, toy2) => toy1[sort].localeCompare(toy2[sort])) :
        filteredToys.sort((toy1, toy2) => toy2[sort] - toy1[sort])
    // filteredToys = filteredToys.filter(toy => toy.inStock)

    // if (label !== 'All') filteredToys = filteredToys.filter(toy => toy.labels.includes(label))

    return filteredToys
}

function save(toy) {
    if (toy._id) {
        const idx = gToys.findIndex((currToy) => currToy._id === toy._id)
        gToys[idx] = toy
    } else {
        toy._id = _makeId()
        gToys.unshift(toy)
    }
    return _saveToysToFile().then(() => toy)
}

function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(gToys, null, 2)
        fs.writeFile('./data/toys.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

function _makeId(length = 5) {
    var txt = ''
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

