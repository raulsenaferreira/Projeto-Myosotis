var http = require("http");
var phantom = require("node-phantom");

var url = "http://en.wikipedia.org/wiki/London";

var server = http.createServer(function(req, res) {

phantom.create(function (ph) {
ph.createPage(function (page) {
page.open(url, function (status) {

// We use jQuery to parse the document
page.includeJs(
  "http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js",
  function() {
    page.evaluate(function() {

      var data = {};

      $("table.geography tr").each(function(tr_index, tr) {
        var th_text = $(this).find("th").text();
        var prop_name
          = th_text.trim().toLowerCase().replace(/[^a-z]/g,"");

        // We're only interested in these 3 fields
        if({"country":1,"mayor":1,"elevation":1}[prop_name]) {
          data[prop_name] = $(this).find("td").text();
        }
      });

      return data;

    }, function(data) {

      ph.exit();

      // Begin writing our output HTML
      res.writeHead(200, {"Content-Type": "text/html"});
      res.write("<html><head><meta charset='UTF-8' />");
      res.write("</head><body><table>");

      for(var prop in data) {
        res.write("<tr><th>" + prop + "</th><td>");
        res.write(data[prop]);
        res.write("</td></tr>");
      }

      res.end("</table></body></html>");

      process.exit(0);
    });
  }
);

});
});
});

}).listen(3999);