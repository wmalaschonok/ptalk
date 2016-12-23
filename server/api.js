const http = require('http');
const openpgp = require('openpgp');
const request = require('request');

const port = 4242;
const allowedNames = /^[A-Za-z][A-Za-z0-9]*$/;
const allowedFingerprints = /^[A-Fa-f0-9]+$/;
const allowedKeys = /^[^"']+$/;
const keyserver = "https://pgp.mit.edu";

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
                          let fingerprint;
                          let key;
                          try {
                              let json = JSON.parse(req.read());
                              fingerprint = json["fingerprint"];
                              key = json["key"].replace(/{NEWLINE}/g,"\n");
                          } catch (ex) {
                              res.statusCode = 403;
                              res.setHeader('Content-Type', 'application/json');
                              res.end('{"error":"The request body has to be valid JSON."}');
                              return;
                          }
                          if (fingerprint === undefined && key === undefined) {
                              res.statusCode = 403;
                              res.setHeader('Content-Type', 'application/json');
                              res.end('{"error":"The request body has to contain a \'fingerprint\' or a \'key\' attribute."}');
                          } else {
                              if (allowedFingerprints.test(fingerprint)) {
                                  new openpgp.HKP(keyserver).lookup({query:`0x${fingerprint}`}).then(
                                      function(key) {
                                          if (key === undefined) {
                                              res.statusCode = 404;
                                              res.setHeader('Content-Type', 'application/json');
                                              res.end(`{"error":"A key with the fingerprint ${fingerprint} was not found on keyserver ${keyserver}."}`);
                                          } else {
                                              cypher(`CREATE (p:Person {name:"${name}"})-[o:OWNS]->(k:Key {fingerprint:"${fingerprint}", key:"${key}"})`,
                                                  function(error, request, body) {
                                                      res.statusCode = 204;
                                                      res.end();
                                                  }
                                            );
                                          }
                                      }
                                );
                              } else if (allowedKeys.test(key)) {
                                  let keyObject = openpgp.key.readArmored(key).keys;
                                  if (keyObject.toString() == "") {
                                      res.statusCode = 403;
                                      res.setHeader('Content-Type', 'application/json');
                                      res.end(`{"error":"${key} is not a valid PGP key."}`);
                                  } else {
                                      cypher(`CREATE (p:Person {name:"${name}"})-[o:OWNS]->(k:Key {fingerprint: "${keyObject[0].primaryKey.fingerprint}",key: "${key}"})`,
                                          function(error, request, body) {
                                              res.statusCode = 204;
                                              res.end();
                                          }
                                    );
                                  }
                              } else {
                                  res.statusCode = 403;
                                  res.setHeader('Content-Type', 'application/json');
                                  res.end(`{"error":"Fingerprint ${fingerprint} does not match regular expression ${allowedFingerprints} and key ${key} does not match regular expression ${allowedKeys}."}`);
                              }
                          }
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
  } else if (action == "GET") {
      if (path.startsWith("/user/")) {
          //TODO: get user data
          res.statusCode = 501;
          res.end();
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