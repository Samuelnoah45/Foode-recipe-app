const { gql } = require("graphql-tag");
const apollo_client = require("../utils/apollo");
const jwt = require("jsonwebtoken");
//  const bcrypt = require("bcrypt");

const loginHandler = async (req, res) => {
  // get request input
  const credientials = req.body.input;
  const email = credientials.email;
  console.log(credientials);
  let GET_USER = gql`
    query ($email: String!) {
      users(where: { email: { _eq: $email } }) {
        id
        email
        password
      }
    }
  `;

  let data = await apollo_client.query({
    query: GET_USER,
    variables: { email },
  });

  let user = data.data.users[0];
  if (!user) {
    return Error("User not found");
  }

  // const isValidPassword = await bcrypt.compare(
  //   credientials.password,
  //   user.password
  // )
  // if (!isValidPassword) {
  //   return Error("Invalid password");
  // }e

  payload = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["admin", "user"],
      "x-hasura-default-role": "user",
      "x-hasura-user-id":"1",
    },
    metadata: {
      "x-hasura-allowed-roles": ["admin", "user"],
      "x-hasura-default-role": "user",
      "x-hasura-u ser-id": "1",
    },
  };
  const token = jwt.sign(payload, process.env.HASURA_GRAPHQL_JWT_SECRETS, {
    algorithm: "HS256",
    expiresIn: Date.now() + 1 * 24 * 60 * 60 * 1000,
  });

  // success
  return res.json({ 
    email: user.email,
    id: user.id,
    password: user.password,
    token: token,
  });

};

module.exports = loginHandler;
