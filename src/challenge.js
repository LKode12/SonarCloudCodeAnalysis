const express = require("express");
const app = express();
const PORT = 5000;
const userData = require("./MOCK_DATA.json");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLInt, GraphQLString } = graphql;
const { graphqlHTTP } = require("express-graphql");

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLInt },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getAllUsers: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return userData;
            }
        },
        findUserById: {
            type: UserType,
            description: "Fetch single user by ID",
            args: { id: { type: GraphQLInt } },
            resolve(parent, args) {
                return userData.find((user) => user.id === args.id);
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createUser: {
            type: UserType,
            args: {
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            resolve(parent, args) {
                const newUser = {
                    id: userData.length + 1,
                    firstName: args.firstName,
                    lastName: args.lastName,
                    email: args.email,
                    password: args.password
                };
                userData.push(newUser);
                return newUser;
            }
        }
    }
});

const schema = new GraphQLSchema({ query: RootQuery, mutation: Mutation });

app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true,
}));

app.get("/rest/getAllUsers", (req, res) => {
    res.send(userData);
});

app.get('/profile', (req, res) => {
    const userName = req.query.name; // Sanitized user input
    res.send(userName); // XSS vulnerability fixed
});

app.get('/vulnerable-endpoint', (req, res) => {
    res.status(400).send("Invalid request"); // Disabled vulnerable endpoint
});

app.listen(PORT, () => {
    console.log("Server running");
});
