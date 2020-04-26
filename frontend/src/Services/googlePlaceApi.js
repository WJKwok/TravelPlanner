
const googlePlacesApi = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;

export const fetchCategories = async (categories, city, dispatch) => {

    for (var i = 0; i < categories.length; i++){

        // https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors 
        // added proxy in package.json "proxy": "https://maps.googleapis.com/maps/api"

        const response = await fetch(`/place/textsearch/json?query=best+${categories[i]}+${city}&key=${googlePlacesApi}`)
        const extraSuggestions = await response.json();

        dispatch({ type:"LOAD_CATEGORY", payload:{extraSuggestions, placeType: categories[i]}})
    }

}

export const fetchPlaceIdsDaybyDay = async (dayPlans, dispatch) => {

    for(var i = 0; i < dayPlans.length; i++) {
        let placesFetched = {};
        const placeIds = dayPlans[i].placeIds

        for(var j = 0; j < placeIds.length; j++){
            const response = await fetch(`/place/details/json?placeid=${placeIds[j]}&key=${googlePlacesApi}`)
            const placeData = await response.json();

            let placeObject = {};
            placeObject['id'] = placeIds[j]
            placeObject['content'] = placeData.result.name;
            placeObject['rating'] = placeData.result.rating;
            placeObject['photoRef'] = placeData.result.photos ? placeData.result.photos[0].photo_reference : "0";
            placeObject['location'] = placeData.result.geometry.location;
            
            console.log(placeObject);
            placesFetched[placeIds[j]] = placeObject;
        }

        dispatch({ type:"LOAD_DAY_ITINERARY", payload:{day: i, placeIds, dayPlacesFetched: placesFetched}})
    }

}

export const fetchPlaceIds = async (dayPlans) => {

    let placesFetched = {};

    for(var i = 0; i < dayPlans.length; i++) {
        
        const placeIds = dayPlans[i].placeIds

        for(var j = 0; j < placeIds.length; j++){
            const response = await fetch(`/place/details/json?placeid=${placeIds[j]}&key=${googlePlacesApi}`)
            const placeData = await response.json();

            let placeObject = {};
            placeObject['id'] = placeIds[j]
            placeObject['content'] = placeData.result.name;
            placeObject['rating'] = placeData.result.rating;
            placeObject['photoRef'] = placeData.result.photos ? placeData.result.photos[0].photo_reference : "0";
            placeObject['location'] = placeData.result.geometry.location;
            
            console.log(placeObject);
            placesFetched[placeIds[j]] = placeObject;
        }

    }

    return placesFetched

}