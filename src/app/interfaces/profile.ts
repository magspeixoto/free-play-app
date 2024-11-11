import { List } from "./list"

export interface Profile {
    id: string
    name: string
    email: string
    password: string
    avatar: string | null
    lists: List []
}
