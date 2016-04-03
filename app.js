var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function(req, res){

    // The URL that we want to scrape
    var url = 'https://sg.linkedin.com/in/gargakshay';

    request(url, function(error, response, html){

        // Check for any error
        if(!error){
            // get the HTML
            var $ = cheerio.load(html);

            // Define the scope that we want to scrape
            var name, headlineTitle, locality, descriptor, currentPosition;
            var json = { name : "", headlineTitle : "", locality : "", descriptor : "", currentPosition : ""};

            $('#name').filter(function(){
                var data = $(this);
                name = data.text();
                json.name = name;
            });

            $('p.headline.title').filter(function(){
                headlineTitle = $(this).text();
                json.headlineTitle = headlineTitle;
            });

            $('#demographics span.locality').filter(function(){
                locality = $(this).text();
                json.locality = locality;
            });

            $('#demographics .descriptor:not(.adr)').filter(function(){
                descriptor = $(this).text();
                json.descriptor = descriptor;
            });

            $('span.org a').filter(function(){
                currentPosition = $(this).text();
                json.currentPosition = currentPosition;
            });

            res.json(json);
        } else {
            res.json({
                message: 'Oops something went wrong'
            })
        }
    })
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", port, app.settings.env);
