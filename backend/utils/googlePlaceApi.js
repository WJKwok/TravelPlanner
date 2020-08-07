const {Client, Status} = require("@googlemaps/google-maps-services-js");

module.exports.getGooglePlace = async(placeId) => {
    const client = new Client({});
    try {
        const response = await client.placeDetails({
            params: {
                place_id: placeId,
                key: 'AIzaSyA1akG-N0-euznd6XrQf-haKCgKuaAnFds'
            },
            timeout: 1000, // milliseconds
        })
    
        const result = response.data.result;
        const googlePlace = {
            category: 'Searched',
            content: "hello",
            guide: 'Searched',
            id: placeId,
            imgUrl: "https://i.imgur.com/zbBglmB.jpg",
            place: {
                id: placeId,
                location: [result.geometry.location.lat, result.geometry.location.lng],
                name: result.name,
                rating: result.rating
            }
        }

        return googlePlace

    } catch(error) {
        console.log(error.response.data)
    }
    
    
    // client.placeDetails({
    //     params: {
    //         place_id: placeId,
    //         key: 'AIzaSyA1akG-N0-euznd6XrQf-haKCgKuaAnFds'
    //     },
    //     timeout: 1000, // milliseconds
    // })
    // .then((response) => {
    //     const result = response.data.result;
    //     const googlePlace = {
    //         category: 'Searched',
    //         content: "hello",
    //         guide: 'Searched',
    //         id: result.id,
    //         imgUrl: "https://i.imgur.com/zbBglmB.jpg",
    //         place: {
    //             id: result.id,
    //             location: [result.geometry.location.lat, result.geometry.location.lng],
    //             name: result.name,
    //             rating: result.rating
    //         }
    //     }

    //     console.log('hello')
    //     return googlePlace
    // })
    // .catch((error) => {
    //     console.log(error);
    // });
}
