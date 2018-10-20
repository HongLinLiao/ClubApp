const GOOGLE_MAP_API = 'AIzaSyBAqWCGCH2u8pZrJ9fkC7slorc9tosInk0'

export const autocompletePlace = async (text) => {
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&language=ZH-TW&components=country:TW&key=${GOOGLE_MAP_API}`)
        const result = await response.json()

        console.log(result)

        return result

    } catch(e) {
        console.log(e.toString())
        throw e
    }
}

export const geocodingPlaceId = async (place_id) => {
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?place_id=${place_id}&language=ZH-TW&key=${GOOGLE_MAP_API}`)
        const result = await response.json()

        console.log(result)
        return result

    } catch(e) {
        console.log(e.toString())
        throw e
    }
}