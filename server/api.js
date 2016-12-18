const http = require('http');
const request = require('request');

const port = 4242;

const pwd = process.argv[2];

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');

  //parsing happens here
  query = req.url;
  query = query.replace(/\//g,' ');
  query = query.replace(/_a/g,'{');
  query = query.replace(/_b/g,'}');

  cypher(query, res);
});

server.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});

function cypher(query, res) {
    console.log("Cypher: " + query);
    request({
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
        res.end(JSON.stringify(body));
    });
}