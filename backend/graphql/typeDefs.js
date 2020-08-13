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
    type Guide {
        id: ID!
        name: String!
        city: String!
        coverImage: String!
        categories: [String]!
    }
    type Spot {
        id: ID!
        guide: ID!
        place: Place!
        category: String!
        imgUrl: String!
        content: String!
    }
    input SpotInput {
        guide: String!
        place: String!
        category: String!
        imgUrl: String!
        content: String!
    }
    type Trip {
        id: ID
        user: User!
        guide: Guide!
        startDate: String!
        dayLists: [[String]]!
        categoriesInTrip: [String]!
        googlePlacesInTrip: [String]!
        spotsArray:[Spot]
        filteredSpots:[ID]
    }
    type Place {
        id: ID!
        name: String!
        rating: Float!
        location: [Float]!
        businessStatus: String
        hours: [String]
    }
    input PlaceInput {
        id: String!
        name: String!
        rating: Float!
        address: String!
        location: [Float]!
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
        getUserTrips(userId: ID!): [Trip]!
        getTrip(tripId: ID!): Trip
        getGuides: [Guide]!
        getGuide(guideId: ID!): Guide!
        getSpots(guideId: ID!, category:String!): [Spot]!
        getSpot(guideId: ID!, placeId:String!): Spot
    }
    type Mutation {
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        submitItinerary(dayPlans: [DayPlanInput], city: String!): Itinerary!
        saveItinerary(id: ID!, dayPlans: [DayPlanInput]): Itinerary!
        deleteItinerary(itineraryId: ID!): String!
        submitTrip(guide: ID!, startDate: String!, dayLists: [[String]]!, categoriesInTrip: [String]!, googlePlacesInTrip: [String]!): Trip!
        editTrip(tripId: ID!, startDate: String!, dayLists: [[String]]!, categoriesInTrip: [String]!, googlePlacesInTrip: [String]!): Trip!
        savePlace(placeInput: PlaceInput!): Place!
        updatePlaces: Boolean!
        saveSpot(spotInput: SpotInput!): Spot!
    }
`