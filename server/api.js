const http = require('http');
const request = require('request');

const port = 4242;
const allowedNames = /^[A-Za-z][A-Za-z0-9]*$/;

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
                      let nameTaken = body["results"][0]["data"].toString() != "";
                      if (nameTaken) {
                          res.statusCode = 409;
                          res.setHeader('Content-Type', 'application/json');
                          res.end(`{"error":"Name ${name} is already taken."}\n`);
                          console.log(`${name} is already taken.`);
                      } else {
                          cypher(`CREATE (n:Person {name:"${name}"})`,
                              function(error, request, body) {
                                  res.statusCode = 204;
                                  res.end();
                              }
                        );
                      }
                  }
            );
          } else {
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.end(`{"error":"Name ${name} does not match the following regular expression: ${allowedNames}"}`);
          }
      } else {
          res.statusCode = 400;
          res.end();
      }
  } else {
      res.statusCode = 400;
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