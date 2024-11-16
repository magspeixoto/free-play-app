
export interface GamesList {
    id: number
    title: string
    thumbnail: string
    shortDescription: string
    gameUrl: string
    genre: string
    platform: string
    developer: string
    releaseDate: string
    freetogameProfileUrl: string
    listType: 'later' | 'playing' | 'played' | 'completed';
}
