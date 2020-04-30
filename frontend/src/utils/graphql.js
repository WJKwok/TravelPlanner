import gql from 'graphql-tag'

export const GET_USER_ITINERARIES = gql`
query getUserItineraries(
    $userId: ID!
){
    getUserItineraries(
        userId: $userId
    ){
        id
        city
        dayPlans{
            placeIds
        }
        createdAt
        user
        username
    }
}
`