import api from "../../services/api";

let tokenAdmin;
let tokenUser;

beforeAll((done) => {
  api
    .post("/login", { email: "benoit.praet@hotmail.be", password: "test" })
    .then((res) => {
      tokenAdmin = res.data.userToken;

      api
        .post("/login", { email: "ola@ola.ola", password: "Password1$" })
        .then((res) => {
          tokenUser = res.data.userToken;
          done();
        });
    });
});

it("returns not admin message", async () => {
  try {
    const response = await api.get("/admin/users", {
      headers: { userToken: tokenUser },
    });
  } catch (error) {
    expect(error.response.status).toBe(403);
  }
});

it("returns not admin message", async () => {
  try {
    const response = await api.get("/admin/products/5ff5df48330d2610ec4f7c72", {
      headers: { userToken: tokenUser },
    });
  } catch (error) {
    expect(error.response.status).toBe(403);
  }
});

it("returns false due to user account", async () => {

    const isAdmin = await api.get("/isAdmin", {
      headers: { userToken: tokenUser },
    });

    expect(isAdmin.data).toBe(false);
});

it("returns true due to admin account", async () => {

    const isAdmin = await api.get("/isAdmin", {
      headers: { userToken: tokenAdmin },
    });

    expect(isAdmin.data).toBe(true);
});

it("returns not admin message", async () => {
  const response = await api
    .post("/condition/add", {}, { headers: { userToken: tokenUser } })
    .catch((error) => {
      expect(error.response.status).toEqual(403);
    });
});

it("returns not admin message", async () => {
  const response = await api
    .post("/transport/add", {}, { headers: { userToken: tokenUser } })
    .catch((error) => {
      expect(error.response.status).toEqual(403);
    });
});

it("returns users", async () => {
  const users = await api.get("/admin/users", {
    headers: { userToken: tokenAdmin },
  });

  expect(Array.isArray(users.data)).toBe(true);
});

it("returns products", async () => {
  const products = await api.get("/admin/products/5ff5df48330d2610ec4f7c72", {
    headers: { userToken: tokenAdmin },
  });

  expect(Array.isArray(products.data)).toBe(true);
});
