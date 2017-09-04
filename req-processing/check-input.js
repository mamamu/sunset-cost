
module.exports = function(str){
  var validator = require('validator');
  var Filter = require('bad-words'),
  filter = new Filter();  
    var filtItem=filter.clean(str);
  var escaped=validator.escape(filtItem);
  
  if (validator.contains(filtItem, "*" )){      
        return "***This is why you can't have nice things***";
    } else if (filtItem !== escaped){
        return "***Tricky Tricky!***"
    }
     else if (validator.matches(str, /[a-zA-Z0-9]+[a-zA-Z0-9 ]+/ )&&validator.matches(filtItem, /[a-zA-Z0-9]+[a-zA-Z0-9 ]+/ ) ){           
        return filtItem;
    } else {
        return "***I'm not entirely sure what this is***";
    } 
  }

