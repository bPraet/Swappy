import api from "../../services/api";

it('returns "missing values" message', async () => {
  const response = await api.post("/user/register", {
    email: "benoit.praet@hotmail.be",
  });

  expect(response.data.message).toEqual("Champ requis manquant !");
});

it('returns "invalid password" message', async () => {
  const response = await api.post("/user/register", {
    email: "benoit.praet@hotmail.be",
    password: "ok",
    firstName: "ok",
    lastName: "ok",
    pseudo: "ok",
    adress: "ok",
    roleid: "ok",
  });

  expect(response.data.message).toEqual(
    "Mot de passe invalide (Minimum 8 caractères dont 1 majuscule, 1 nombre et 1 caractère spécial(@$!%*?&+))"
  );
});

it('returns "already exists email" message', async () => {
  const response = await api.post("/user/register", {
    email: "benoit.praet@hotmail.be",
    password: "Password1$",
    firstName: "ok",
    lastName: "ok",
    pseudo: "ok",
    adress: "ok",
    roleid: "ok",
  });

  expect(response.data.message).toEqual("L’utilisateur existe déjà !");
});

it('returns "already exists pseudo" message', async () => {
  const response = await api.post("/user/register", {
    email: "azerty@qwerty.test",
    password: "Password1$",
    firstName: "ok",
    lastName: "ok",
    pseudo: "Pottekepis",
    adress: "ok",
    roleid: "ok",
  });

  expect(response.data.message).toEqual("L’utilisateur existe déjà !");
});

it('returns "best Password" message', async () => {
  const response = await api.post("/user/register", {
    email: "azerty@qwerty.test",
    password: "Password",
    firstName: "ok",
    lastName: "ok",
    pseudo: "Pottekepis",
    adress: "ok",
    roleid: "ok",
  });

  expect(response.data.message).toEqual(
    "Mot de passe invalide (Minimum 8 caractères dont 1 majuscule, 1 nombre et 1 caractère spécial(@$!%*?&+))"
  );
});
