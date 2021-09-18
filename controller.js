const url = require('url');
const queryString = require('query-string');
const twoParamsOps = ['+', '-', '*', '/', '%'];
const validOperations = ['+', '-', '*', '/', '%', '!', 'p', 'np'];
let missingParams;
let validParamTypes;

exports.getResult = function(req, res) {
  const reqUrl = url.parse(req.url, true);
  const parsed = queryString.parse(reqUrl.search);
  var response = chooseOperation(parsed);
  res.statusCode = 200;
  res.setHeader('content-Type', 'Application/json');
  res.end(JSON.stringify(response));
}

function chooseOperation(parsedQueryString){
    parsedQueryString.op = parsedQueryString.op == " " ? "+" : parsedQueryString.op;
    if (parsedQueryString.op == undefined){
        parsedQueryString["error"] = "'op' parameter is missing";
        return parsedQueryString;
    }
    else if (!validOperations.includes(parsedQueryString.op)){
        parsedQueryString["error"] = "unknown operation";
        return parsedQueryString;
    }
    
    missingParams = checkMissingParams(parsedQueryString);
    if (missingParams != undefined){
        parsedQueryString["error"] = missingParams;
        return parsedQueryString;
    }

    if (checkTooManyParams(parsedQueryString)){
        parsedQueryString["error"] = "too many parameters";
        return parsedQueryString;
    }
    
    validParamTypes = checkParamTypes(parsedQueryString)
    if (validParamTypes != undefined){
        parsedQueryString["error"] = validParamTypes;
        return parsedQueryString;
    }

        
    switch(parsedQueryString.op){
        case "+": 
            parsedQueryString["value"] = sum(parsedQueryString.x, parsedQueryString.y);
            break;
        case "-": 
            parsedQueryString["value"] = substract(parsedQueryString.x, parsedQueryString.y);
            break;
        case "*":
            parsedQueryString["value"] = multiply(parsedQueryString.x, parsedQueryString.y);
            break;
        case "/":
            parsedQueryString["value"] = divide(parsedQueryString.x, parsedQueryString.y);
            parsedQueryString["value"] = parsedQueryString.y == 0 ? 'Infinity' : parsedQueryString["value"];
            parsedQueryString["value"] = parsedQueryString.y == 0 && parsedQueryString.x == 0 ? 'NaN' : parsedQueryString["value"]; 
            break;
        case "%":
            parsedQueryString["value"] = modulo(parsedQueryString.x, parsedQueryString.y);
            parsedQueryString["value"] = parsedQueryString.y == 0 ? 'NaN' : parsedQueryString["value"]; 
            break;
        case "!": 
            parsedQueryString["value"] = factorialize(parsedQueryString.n);
            break;
        case "p":
            parsedQueryString["value"] = checkPrime(parsedQueryString.n);
            break;
        case "np": 
            parsedQueryString["value"] = findNthPrime(parsedQueryString.n);
            break;
         
    }
    return parsedQueryString;
}

const sum = (x, y) =>  parseInt(x) + parseInt(y);

const substract = (x, y) => parseInt(x) - parseInt(y);

const multiply = (x, y) => parseInt(x) * parseInt(y);

const divide = (x, y) => parseInt(x) / parseInt(y);

const modulo = (x, y) => parseInt(x) % parseInt(y);

const factorialize = (n) => {
    let result = 1;
    if (n == 0 || n == 1)
        return result;
    else {
        for( let i = n; i >= 1; i--)
            result = result * i;
        return result;
    }
}

const findNthPrime = (n) => {
    let listOfPrimes = [2];
    for (let i = 3; i < n * n ; i+=2){
        if (checkPrime(i)){
            listOfPrimes.push(i);
        }
    }
    return listOfPrimes[n - 1];   
}

const checkPrime = (n) => {
    for (let i = 2; i < n; i++)
        if (n % i === 0) return false;
    return n > 1;
}

const checkMissingParams = (parsedQueryString) => {
    if (twoParamsOps.includes(parsedQueryString.op)){
        if ( parsedQueryString.x == undefined ) return "'x' parameter is missing";
        if ( parsedQueryString.y == undefined ) return "'y' parameter is missing";
    }
    else if (parsedQueryString.n == undefined ) return "'n' parameter is missing";
}

const checkTooManyParams = (parsedQueryString) => {
    if (twoParamsOps.includes(parsedQueryString.op)) 
        return Object.keys(parsedQueryString).length > 3;
    else 
        return Object.keys(parsedQueryString).length > 2;
}

const checkParamTypes = (parsedQueryString) => {
    if (twoParamsOps.includes(parsedQueryString.op)){
        if (isNaN(parsedQueryString.x)) return "'x' parameter is not a number";
        if (isNaN(parsedQueryString.y)) return "'y' parameter is not a number";
    }
    else if (isNaN(parsedQueryString.n)) return "'n' parameter is not a number";
}

exports.invalidUrl = function(req, res) {
   var response = [
     {
       "message": "Endpoint incorrect. Les options possibles sont "
     },
     availableEndpoints
   ]
   res.statusCode = 404;
   res.setHeader('content-Type', 'Application/json');
   res.end(JSON.stringify(response))
}
 
const availableEndpoints = [
  {
    method: "GET",
    getResult: "/api/maths"
  }
]