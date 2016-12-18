const http = require('http');
const request = require('request');

const port = 4242;

const pwd = process.argv[2];

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  //parsing happens here
  query = req.url;
  if (query.startsWith("/REGISTER/")) { //register an account
      query = query.replace(/\/REGISTER\//, "");

      res.statusCode = 501;
      console.log(query);
      res.end("501 Not Implemented");
  } else if (query.startsWith("/DELETE/")) { //delete an account
      query = query.replace(/\/DELETE\//, "");

      res.statusCode = 501;
      console.log(query);
      res.end("501 Not Implemented");
  } else {
      res.statusCode = 400;
      let msg = `Query ${query} could not be parsed.`;
      console.log(msg);
      res.end(msg);
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