const express = require("express");
const helmet = require("helmet");
const app = express();
const PORT = 5000;
const userData = require("./MOCK_DATA.json");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLInt, GraphQLString } = graphql;
const { graphqlHTTP } = require("express-graphql");
const validator = require("validator");

// Define the User type
const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLInt },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
    })
});

// Define the root query
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
                const user = userData.find((user) => user.id === args.id);
                if (!user) {
                    throw new Error("User not found");
                }
                return {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                };
            }
        }
    }
});

// Define mutations
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
                if (!args.firstName || !args.lastName || !args.email || !args.password) {
                    throw new Error("All fields are required");
                }
                if (!validator.isEmail(args.email)) {
                    throw new Error("Invalid email address");
                }
                const hashedPassword = hashPassword(args.password);
                const newUser = {
                    id: userData.length + 1,
                    firstName: args.firstName,
                    lastName: args.lastName,
                    email: args.email,
                    password: hashedPassword,
                };
                userData.push(newUser);
                return newUser;
            }
        }
    }
});

// Define the GraphQL schema
const schema = new GraphQLSchema({ query: RootQuery, mutation: Mutation });

// Use GraphQL middleware
app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true,
}));

// REST endpoint to get all users
app.get("/rest/getAllUsers", (req, res) => {
    const users = userData.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
    }));
    res.json(users);
});

// Middleware to remove X-Powered-By header and set secure headers
app.use(helmet());

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Hash the password before storing it in the database
function hashPassword(password) {
    // You should use a secure hashing algorithm (e.g., bcrypt) here
    return password;
}
