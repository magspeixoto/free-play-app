import { MinimumSystemRequirements } from "./minimum-system-requirements"
import { Screenshot } from "./screenshot"

export interface GameDetails {
    id: string
    title: string
    thumbnail: string
    status: string
    shortDescription: string
    description: string
    gameUrl: string
    genre: string
    platform: string
    publisher: string
    developer: string
    releaseDate: string
    freetogameProfileUrl: string
    minimumSystemRequirements: MinimumSystemRequirements
    screenshots: Array<Screenshot>
}
