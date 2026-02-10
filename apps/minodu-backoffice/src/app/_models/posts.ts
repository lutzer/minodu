import { Category } from "./categories";
import { Tag } from "./tags";

export class Post {
    id: number;
    author: string;
    title: string;
    description: string;
    image: string;
    attachment: string;
    attachmentKb?: string;
    attachmentPdf?: string;
    resources?: string;
    category: Category;
    tags: Tag[];
    createdAt: string;

    constructor(id: number, author: string, title: string, description: string, image: string, attachment: string, attachmentKb: string, attachmentPdf: string, category: Category, tags: Tag [], createdAt: string) {
      this.id = id;
      this.author = author;
      this.title = title;
      this.description = description;
      this.image = image;
      this.attachment = attachment;
      this.attachmentKb = attachmentKb;
      this.attachmentPdf = attachmentPdf;
      this.category = category;
      this.tags = tags;
      this.createdAt = createdAt;
    }

    static fromJson(json: any): Post {
      return new Post(
        json.id,
        json.author,
        json.title,
        json.description,
        json.image,
        json.attachment,
        json.attachment_kb,
        json.attachment_pdf,
        json.category,
        json.tags,
        json.createdAt
      );
    }
  }