import type { ForumAuthor } from "./forum_author"
import type { ForumFile } from "./forum_file"

export interface ForumPost {
    id: number
    title: string
    text: string
    published: boolean
    created_at: string
    updated_at: string
    author: ForumAuthor
    files: ForumFile[]
    children: ForumPost[]

}