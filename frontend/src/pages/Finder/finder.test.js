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

it("returns array of products", async () => {
  const products = await api.get("/products/notseen", {
    headers: { userToken: token },
  });

  expect(Array.isArray(products.data)).toBe(true);
});
