const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const request = require("supertest");

require("dotenv").config();

const app = require("../app");
const { User } = require("../models/user");

const { DB_TEST_HOST, PORT } = process.env;

describe("test auth routes", () => {
  const userData = {
    email: "testUser@gmail.com",
    password: "654321",
  };

  beforeAll(() =>
    mongoose
      .connect(DB_TEST_HOST)
      .then(() =>
        app.listen(PORT, () => console.log("Database connection successful"))
      )
      .catch((error) => {
        console.log(error);
        process.exit(1);
      })
  );

  test("test signup route", async () => {
    const regUser = await request(app).post("/api/users/signup").send(userData);
    expect(regUser.statusCode).toBe(201);
    const { _body } = regUser;
    expect(_body.email).toBeTruthy();
    expect(_body.subscription).toBeTruthy();
  });

  test("test login route", async () => {
    const response = await request(app).post("/api/users/login").send(userData);
    expect(response.statusCode).toBe(200);
    const { _body } = response;
    expect(_body.user.email).toBeTruthy();
    expect(_body.user.subscription).toBeTruthy();
    expect(_body.token).toBeTruthy();
  });

  afterAll(async () => {
    await User.findOneAndRemove({ email: userData.email });

    mongoose
      .disconnect(DB_TEST_HOST)
      .then(() => {
        app.disable(PORT, () =>
          console.log("Database disconnection successful")
        );
      })

      .catch((error) => {
        console.log(error);
      });
  });
});
