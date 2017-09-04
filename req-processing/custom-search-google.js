module.exports = function(searchstring, offset){  
  var fields="&fields=items(pagemap/cse_image/src,pagemap/metatags/og:image,title,link,snippet)"
  //re: fields  some difficulty with these, to get it to work  
  //have to pull image from pagemap and pagemap/metatags to get correct working images
  var start=offset+1;
  var baseUrl="https://www.googleapis.com/customsearch/v1?key=" + process.env.APIkey + "&searchtype=image"+ fields+"&cx="+ process.env.SearchEngineID+"&q=";
  var search=encodeURIComponent(searchstring);
  var urlForSearch=baseUrl+search+"&start="+start;    
  
  return urlForSearch
}
