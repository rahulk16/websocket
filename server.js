var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const fetch = require("node-fetch");
const { timeStamp } = require("console");

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

function fetchData(socket) {
  // fetch("https://blog-application1.herokuapp.com/admin/blog/getAllBlogs")
  //"https://blog-application1.herokuapp.com/admin/blog/getBlog/5eeb7cb82ae1c73e58b8a7bf"

  var myHeader = new fetch.Headers({
    "Content-Type": "application.json",
    accesstoken:
      "eyJ4NXQiOiJaalJtWVRNd05USmpP1U1TW1Jek1qZ3pOREkzWTJJeU1tSXlZMkV6TWpkaFpqVmlNamMwWmciLCJraWQiOiJaalJtWVRNd05USmpPV1U1TW1Jek1qZ3pOREkzWTJJeU1tSXlZMkV6TWpkaFpqVmlNamMwWmdfUlMyNTYiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJwYWRtaW5AYWRtaW4uY29tIiwiYXVkIjoiN0NTWGpmeFhSSEU3cDd6TkZUak83Zl9mV2p3YSIsIm5iZiI6MTU5MzQxODAzMywiYXpwIjoiN0NTWGpmeFhSSEU3cDd6TkZUak83Zl9mV2p3YSIsInNjb3BlIjoib3BlbmlkIiwiaXNzIjoiaHR0cHM6XC9cL2xvY2FsaG9zdDo5NDQzXC9vYXV0aDJcL3Rva2VuIiwiZXhwIjoxNTkzNDIxNjMzLCJpYXQiOjE1OTM0MTgwMzMsImp0aSI6Ijg4ZmE2MTcyLTk3MGUtNDhjZi04ZWY4LWEwNGRlMDMzNjg3YiJ9.bbfGM2bOpKGGcXWSHECd0AdDtmXa6DbOizoSldzqLAYlCqRymx1JHTdPJRxUpt4LtZUJtn37kJxiK30T7x7nG0BQD6KieIActjMt-V3WHins4vCt-IXhZhojEqPiM1xjS0zMcnlL0WWQhWhUH4HFmdQJVLIXfduUs1PMmp-iuqfl3i-3goOA0IgIagdmn6tGokWBAGG-BZc0upO0jCTX3km9Zli3tmfCnZNIfkbNWmsa1CYGI-5EKeJ13CKxkITHy8BsgoV2oy6BmFn-thv29G32znvpI8yvbWx5-Y_6fQRHJoyl6xv_8iE2zzFHG7SUZMwDAk6PMRjvY54yL1Hq8g"
  });

  fetch("http://15.206.172.204:10010/machine/OEE/127?periodicity=week", {
    headers: myHeader
  })
    .then(result => {
      return result.json();
    })
    .then(result => {
      // console.log(result);

      var testString = JSON.stringify(result);
      var objectValue = JSON.parse(testString);
      // Fetching specific value
      console.log(objectValue.totalRecords);

      var totalRecordsData = objectValue.totalRecords;
      var chartPayload = {
        totalRecords: totalRecordsData,
        message: objectValue.message,
        filteredRecords: objectValue.filteredRecords
      };
      socket.send(JSON.stringify(chartPayload));
      // socket.send(JSON.stringify(objectValue.result.author));

      socket.on("disconnect", function() {
        console.log("A user disconnected");
      });
    })
    .catch(err => {
      console.log(err);
    });
}

io.on("connection", socket => {
  console.log("a user connected");

  setInterval(fetchData, 1500, socket);

  //   socket.on("disconnect", function() {
  //     console.log("A user disconnected");
  //   });
});

http.listen(process.env.PORT || 3000, () => {
  console.log("listening on *:3000");
});
