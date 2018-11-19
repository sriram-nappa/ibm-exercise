const commonUtils = require('./common')
module.exports = {
    /**
     * @param  {Object} custObj
     * @param  {Object} filterObj
     */
    paginate: function (custObj, pageQuery) {
        let {page, size} = pageQuery
        // Default Page Size is set to 10
        if(!pageQuery.hasOwnProperty('size')) {
            size = 10
        }
        let startIndex = (page-1)*size
        let endIndex = page * size
        let pageData = custObj.slice(startIndex, endIndex)
        return pageData
    },
    /**
     * @param  {Object} custObj
     * @param  {Object} filterBody
     */
    filterBy: function (custObj, filterBody) {
        const filterOperators = {
            'starts-with': commonUtils.valueStartsWith,
            'greater-than': commonUtils.greaterThan,
            'contains': commonUtils.stringContains,
            'less-than': commonUtils.lessThan,
            'equal': commonUtils.dataEquals
        }
        let filterResult = []
        for (let i=0; i < custObj.length; i++) {
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
        return filterResult
    },
    /**
     * @param  {Object} custObj
     * @param  {Object} sortBody
     */
    sortBy: function (custObj, sortBody) {
        // Assumption : Max Fields that can be sorted is 3 and depends on the request fields order in the payload.
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
}