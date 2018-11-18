const express =  require('express')
const bodyParser = require('body-parser')
const json_data = require('../data/sample.json')
const app = express()

app.use(express.json())

paginate = (custObj, pageQuery) => {
    const {page, size} = pageQuery
    let startIndex = (page-1)*size
    let endIndex = page * size
    let pageData = custObj.slice(startIndex, endIndex)
    return pageData
}

valueStartsWith = (custObj, filterObj) => {
    let {field, value} = filterObj
    let custVal = custObj[field].toLowerCase()
    return custVal.startsWith(value.toLowerCase())
}

greaterThan = (custObj, filterObj) => {
    let {field, value} = filterObj
    return custObj[field] > value
}

lessThan = (custObj, filterObj) => {
    let {field, value} = filterObj
    return custObj[field] < value
}

stringContains = (custObj, filterObj) => {
    let {field, value} = filterObj
    let custVal = custObj[field].toLowerCase()
    return custVal.contains(value.toLowerCase())
}

dataEquals = (custObj, filterObj) => {
    let {field, value} = filterObj
    let custVal = custObj[field]
    if(typeof(custVal))
    return custObj[field] === value
}


filterBy = (custObj, filterBody) => {
    const filterOperators = {
        'starts-with': valueStartsWith,
        'greater-than': greaterThan,
        'contains': stringContains,
        'less-than': lessThan,
        'equal': dataEquals
    }
    let filterResult = []
    for (let i=0; i < custObj.length; i++) {
        let objResult = []
        let resultFlag = false
        for (let j = 0; j < filterBody.length; j++) {
            const filterObj = filterBody[j];
            resultFlag = filterOperators[filterObj['operator']](custObj[i], filterObj)
            if(!resultFlag){
                break
            }
        }
        if(resultFlag) {
            filterResult.push(custObj[i])
        }
    }
    console.log(filterResult)
    // return filterResult
}

sortBy = (custObj, sortBody) => {
    let fieldLen = sortBody.length
    custObj.sort(function(a, b){
        if(a[sortBody[0]['field']] == b[sortBody[0]['field']]){
            if(sortBody.length > 1 && a[sortBody[1]['field']] == b[sortBody[1]['field']]){
                if(sortBody.length > 2 && a[sortBody[2]['field']] == b[sortBody[2]['field']]){
                    if(sortBody[2]['sortType'] === 'asc')
                        return a[sortBody[2]['field']] < b[sortBody[2]['field']] ? -1 : 1
                    return a[sortBody[2]['field']] > b[sortBody[2]['field']] ? -1 : 1
                }
                if(sortBody[1]['sortType'] === 'asc')
                    return a[sortBody[1]['field']] < b[sortBody[1]['field']] ? -1 : 1
                return a[sortBody[1]['field']] > b[sortBody[1]['field']] ? -1 : 1
            }
        }
        if(sortBody[0]['sortType'] === 'asc')
            return a[sortBody[0]['field']] < b[sortBody[0]['field']] ? -1 : 1
        return a[sortBody[0]['field']] > b[sortBody[0]['field']] ? -1 : 1
    })
    return custObj
}

// Endpoint to return all the available JSON data
app.get('/api/customers', (req, res) => {
    res.send(json_data)
})

// Endpoint to return data based on page number and size
app.get('/api/util', (req, res) => {
    let query = req.query
    console.log(query)
    if(query) {
        res.send(paginate(json_data, req.query))
    } else {
        res.send("400:Bad Request")
    }
})

// Endpoint to return data based on page number and size
app.post('/api/util', (req, res) => {
    let query = req.query
    let reqBody = req.body
    // Filter
    let pageData = json_data
    console.log(reqBody)
    if(reqBody['filter']) {
        pageData = filterBy(pageData, reqBody['filter'])
    }
    // Sort
    if(reqBody['sort']) {
        pageData = sortBy(pageData, reqBody['sort'])
    }
    res.send(pageData)
    // console.log(query)
    // if(query) {
    //     res.send(paginate(json_data, req.query))
    // } else {
    //     res.send("400:Bad Request")
    // }
})


//Sort

app.get('/', (req, res) => {
    res.send('Use /api to access the REST endpoints')
})

app.listen(3000, () => console.log('Hello'))