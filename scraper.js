/** 
 * Scraper.js  
 * 
 * This script is made to pull data from a given page and push results to a JSON string
 * 
 * References:
 * https://medium.com/data-scraper-tips-tricks/scraping-data-with-javascript-in-3-minutes-8a7cf8275b31
 * https://scotch.io/tutorials/scraping-the-web-with-node-js
 *  
*/

var express = require('../node_modules/express'); 
var request = require('../node_modules/request'); 
var fs = require('fs');
var cheerio = require('cheerio');
var querystring = require('../node_modules/querystring');

app = express();
exports.getPageData = getPageData;

// Assign everything from AJAX call to a variable
function getPageData(req,res){
    console.log("got page element as " + req.query.pageElement);
    var pageElement = req.query.pageElement.toString();
    var childElement = req.query.childElement.toString();
    var subChildElement = req.query.subChildElement.toString();
    var reqLogin = req.query.reqLogin;

// Need to make url interpret JSON url return
    url = decodeURIComponent(req.query.inputUrl);
    url = JSON.stringify(url);
    console.log("stringified url = " + url);

    console.log("checked or not checked " + req.query.reqLogin);
    
// If scraping requires login first, go through an authentication workflow
    // if(reqLogin == 'true'){
        
    // }
    
    // _token:8m7wcbr7r4HR9AisRccBYWgS1G2fapSsXHxHD7CC

// If scraping doesn't require a login, scrape the page passed through AJAX call

    request(url, function(error, response, body){
        if(!error){
            var $ = cheerio.load(body);
            var elementCount;
            var elementList = [];

        // Get the site name
            var site = $('head').find('title');
            var siteName = site.text();

        // Grab each url and make a list of pageElements

        // Grab each page element and parse the desired data
            $(pageElement).each(function(index, element){
                elementList[index] = {};
                if(childElement != ''){
                    var header = $(element).find(childElement);
                    if(subChildElement != ''){
                        elementList[index] = $(header).find(subChildElement).text();
                    }
                    else{
                        elementList[index] = $(header).text();
                    }
                }
                else{
                    elementList[index] = $(header).text();
                }
            });
        }
        else{
            console.log("Error:\n\n:" + error);
        }

    // Bad character handling goes here

    // Save JSON
        fs.writeFile('output.json', JSON.stringify(elementList, null, 4), function(err){
                // console.log('File successfully written! - Check your project directory for the output.json file');
        });

    // Format for HTML display
        elementList.forEach(function(el,i){
            elementList[i] = "<li>" + elementList[i];
        });

    // Pass element data to other modules
        module.exports.elementList = elementList;
        module.exports.elementCount = elementCount;

    // Send element data back to UI
        res.send(
            {'id': elementList,
            'url': url,
            'site': siteName
            });
    });
};



    // bad character handling
        // elementList.forEach(function(el,i) { 
        //     var plus = '+'; // NOTE: holy fuck refactor this
        //     var slash = '/';

        //     if(el.indexOf(plus)>-1||el.indexOf(slash)>-1){
        //         // console.log('found a bad char at index = ' + i);
        //         // console.log('found a + at ' + el);
                
        //         if(el.indexOf(plus)>-1){ // NOTE: holy fuck refactor htis
        //             var newEl = el.split(plus);
        //         }

        //         if(el.indexOf('/')>-1){
        //             var newEl = el.split('/');
        //         }

        //         // console.log('before pop, elementList = ' + elementList);
        //         elementList.splice(i,1); // get rid of the bad element at the index
        //         // console.log('after pop, elementList = ' + elementList);

        //         newEl.forEach(function(el,i){ // push the spliced up element
        //             elementList.push(el);
        //         })
        //     }
        // });