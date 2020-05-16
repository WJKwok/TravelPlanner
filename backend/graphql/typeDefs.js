const gql = require('graphql-tag');

module.exports = gql`
    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }
    type DayPlan {
        placeIds: [String]!
    }
    type Itinerary {
        id: ID!
        city: String!
        dayPlans: [DayPlan]!
        user: User!
        createdAt: String!
    }
    input DayPlanInput {
        placeIds: [String]
    }
    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Query {
        getUsers: [User]
        getUserItineraries(userId: ID!): [Itinerary]!
        getItinerary(itineraryId: ID!): Itinerary!
    }
    type Mutation {
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        submitItinerary(dayPlans: [DayPlanInput], city: String!): Itinerary!
        saveItinerary(id: ID!, dayPlans: [DayPlanInput]): Itinerary!
        deleteItinerary(itineraryId: ID!): String!
    }
`