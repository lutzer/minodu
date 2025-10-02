import type { ForumAuthor } from "./forumAuthor"
import type { ForumFile } from "./forumFile"

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