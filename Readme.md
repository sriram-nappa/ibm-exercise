# Take Home Web Application for IBM

This web application is created as a part of IBM's interview process. The web application filters, sorts and paginates a list of JSON data based on the Query and Request Body sent.
 

## Minimum Requirements:

- nodejs
- curl 


## Table of Contents

[Usage](#usage)

[Endpoints](#endpoints)

[Utility Functions](#utility-functions)

[Future Improvements](#future-improvements)

### Usage

- cd server
- node index.js (Now the server should have started listening on Port 3000)
- Using curl/postman or any application, send POST/GET requests to the endpoints

### Endpoints
    
#### 1. /api
    
  This route returns all the data in the json file.
        
#### 2. /api/customers
    
  There are GET and POST calls that can be made to this endpoint:
  
**GET: (Parameters : page, size)**

The objects can be paginated based on the user's input from query parameters.
    
    /api/customers?page=:page&size=:size
    Eg: http://localhost:3000/api/customers/page=3&size=20 would return 20 objects on page 3. 
    
If the user doesn't set a size, the default value of size is taken to be 10.
    Eg: http://localhost:3000/api/customers/page=3 would return 10 objects on page 3.
    
If the page number is 0 or if it exceeds the maximum number of pages possible for the given query parameters, an empty list is returned.
    
    
**POST:**

##### FilterBy method:

The response can be filtered based on multiple parameters such as starts-with, equals, contains, greater-than, less-than.

###### Request Body:

Filter is applied only when there exists an object with key "filter" in the request body. The value of "filter" can
be a list of objects with keys "field", "operator" and "value".

"field" : The field on which filter has to be applied.
"operator": The filter operation to be applied on the given field. (Look at Operators section)
"value" : The value against which the given data has to be filtered.
    
    Eg:  
    
    {
       "filter": [
            {"field": "first_name", "operator": "starts-with", "value": "Aar"},
            {"field": "age", "operator": "greater-than", "value": 21},
            {"field": "first_name", "operator": "starts-with", "value": "C"},
	   ]  
    } 
    
The above filter would return all records that have First Name beginning with "Aar" and last name beginning with "C". 
All string operations done on the filter is NOT CASE-SENSITIVE.

Any number of filters can be provided or no filters can be provided.


##### SortBy Method:

###### RequestBody:

Sorting is applied if there exists an object with key "sort" in the Request Body. The value inside "sort" should be
a list of objects with the following keys: "field", "sortingType"

"field" : This is the field on which sorting has to be applied.
"sortingType" : The values can be either "asc" or "desc" (lowercase)
    
    Eg:
    
    {
      "sort": [{
          "field": "first_name",
          "sortType": "asc"
        },
        {
          "field": "last_name",
          "sortType": "desc"
        },
        {
          "field": "age",
          "sortType": "desc"
        }
      ]
    }
	
The above example sorts hte first_name in ascending order. If there are two first_name with the same value, then it sorts it based on 
last_name in descending order. If the last names are equal too, it sorts based on the agein descending order.

**IMPORTANT: A maximum of 3 columns can only be sorted at any given point.**
    
#### 3. /api/addRecord

    This route adds a new record to the file.
    
    Example request body:
      {
        "first_name":"Sriram",
        "last_name":"PC",
        "age": 26,
        "gender": "Male",
        "email" : "abc@gmail.com"
      }

    Attributes first_name, last_name and age are considered as mandatory fields.
 
    
### Utility Functions

**(Operations for Filter)**

**1. starts-with:**

   Returns the list of objects which starts with the given string in the field value.
   
**2. contains:**

   Returns the list of objects which contains given string in the field value. 
   
**3. equals:**

   Returns the list of objects whose value of the given field matches the input given by the user.
   
 **4. greater-than:**

   Returns the list of objects whose value of the given field is greater then the user input.
   
 **5. less-than:**

   Returns the list of objects which starts with the given string. 
   

### Future Improvements:

- The operations can be performed on the given set of data by multiprocessing. 
- More utitily functions could be added for doing CRUD operations on the data.
- The results could be cached using an in-memory database


### Version Details:

| Version   | Description   |
|:---------:|:--------------|
| 1.0.0     |  A basic web application which has 2 routes to paginate, filter and sort a given set of JSON data  |
