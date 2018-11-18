const express =  require('express')
const coreMethods = require('./utils/core')
let json_data = require('../data/sample.json')
const fs = require('fs')
const app = express()
const port = process.env.PORT || 3000 

app.use(express.json())

// Route to return all the available JSON data
app.get('/api', (req, res) => {
    res.send(json_data)
})

// Route to return data based on page number and size
app.get('/api/customers', (req, res) => {
    let query = req.query
    if(query) {
        res.send(coreMethods.paginate(json_data, req.query))
    } else {
        res.send("Request Headers are empty")
    }
})

// Route to return data by filter and/or Sort with added pagination as header
app.post('/api/customers', (req, res) => {
    let query = req.query
    const reqBody = req.body
    if(!reqBody.hasOwnProperty('sort') && !reqBody.hasOwnProperty('filter')) {
        res.status(400).send("Request body is empty")
    } else {
        let pageData = json_data
        // Filter
        if(reqBody['filter']) {
            pageData = coreMethods.filterBy(pageData, reqBody['filter'])
        }
        // Sort
        if(reqBody['sort']) {
            pageData = coreMethods.sortBy(pageData, reqBody['sort'])
        }
        // Paginate
        if(query) {
            res.send(coreMethods.paginate(pageData, req.query))
        } else {
            res.send(pageData)
        }
    }
})

// Adds a new record
app.post('/api/addRecord', (req, res) => {
    if(!req.body.first_name || !req.body.last_name || !req.body.age) {
        res.status(400).send('First Name, Last Name and Age is required.')
        return;
    }
    const {first_name, last_name, age} = req.body
    const recordObj = {
        id: json_data.length + 1,
        first_name: first_name,
        last_name: last_name,
        age: age,
        email: req.body.email || "",
        gender: req.body.gender || ""
    }
    json_data.push(recordObj)
    res.send(recordObj)
    fs.writeFile('../data/sample.json', JSON.stringify(json_data), 'utf8', (error) => {
        console.log("Write Error")
    })
})

// Default Route
app.get('/', (req, res) => {
    res.send('Use /api/customers or /api/utils to access the REST endpoints. For payload options, refer docs')
})

app.listen(port)