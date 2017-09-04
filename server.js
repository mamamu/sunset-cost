
var express = require('express');
var request = require('request');
var validator = require('validator');

var csg = require('./req-processing/custom-search-google');
var ci = require('./req-processing/check-input');
var pag = require('./req-processing/paginate');

var app = express();

//mongo connection stuff
var mongodb = require('mongodb');
const mongoose=require('mongoose');
var Schema = mongoose.Schema;
var Promise = require('bluebird'); 
mongoose.Promise=Promise;


var connecturl ='mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.DB_PORT+'/'+process.env.DB;
var options = {useMongoClient:true}

///database connection here
mongoose.connect(connecturl, options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {  
  
  var schema=mongoose.Schema({
    search:String,
  },  { timestamps: { createdAt: 'created_at' }});
    
  var searchstring=mongoose.model("search", schema);


app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/imagesearch/:search/", function (req, res){ 
  //check input and then check return for * in the string
  //string with asterisks contains the finger wagging error messages we return to people
  //who try to insert blacklisted words/chars into our database/public api  
  var str=ci(req.params.search);
  
  if (validator.contains(str, "*" )){
    res.json(str);
  }
  else {
    var offset=pag(req); 
    var urlForSearch=(csg(str, offset));;
    
    var currentSearch=new searchstring({search: str});  
    var promise=currentSearch.save()
      promise.then (currentSearch => {
        console.log('saving')
      })
      .catch(function(err) {
        console.error(err);
      });
    
  //} 
  //////keep this--comment out when you don't want to hit the gcs api
  request(urlForSearch).pipe(res);  
  //keep this=====comment the below out when you are using the api
  //res.end("done")
}
});
  
app.get('/recent', function (req, res){ 
  var offset=pag(req);  
  var promise=searchstring.find().
    limit(10).
    skip(offset).
    select({search:1,created_at:1,_id:0}).
    sort('-created_at').
    exec();
  promise.then(searchstring=>{
    res.json(searchstring);
  });
 
});


var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

});