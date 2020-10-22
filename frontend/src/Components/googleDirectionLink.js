import React from 'react'
import {CardActions, Button} from '@material-ui/core'
import DirectionsIcon from '@material-ui/icons/Directions';

const GoogleDirectionLink = (props) => {

    const {place} = props
    const mapUrlLauncher = `https://www.google.com/maps/dir/?api=1&destination=${encodeURI(place.name)}&destination_place_id=${place.id}&travelmode=transit`

    const openLinkInNewTab = () => {
        window.open(mapUrlLauncher);
    }

    return (
        <CardActions>
            <Button size="small" color="primary" endIcon={<DirectionsIcon/>} onClick={openLinkInNewTab}>
                Google Directions
            </Button>
      </CardActions>
    )
}

export default GoogleDirectionLink;