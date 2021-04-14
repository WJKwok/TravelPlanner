export interface Place {
    id: string
    name: string
    rating: number
    userRatingsTotal: number
    location: [number, number]
    hours: [string]
    businessStatus: string
    internationalPhoneNumber: string
    website: string
    address: string
    reviews: string
}

export interface Spot {
    id: string
    guide: string
    place: Place
    categories: [string]
    imgUrl: [string]
    content: string
    date?: string
    eventName?: string
}