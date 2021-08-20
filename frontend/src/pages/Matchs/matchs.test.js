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

it("returns details of product", async () => {
  const response = await api.post(
    "/match/add",
    {},
    { headers: { userToken: token } }
  );

  expect(response.data).toEqual("Field missing");
});
