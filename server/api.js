const http = require('http');
const request = require('request');

const port = 4242;
const allowedNames = /^[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789]+$/;

const pwd = process.argv[2];

const server = http.createServer((req, res) => {
  let path = req.url;
  let action = req.method;
  console.log(`${action}: ${path}`);

  //parsing happens here
  if (action == 'PUT') {
      if (path.startsWith("/user/")) {
          // register a user
          let name = path.replace("/user/","");
          if (allowedNames.test(name)) {
              cypher(`MATCH (n:Person {name:"${name}"}) RETURN n`,
                  function(error, request, body) {
                      res.statusCode = 501;
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify(body.result));
                  }
            );
          } else {
              res.statusCode = 400;
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