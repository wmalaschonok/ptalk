const http = require('http');
const request = require('request');

const port = 4242;
const allowedNames = /^[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789]+$/;

const pwd = process.argv[2];

const server = http.createServer((req, res) => {
// res.setHeader('Content-Type', 'application/json');

  //parsing happens here
  let path = req.url;
  let action = req.method;
  if (action == 'PUT') {
      if (path.startsWith("/user/")) {
          if (allowedNames.check(path.replace("/user/",""))) {
              res.statusCode = 501;
              res.end();
          } else {
              res.statusCode = 404;
              res.end();
          }
      } else {
          res.statusCode = 404;
          res.end();
      }
  } else {
      res.statusCode = 404;
      res.end();
  }
  console.log(`${action}: ${path}`);
});

server.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});

function cypher(query, callback) {
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
    }, callback //(error, request, body)
    );
}