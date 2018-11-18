module.exports = {
    /**
     * @param  {Object} custObj
     * @param  {Object} filterObj
     */
    valueStartsWith : function (custObj, filterObj) {
        let {field, value} = filterObj
        let custVal = custObj[field].toLowerCase()
        return custVal.startsWith(value.toLowerCase())
    },
    /**
     * @param  {Object} custObj
     * @param  {Object} filterObj
     */
    greaterThan : function (custObj, filterObj) {
        let {field, value} = filterObj
        return custObj[field] > value
    },
    /**
     * @param  {Object} custObj
     * @param  {Object} filterObj
     */  
    lessThan : function (custObj, filterObj) {
        let {field, value} = filterObj
        return custObj[field] < value
    },
    /**
     * @param  {Object} custObj
     * @param  {Object} filterObj
     */   
    stringContains : function (custObj, filterObj) {
        let {field, value} = filterObj
        let custVal = custObj[field].toLowerCase()
        return custVal.contains(value.toLowerCase())
    },
    /**
     * @param  {Object} custObj
     * @param  {Object} filterObj
     */   
    dataEquals : function (custObj, filterObj) {
        let {field, value} = filterObj
        let custVal = custObj[field]
        if(typeof(custVal))
        return custObj[field] === value
    }
} 