import { Post } from "./posts";
import { User } from "./users";

export class Dashboard {
    lastConnexion: string;
    communityName: string;
    postsCount: number;
    productsCount: number;
    usersCount: number;
    posts: Post[];
    user: User;

    constructor(lastConnexion: string, communityName: string, postsCount: number, productsCount: number, usersCount: number, posts: Post [], user: User) {
      this.lastConnexion = lastConnexion;
      this.communityName = communityName;
      this.postsCount = postsCount;
      this.productsCount = productsCount;
      this.usersCount = usersCount;
      this.posts = posts;
      this.user = user;
    }

    static fromJson(json: any): Dashboard {
      return new Dashboard(
        json.lastConnexion,
        json.communityName,
        json.postsCount,
        json.productsCount,
        json.usersCount,
        json.posts,
        json.user
      );
    }
  }