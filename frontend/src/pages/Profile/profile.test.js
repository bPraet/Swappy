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

it("returns profile of logged user", async () => {
  const user = await api.get("/user", {
    headers: { userToken: token },
  });

  expect(user.data._id).toBe("5ffadaa0040ac15c3067fba0");
});

it("returns profile of user", async () => {
  const user = await api.get("/user/5ff5df48330d2610ec4f7c72", {
    headers: { userToken: token },
  });

  expect(user.data._id).toBe("5ff5df48330d2610ec4f7c72");
});

it("returns already exists message", async () => {
  try {
    await api.put(
      `/user/update`,
      { pseudo: "Pottekepis" },
      { headers: { userToken: token } }
    );
  } catch (error) {
    expect(error.response.data).toEqual("L’utilisateur existe déjà !");
  }
});

it("returns wrong mail message", async () => {
  try {
    await api.put(
      `/user/update`,
      { email: "test" },
      { headers: { userToken: token } }
    );
  } catch (error) {
    expect(error.response.data).toEqual("Veuillez entrer un email valide !");
  }
});

it("returns wrong mail message", async () => {
    try {
      await api.put(
        `/user/update`,
        { password: "test" },
        { headers: { userToken: token } }
      );
    } catch (error) {
      expect(error.response.data).toEqual("Mot de passe invalide (Minimum 8 caractères dont 1 majuscule, 1 nombre et 1 caractère spécial(@$!%*?&+))");
    }
  });
  
