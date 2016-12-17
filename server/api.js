const http = require('http');
const request = require('request');

const port = 4242;

const pwd = process.argv[2];

const server = http.createServer((req, res) => {
  //res.statusCode = 200;
  //res.setHeader('Content-Type', 'application/json');
  var query = req.url;
  query = query.replace(/\//g,' ');
  query = query.replace(/_a/g,'{');
  query = query.replace(/_b/g,'}');

  let aw = request({
    uri: "http://neo4j:"+pwd+"@localhost:7474/db/data/transaction/commit",
    headers: [
    {
        name: "Accept",
        value: "application/json; charset=UTF-8"
    },
    {
        name: "Content-Type",
        value: "application/json"
    }
    ],
    method: "POST",
    json: {
        "statements" : [ {
            "statement" : query
        } ]
    }
    }, function(error, request, body) {
        result = body;
  });

  //res.end(JSON.stringify(result));
  aw.pipe(res);
  console.log('Someone queried \''+query+'\'.');
});

server.listen(port, () => {
  console.log(`Query me at port ${port}.`);
});