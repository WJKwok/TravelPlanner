import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';


function Item(props) {

    const {place, index} = props;
    const placeImgUrl = "/place/photo?maxheight=400&photoreference=" + place.photoRef + "&key=" + process.env.REACT_APP_GOOGLE_PLACES_API_KEY; 
    
    return (
        <Draggable draggableId={place.id} 
            index={index}
        >
            {(provided) => (
                    <Accordion
                        className="item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="0">
                                {index+1}. {place.content}
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body 
                                    className="toggle-body"
                                >
                                    <img src={placeImgUrl}/>
                                    <p>{place.rating}</p>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
            )}
        </Draggable>
    );
}

export default Item;

// draggable attribute
// isDragDisabled={place.id === 'place-1'}
//<img src={placeImgUrl}/>