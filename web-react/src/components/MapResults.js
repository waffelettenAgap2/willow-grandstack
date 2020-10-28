import React, {useState} from 'react'
import { Grid, Paper, GridList, GridListTile, Button } from '@material-ui/core'
import {useTheme, makeStyles} from '@material-ui/core/styles'
import clsx from 'clsx'
import MapGL, {Marker} from '@urbica/react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import StarredProperties from "./StarredProperties"
import {useMutation} from "@apollo/react-hooks"
import gql from "graphql-tag"

export default function MapResults(props) {

    console.log(props.properties)

    const theme = useTheme()

    const [onStartHandler, {data,loading, error}] = useMutation(gql`
    
    mutation startPropertyMutation($id: ID!) {
        starProperty(id: $id) {
            id
            address
        }        
    }
    
    `)

    const useStyles = makeStyles((theme) => ({
        root: {
          display: 'flex',
        },
        paper: {
          padding: theme.spacing(2),
          display: 'flex',
          overflow: 'auto',
          flexDirection: 'column',
        },
        fixedHeight: {
          height: 540,
        },
      }))

      const classes = useStyles(theme)

      const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

      const [viewport, setViewport] = useState({
        latitude:44.68070186605685, 
        longitude:-111.26491117267962,
        zoom: 13
      });

      const style = {
        padding: '4px',
        color: '#fff',
        cursor: 'pointer',
        background: '#1978c8',
        borderRadius: '50%'
      };

      const [currentProperty, setCurrentProperty] = useState(props.properties[0])
      
    return (
        <React.Fragment>
            <Grid container spacing = {4}>
                <Grid item xs = {12} md = {2} lg = {2}>
                    <Paper className={fixedHeightPaper}>
                        <StarredProperties />
                    </Paper>
                </Grid>
                <Grid item xs = {12} md = {7} lg = {6}>
                    <Paper className={fixedHeightPaper}>
                        <MapGL
                            style={{ width: '100%', height: '540px' }}
                            mapStyle='mapbox://styles/mapbox/light-v9'
                            accessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                            latitude={viewport.latitude}
                            longitude={viewport.longitude}
                            zoom={viewport.zoom}
                            onViewportChange={setViewport}
                        >
                            {props.properties.map ((p,i) => {
                                return (
                                    <Marker 
                                        key={i} 
                                        latitude= {p.location.latitude} 
                                        longitude={p.location.longitude} >
                                    <div 
                                        onClick = {() => setCurrentProperty(p)}
                                        style={style}>
                                    </div>
                                    </Marker>
                                )
                            })}
                        </MapGL>
                    </Paper>
                    
                </Grid>
                <Grid item xs = {12} md = {3} lg = {4}>
                    <Paper className={fixedHeightPaper}>
                        <p>{currentProperty.address}</p>
                        <Button onClick={() => onStartHandler({variables: {id: currentProperty.id}})}>Star Property</Button>
                        <ul>
                            <li>Square feet: {currentProperty.sqft}</li>
                            <li>Bedroom: {currentProperty.bedrooms}</li>
                            <li>Full baths: {currentProperty.full_baths}</li>
                            <li>Half baths: {currentProperty.half_baths}</li>
                        </ul>
                        <GridList cellHeight={160} cols={2}>
                            {currentProperty.photos.map((v, i) => (
                                <GridListTile key={i} cols={1}>
                                    <img src={v.url}></img>
                                </GridListTile>
                            ))}
                        </GridList>
                    </Paper>                  
                </Grid>
            </Grid>

        </React.Fragment>
    )
}