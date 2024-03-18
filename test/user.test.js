let app = require("../src/index");
let supertest = require("supertest");
let request = supertest(app);

let mainUser = {
  name: 'Bernardo',
  email: 'mail@mail.com',
  password: '123456'
}

afterAll(() => {
  return request
    .delete(`/user/${mainUser.email}`)
    .then(res => {})
    .catch(err => {
      console.error(err)
    })
})

describe("Cadastro de usuário", () => {
  test("Deve cadastrar um usuário com sucesso", () => {

    return request
      .post("/user")
      .send(mainUser)
      .then((res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.email).toEqual(mainUser.email);
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
     
    //mainUser já foi cadastrado com esse email no teste anterior!
    return request
    .post("/user")
    .send(mainUser)
    .then((res) => {
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toEqual("E-mail já cadastrado!");
    })
    .catch((err) => {
      throw new Error(err);
    })
    
  })
});

describe("Autenticação", () => {

  test("Deve retornar um token quando fizer login", () => {
    return request
      .post("/auth")
      .send({email: mainUser.email, password: mainUser.password})
      .then(res => {
          expect(res.statusCode).toEqual(200);
          expect(res.body.token).toBeDefined();
      })
      .catch(err => {
        throw new Error(err);
      })
  })

  test("Deve impedir o login de um usuário não cadastrado", () => {

    let random = Date.now();

    return request
      .post("/auth")
      .send({email: random, password: random})
      .then(res => {
          expect(res.statusCode).toEqual(403);
          expect(res.body.errors.email).toEqual("E-mail não cadastrado!");
      })
      .catch(err => {
        throw new Error(err);
      })

  })

  test("Deve impedir o login de um usuário cadastrado com uma senha inválida", () => {

    let random = Date.now();

    return request
      .post("/auth")
      .send({email: mainUser.email, password: random})
      .then(res => {
          expect(res.statusCode).toEqual(403);
          expect(res.body.errors.password).toEqual("Senha inválida!");
      })
      .catch(err => {
        throw new Error(err);
      })

  })
})
