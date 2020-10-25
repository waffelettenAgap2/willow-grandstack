import React from 'react'
import MapResults from './MapResults'
import { useQuery, gql } from '@apollo/client'

const PROPERTY_SEARCH_QUERY = gql`
    {
        Property(
            filter: {
                location_distance_lt: {
                    point: {latitude: 44.68070186605685, longitude: -111.26491117267962},
                    distance: 2000
                },
                address_not: null
            }
        ) {
            address
            bedrooms
            full_baths
            half_baths
            sqft
            photos {
                url
            }
            in_subdivision {
                name
            }
            location {
                latitude
                longitude
            }
        }
  }
`;

export default function Search() {
    const {loading, error, data} = useQuery(PROPERTY_SEARCH_QUERY)

    if(error) return <p>Error</p>
    if(loading) return <p>Loading...</p>

    return <MapResults properties ={data.Property}/>
}