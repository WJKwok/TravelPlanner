require('dotenv').config();
const { Client, Status } = require('@googlemaps/google-maps-services-js');

module.exports.getGooglePlace = async (placeId) => {
  const client = new Client({});
  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_PLACES_KEY,
      },
      timeout: 1000, // milliseconds
    });

    const result = response.data.result;
    const googlePlace = {
      category: 'Searched',
      categories: ['Searched'],
      content: '',
      guide: 'Searched',
      id: placeId,
      imgUrl: ['https://i.imgur.com/zbBglmB.jpg'],
      place: {
        id: placeId,
        location: [result.geometry.location.lat, result.geometry.location.lng],
        name: result.name,
        businessStatus: result.business_status,
        rating: result.rating,
        userRatingsTotal: result.user_ratings_total,
        address: result.formatted_address,
        hours: result.opening_hours ? result.opening_hours.weekday_text : null,
        reviews: JSON.stringify(result.reviews),
      },
    };

    return googlePlace;
  } catch (error) {
    console.log(error.response.data);
  }
};

module.exports.getGooglePlaceForUpdate = async (placeId) => {
  const client = new Client({});
  try {
    const response = await client.placeDetails({
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_PLACES_KEY,
      },
      timeout: 1000, // milliseconds
    });

    if (response.data.result) {
      const result = response.data.result;

      const googlePlace = {
        id: placeId,
        location: [result.geometry.location.lat, result.geometry.location.lng],
        name: result.name,
        businessStatus: result.business_status,
        rating: result.rating,
        userRatingsTotal: result.user_ratings_total,
        address: result.formatted_address,
        hours: result.opening_hours ? result.opening_hours.weekday_text : null,
        internationalPhoneNumber: result.international_phone_number,
        website: result.website,
        reviews: JSON.stringify(result.reviews),
      };
      return googlePlace;
    } else {
      return placeId;
    }
  } catch (error) {
    console.log(error);
    return placeId;
  }
};
