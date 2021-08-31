import api from "../../services/api";

it('returns "missing values" message', async () => {
  const response = await api.post("/login", {
    email: "benoit.praet@hotmail.be",
  });

  expect(response.data.message).toEqual("Champ requis manquant !");
});

it('returns "does not exists" message', async () => {
  const response = await api.post("/login", {
    email: "benoit.praet@hotmail.b",
    password: "1234",
  });

  expect(response.data.message).toEqual(
    "L'utilisateur n'existe pas ! Voulez-vous vous inscrire plutôt ?"
  );
});

it('returns "incorrect password" message', async () => {
  const response = await api.post("/login", {
    email: "benoit.praet@hotmail.be",
    password: "1234",
  });

  expect(response.data.message).toEqual(
    "L'email et le mot de passe ne correspondent pas"
  );
});

it("returns token", async () => {
  const response = await api.post("/login", {
    email: "benoit.praet@hotmail.be",
    password: "Password1$",
  });

  expect(response.data).toHaveProperty("userToken");
});
