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
var elementsForUI = [];

app = express();
exports.getPageData = getPageData;
exports.clearScraper = clearScraper;

function clearScraper(req, res){
    elementsForUI = [];
    console.log("called clearScraper " + elementsForUI);
}

// Assign everything from AJAX call to a variable
    function getPageData(req,res){
        console.log("got page element as " + req.query.pageElement);

    // Need to make url interpret JSON url return
        var urls = [];
        for(var i = 0; i<req.query.inputUrl.length; i++){
            urls.push(decodeURIComponent(req.query.inputUrl[i]));
        }
        
    // If scraping requires login first, go through an authentication workflow
        // console.log("checked or not checked " + req.query.reqLogin);
        // if(reqLogin == 'true'){
            
        // }
        
        // _token:8m7wcbr7r4HR9AisRccBYWgS1G2fapSsXHxHD7CC

    // If scraping doesn't require a login, scrape the page passed through AJAX call

    // app.get(function(req,res){
        for(var i = 0; i < urls.length; i++){

            scrapePage(urls[i], req, res);
        }
        console.log(elementsForUI);
    };


    function scrapePage(url, req, res){
        request.get(url, function(error, response, body){
            var pageElement = req.query.pageElement.toString();
            var childElement = req.query.childElement.toString();
            var subChildElement = req.query.subChildElement.toString();
            var reqLogin = req.query.reqLogin;
            if(!error){
                console.log("Hit the if statement and using url = " + url);
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
                    //console.log(elementList[index]);
                });
            }
            else{
                console.log("Hit the else statement due to Error:\n\n:" + error);
            }

        // Bad character handling goes here

        // Save JSON
            fs.writeFile('output.json', JSON.stringify(elementList, null, 4), function(err){
                    // console.log('File successfully written! - Check your project directory for the output.json file');
            });

        // Format for HTML display
            elementList.forEach(function(el,i){
                elementsForUI.push("<li>" + elementList[i]);
                console.log(i + " i " + elementsForUI[i]);
            });

        // Pass element data to other modules
            module.exports.elementList = elementsForUI;
        
        // Send element data back to UI
            res.send(
                {'id': elementsForUI,
                'url': url,
                'site': siteName
                });  
        });
    }



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