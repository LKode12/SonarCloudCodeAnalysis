const express = require("express");
const app = express();
const PORT = 5000;
const userData = require("./MOCK_DATA.json");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLInt, GraphQLString } = graphql;
const { graphqlHTTP } = require("express-graphql");

// Define the User type
const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLInt },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        // Do not expose the password field in GraphQL queries
        // password: { type: GraphQLString },
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
                // Prevent returning sensitive user data (e.g., passwords)
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
                // Validate user input (e.g., check for required fields)
                if (!args.firstName || !args.lastName || !args.email || !args.password) {
                    throw new Error("All fields are required");
                }
                // Generate a unique ID for the new user
                const id = userData.length > 0 ? userData[userData.length - 1].id + 1 : 1;
                const newUser = {
                    id,
                    firstName: args.firstName,
                    lastName: args.lastName,
                    email: args.email,
                    // Hash the password before storing it
                    password: hashPassword(args.password),
                };
                // Store the new user data
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
    // Do not expose sensitive user data (e.g., passwords)
    const users = userData.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
    }));
    res.json(users);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Hash the password before storing it in the database
function hashPassword(password) {
    // You should use a secure hashing algorithm (e.g., bcrypt) here
    return password;
}
