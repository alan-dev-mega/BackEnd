import request from 'supertest';
import router from '../../router.js';
import express from 'express';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/", router);

// Setting testing data
const getRewards = {
   "data":[
      {
         "availableAt":"2020-03-22T00:00:00.000Z",
         "redeemedAt":null,
         "expiresAt":"2020-03-23T00:00:00.000Z"
      },
      {
         "availableAt":"2020-03-23T00:00:00.000Z",
         "redeemedAt":null,
         "expiresAt":"2020-03-24T00:00:00.000Z"
      },
      {
         "availableAt":"2020-03-24T00:00:00.000Z",
         "redeemedAt":null,
         "expiresAt":"2020-03-25T00:00:00.000Z"
      },
      {
         "availableAt":"2020-03-25T00:00:00.000Z",
         "redeemedAt":null,
         "expiresAt":"2020-03-26T00:00:00.000Z"
      },
      {
         "availableAt":"2020-03-26T00:00:00.000Z",
         "redeemedAt":null,
         "expiresAt":"2020-03-27T00:00:00.000Z"
      },
      {
         "availableAt":"2020-03-27T00:00:00.000Z",
         "redeemedAt":null,
         "expiresAt":"2020-03-28T00:00:00.000Z"
      },
      {
         "availableAt":"2020-03-28T00:00:00.000Z",
         "redeemedAt":null,
         "expiresAt":"2020-03-29T00:00:00.000Z"
      }
   ]
};

const pacthRewards = { 
  "data": { "availableAt": "2020-03-25T00:00:00.000Z", "redeemedAt": "" + new Date().toISOString() + "", "expiresAt": "2020-03-26T00:00:00.000Z" } 
};

test("GET route works", done => {
  request(app)
    .get("/api/users/1/rewards?at=2020-03-25T12:00:00Z")
    .expect("Content-Type", /json/)
    .expect(getRewards)
    .expect(200, done);
});

// for the case of PATCH is thera a very shor difference in in the milliseconds
// that let the expected result is not the same  
test("PATCH route works", done => {
  request(app)
    .patch("/api/users/1/rewards/2020-03-25T00:00:00Z/redeem")
    .expect(pacthRewards)
    .expect(200, done);
});
