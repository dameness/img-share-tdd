let app = require("../src/index");
let supertest = require("supertest");
let request = supertest(app);

describe("Cadastro de usuário", () => {
  test("Deve cadastrar um usuário com sucesso", () => {
    let user = {
      name: "Name",
      email: Date.now() + "@mail.com", // random e-mail
      password: "123456",
    };

    return request
      .post("/user")
      .send(user)
      .then((res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.email).toEqual(user.email);
      })
      .catch((err) => {
        throw new Error(err);
      });
  });

  test("Deve impedir que um usuário se cadastre com os dados vazios", () => {
    let user = {
      name: "",
      email: "", 
      password: "",
    };

    return request
      .post("/user")
      .send(user)
      .then((res) => {
        expect(res.statusCode).toEqual(400); //bad request
      })
      .catch((err) => {
        throw new Error(err);
      });
  })

  test("Deve impedir que um usuário se cadastre com um e-mail repetido", () => {
    let user = {
      name: "Name",
      email: Date.now() + "@mail.com", // random e-mail
      password: "123456",
    };

    return request
      .post("/user")
      .send(user)
      .then((res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.email).toEqual(user.email);

        //promises devem possuir return no jest!!
        return request
        .post("/user")
        .send(user)
        .then((res) => {
          expect(res.statusCode).toEqual(400);
          expect(res.body.error).toEqual("E-mail já cadastrado!");
        })
        .catch((err) => {
          throw new Error(err);
        })
      })
      .catch((err) => {
        throw new Error(err);
      });
  })
});
