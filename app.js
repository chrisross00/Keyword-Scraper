/**
 * Server script should spin up a local server and call needed scripts 
 * 
 * High-level goals:
 * 
 */

var http = require('http');
var scraper = require('./scraper');
// var extDictionary = require('./siteDictionary.json');

var express = require('./node_modules/express');
var app = express();
app.use(express.static((__dirname, 'public')));

app.get('/extDictionary', scraper.extDictionaryData);
app.get('/scraper', scraper.getPageData);
app.get('/clearScraper', scraper.clearScraper);

app.listen(8888,function(){ // spin up an local server
	console.log("App is started on port number 8888 and enjoy!")
});