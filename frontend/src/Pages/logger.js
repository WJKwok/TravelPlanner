import React, {useState} from 'react'
import { makeStyles } from "@material-ui/core/styles";
import {TextField, MenuItem, Button} from '@material-ui/core/';
import PlaceAutoComplete from '../Components/placeAutoComplete'

import {useQuery, useMutation} from '@apollo/react-hooks'
import gql from 'graphql-tag';

const useStyles = makeStyles({
    root: {
        display: 'flex'
    },
    form: {
        marginLeft: 8
    },
    textField: {
        marginBottom: 8,
        width: '100%',
    },
    submitButton:{
        float: "right",
    },
});

function Logger(){

    const classes = useStyles()

    const [city, setCity] = useState("Berlin")
    const [guide, setGuide] = useState("")
    const [category, setCategory] = useState("")
    const [placeId, setPlaceId] = useState("")
    const [name, setName] = useState("")
    const [rating, setRating] = useState("")
    const [address, setAddress] = useState("")
    const [location, setLocation] = useState([])
    const [imgUrl, setImgUrl] = useState("")
    const [content, setContent] = useState("")

    const { data } = useQuery(GET_GUIDES, {
        onCompleted(data){
            console.log(data)
        }
    })

    const [savePlace] = useMutation(SAVE_PLACE, {
        update(_, result){
            console.log(result)
        },
        variables: {
            id: placeId,
            name,
            rating,
            address,
            location,
        }
    })

    const [saveSpot] = useMutation(SAVE_SPOT, {
        update(_, result){
            console.log(result)
        },
        onError({graphQLErrors, networkError}){
            console.log(graphQLErrors)
            console.log(networkError)
        },
        variables: {
            guide: guide.id,
            place: placeId,
            category,
            imgUrl,
            content,
        }
    })

    const guideMenu = () => {
        let guideMenu

        if (data) {
            guideMenu = data.getGuides.map(guide => 
                <MenuItem key={guide.id} value={guide}>
                    <div>
                        <h4>{guide.name}</h4>
                        <p>{guide.id}</p>
                    </div>
                </MenuItem>
            )
            return guideMenu
        }

        guideMenu = <MenuItem>Loading..</MenuItem>
        return guideMenu
    }
    
    const categoryMenu = () => {
        let categoryMenu

        if (data && guide) {
            categoryMenu = guide.categories.map(category => 
                <MenuItem key={category} value={category}>
                    {category}
                </MenuItem>
            )
            return categoryMenu
        }

        categoryMenu = <MenuItem>Loading..</MenuItem>
        return categoryMenu
    }

    const getDetails = (placeObject) => {
        console.log(placeObject)
        setPlaceId(placeObject.id)
        setName(placeObject.content)
        setRating(placeObject.rating)
        setAddress(placeObject.address)
        setLocation([placeObject.location.lat, placeObject.location.lng])
    }

    const submit = () => {
        savePlace()
        saveSpot()
        setCategory("")
        setPlaceId("")
        setName("")
        setRating("")
        setAddress("")
        setLocation("")
        setImgUrl("")
        setContent("")
    }

    return(
        <div>
            <div className={classes.root}>
                <PlaceAutoComplete 
                    clickFunction={getDetails}
                    city={city}/>
                <div className={classes.form}>
                    <TextField 
                        className={classes.textField}
                        label="Guide" 
                        value={guide} 
                        variant="outlined" 
                        select
                        onChange={(e) => {
                            setCity(e.target.value.city)
                            setGuide(e.target.value)
                            setCategory("")
                        }}
                    >
                        {guideMenu()}
                    </TextField>
                    <TextField 
                        className={classes.textField}
                        label="Category" 
                        value={category} 
                        variant="outlined" 
                        select
                        onChange={(e) => {
                            setCategory(e.target.value)
                        }}
                    >
                        {categoryMenu()}
                    </TextField>
                    <TextField 
                        className={classes.textField}
                        label="PlaceId" 
                        value={placeId} 
                        variant="outlined" 
                        disabled
                    />
                    <TextField 
                        className={classes.textField}
                        label="Name" 
                        value={name} 
                        variant="outlined" 
                        disabled
                    />
                    <TextField 
                        className={classes.textField}
                        label="Rating" 
                        value={rating} 
                        variant="outlined"
                        disabled 
                    />
                    <TextField 
                        className={classes.textField}
                        label="Address" 
                        value={address} 
                        variant="outlined" 
                        disabled
                    />
                    <TextField 
                        className={classes.textField}
                        label="Location" 
                        value={location} 
                        variant="outlined" 
                        disabled
                    />
                    <TextField 
                        className={classes.textField}
                        label="ImgUrl" 
                        value={imgUrl} 
                        variant="outlined" 
                        onChange={(e) => setImgUrl(e.target.value)}
                    />
                    <img src={imgUrl} className={classes.textField}/>
                    <TextField 
                        className={classes.textField}
                        label="Content " 
                        value={content} 
                        variant="outlined" 
                        multiline
                        rows={4}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <Button 
                        variant="outlined" 
                        className={classes.submitButton}
                        onClick={submit}
                        
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    );
}

/* 
if you type def is savePlace(placeInput: PlaceInput!): Place! <-- with an '!' after PlaceInput, you can't use this:

const SAVE_PLACE = gql`
    mutation savePlace(
        $placeInput: PlaceInput
    ){
        savePlace(
            placeInput: $placeInput
        ){
            name
        }
    }
`

With the '!' the playground will still work, but here it wont.
You have to use the below:
*/

const SAVE_PLACE = gql`
    mutation savePlace(
        $id: String!
        $name: String!
        $rating: Float!
        $address: String!
        $location: [Float]!
    ){
        savePlace(
            placeInput: {
                id: $id
                name: $name
                rating: $rating
                address: $address
                location: $location
            }
        ){
            name
        }
    }
`

const SAVE_SPOT = gql`
    mutation saveSpot(
        $guide: String!
        $place: String!
        $category: String!
        $imgUrl: String!
        $content: String!
    ){
        saveSpot(
            spotInput: {
                guide: $guide
                place: $place
                category: $category
                imgUrl: $imgUrl
                content: $content
            }
        ){
            guide
        }
    }
`

const GET_GUIDES = gql`
    query getGuides{
        getGuides{
            id
            name
            city
            categories
        }
    }
`

export default Logger;