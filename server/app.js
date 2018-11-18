const express =  require('express')
const coreMethods = require('./utils/core')
const json_data = require('../data/sample.json')
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

// Default Route
app.get('/', (req, res) => {
    res.send('Use /api/customers or /api/utils to access the REST endpoints. For payload options, refer docs')
})

app.listen(port)