import React, {Suspense} from 'react';
import {useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles({
    root: {
        display: 'flex',
        overflowX: 'auto',
        padding: 10,
        alignItems: 'flex-start'
    },
    card: {
      maxWidth: 200,
      marginRight: 5,
    },
});


function Landing() {
    const classes = useStyles();
    // deconstructing from data
    const {data:{ getGuides : guides } = {}, } = useQuery(GET_GUIDES)

    if (guides) {
        console.log('hehe: ',guides)
    }
    
    return (
        <div className={classes.root}>
            {guides && guides.map(guide => 
                <Card className={classes.card} key={guide.id}>
                    <Suspense fallback={<h1>Loading img</h1>}>
                        <CardMedia
                        component="img"
                        image={guide.coverImage}
                        />
                    </Suspense>
                    <CardContent>
                        <Link to={`/planner/${guide.id}`}>
                            <Typography gutterBottom variant="h5">
                                {guide.name}
                            </Typography>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

const GET_GUIDES = gql`
    query getGuides{
        getGuides{
            name
            id
            coverImage
        }
    }
`

export default Landing;