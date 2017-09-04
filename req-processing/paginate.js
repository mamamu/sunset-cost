module.exports = function (req){
    var offset=0;  
    if (req.query.offset!==undefined){
      offset=req.query.offset;
    }
    offset*=10
    return offset;
  }