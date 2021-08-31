import api from "../../services/api";

let token;

beforeAll((done) => {
  api
    .post("/login", { email: "benoit.praet@hotmail.be", password: "Password1$" })
    .then((res) => {
      token = res.data.userToken;
      done();
    });
});

it("returns 'missing fields' message", async () => {
  const response = await api.post(
    "/match/add",
    {},
    { headers: { userToken: token } }
  ).catch((error) => {
    expect(error.response.data).toEqual("Champs requis manquant !");
  });
});

it("returns array of matchs", async () => {
  const matchs = await api.get("/matchs", {
    headers: { userToken: token },
  });

  expect(Array.isArray(matchs.data)).toBe(true);
});

it("returns array of propositions", async () => {
  const propositions = await api.get("/propositions", {
    headers: { userToken: token },
  });

  expect(Array.isArray(propositions.data)).toBe(true);
});