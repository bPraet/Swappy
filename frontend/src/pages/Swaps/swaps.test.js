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

it("returns array of swaps", async () => {
  const swaps = await api.get("/swaps", {
    headers: { userToken: token },
  });

  expect(Array.isArray(swaps.data)).toBe(true);
});