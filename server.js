const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const toyService = require('./services/toy.service')

const app = express()

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

const corsOptions = {
    origin: [
        'http://127.0.0.1:8080',
        'http://localhost:3030',
        'http://127.0.0.1:3030',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        'http://localhost:3000',
        'http://127.0.0.1:3031',
        'http://localhost:3031',

    ],
    credentials: true,
}

app.use(cors(corsOptions))

// Express Routing: 
const BASE_URL = '/api/toy/'
// LIST
app.get(BASE_URL, (req, res) => {
    console.log(`12:`,)
    let { name, label, sort, inStock } = req.query

    const filterBy = {
        name: name || '',
        label: label || '',
        sort: sort || 'name',
        // inStock: JSON.parse(inStock) || '' // parse 'Boolean' (true / false as strings) to regular boolean
    }
    toyService.query(filterBy)
        .then(toys => res.send(toys))
})

// READ
app.get(BASE_URL + ':toyId', (req, res) => {
    const { toyId } = req.params
    toyService.getById(toyId)
        .then(toy => res.send(toy))
})

// ADD
app.post(BASE_URL, (req, res) => {
    const { name, price, inStock, createdAt, labels, reviews } = req.body
    const toy = {
        name,
        price,
        inStock,
        createdAt,
        labels,
        reviews
    }
    toyService.save(toy)
        .then(savedToy => res.send(savedToy))
})

// UPDATE
app.put(BASE_URL + ':toyId', (req, res) => {
    const { _id, name, price, inStock, createdAt, labels, reviews } = req.body
    const toy = {
        _id,
        name,
        price,
        inStock,
        createdAt,
        labels,
        reviews
    }
    toyService.save(toy)
        .then(savedToy => res.send(savedToy))
})

// DELETE
app.delete(BASE_URL + ':toyId', (req, res) => {
    const { toyId } = req.params
    console.log(`toyId:`, toyId)
    toyService.remove(toyId)
        .then(() => {
            res.send(`toy ${toyId} Removed!`)
        })
})

// LOGIN
app.post('/login', (req, res) => {
    res.cookie('user', req.body)
    res.send('Logging in')
})
// LOGOUT
app.post('/logout', (req, res) => {
    res.clearCookie('loggedInUser')
    res.clearCookie('user')
    res.send('Logging out')
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server listening on ${port} http://127.0.0.1:${port}/`))