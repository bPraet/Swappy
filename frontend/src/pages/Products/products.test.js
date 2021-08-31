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

it("returns details of product", async () => {
  const product = await api.get("/product/612e13e75019b626c8d85526", {
    headers: { userToken: token },
  });

  expect(product.data.name).toEqual("ok");
});

it("returns products of user", async () => {
  const products = await api.get("/productsUser", {
    headers: { userToken: token },
  });

  expect(products.data[0].name).toEqual("ok");
});

it("returns 400 due to missing field", async () => {
  try {
    await api.put(
      `/product/update/5ffd94423f95276b283d63d3`,
      { name: "test" },
      { headers: { userToken: token } }
    );
  } catch (error) {
    expect(error.response.data).toEqual("Le produit n'existe pas !");
  }
});

it("returns 400 due to missing field", async () => {
  try {
    await api.put(
      `/product/update/612e13e75019b626c8d85526`,
      {
        name: "testtttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt",
        description: "ok",
        conditionId: "ok",
        transportId: "ok",
      },
      { headers: { userToken: token } }
    );
  } catch (error) {
    expect(error.response.data).toEqual("Nom de maximum 50 caractères !");
  }
});

it("returns 400 due to description to big", async () => {
  try {
    await api.put(
      `/product/update/612e13e75019b626c8d85526`,
      {
        name: "ok",
        description:
          "testttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt",
        conditionId: "ok",
        transportId: "ok",
      },
      { headers: { userToken: token } }
    );
  } catch (error) {
    expect(error.response.data).toEqual("Description de maximum 1500 caractères !");
  }
});

it("returns 400 due to image missing", async () => {
  try {
    await api.put(
      `/product/update/612e13e75019b626c8d85526`,
      {
        name: "ok",
        description:
          "ok",
        conditionId: "5ff83867a845ea2bf4e0ba6e",
        transportId: "5ffd70348a9afa5d18fa7f3e",
      },
      { headers: { userToken: token } }
    );
  } catch (error) {
    expect(error.response.data).toEqual("Veuillez uploader une image de 5Mo ou moins s'il vous plait ! (.jpg, .jpeg)");
  }
});

it('returns "Dont exists" message', async () => {
  const response = await api.delete(`/product/delete/1234`, {
    headers: { userToken: token },
  });

  expect(response.data).toEqual("Ce produit n'existe pas");
});

it("returns 400 due to missing field", async () => {
  try {
    await api.post(
      `/product/add/`,
      { name: "test" },
      { headers: { userToken: token } }
    );
  } catch (error) {
    expect(error.response.data).toEqual("Champs requis manquant !");
  }
});

it("returns 400 due to name to big", async () => {
  try {
    await api.post(
      `/product/add/`,
      {
        name: "testtttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt",
        description: "ok",
        conditionId: "ok",
        transportId: "ok",
      },
      { headers: { userToken: token } }
    );
  } catch (error) {
    expect(error.response.data).toEqual("Nom de maximum 50 caractères !");
  }
});

it("returns 400 due to description to big", async () => {
  try {
    await api.post(
      `/product/add/`,
      {
        name: "ok",
        description:
          "testttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt",
        conditionId: "ok",
        transportId: "ok",
      },
      { headers: { userToken: token } }
    );
  } catch (error) {
    expect(error.response.data).toEqual("Description de maximum 1500 caractères !");
  }
});

it("returns 400 due to image missing", async () => {
  try {
    await api.post(
      `/product/add/`,
      {
        name: "ok",
        description:
          "ok",
        conditionId: "ok",
        transportId: "ok",
      },
      { headers: { userToken: token } }
    );
  } catch (error) {
    expect(error.response.data).toEqual("Veuillez uploader une image de 5Mo ou moins s'il vous plait ! (.jpg, .jpeg)");
  }
});

it("returns array of products", async () => {
  const products = await api.get("/products", {
    headers: { userToken: token },
  });

  expect(Array.isArray(products.data)).toBe(true);
});

it("returns array of conditions", async () => {
  const conditions = await api.get("/conditions", {
    headers: { userToken: token },
  });

  expect(Array.isArray(conditions.data)).toBe(true);
});

it("returns the good condition", async () => {
  const condition = await api.get("/condition/5ff83867a845ea2bf4e0ba6e", {
    headers: { userToken: token },
  });

  expect(condition.data._id).toBe('5ff83867a845ea2bf4e0ba6e');
});

it("returns the good transport", async () => {
  const transport = await api.get("/transport/5ffd70348a9afa5d18fa7f3e", {
    headers: { userToken: token },
  });

  expect(transport.data._id).toBe('5ffd70348a9afa5d18fa7f3e');
});
