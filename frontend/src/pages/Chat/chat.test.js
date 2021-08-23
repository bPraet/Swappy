import api from "../../services/api";

let token;

beforeAll((done) => {
  api
    .post("/login", { email: "benoit.praet@hotmail.be", password: "test" })
    .then((res) => {
      token = res.data.userToken;
      done();
    });
});

it("returns array of messages", async () => {
  const messages = await api.get("/messages/ok", {
    headers: { userToken: token },
  });

  expect(Array.isArray(messages.data)).toBe(true);
});