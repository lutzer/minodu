import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { LoggerService } from 'src/logs/logger.service';

@Injectable()
export class ForumService {

  constructor(private readonly loggerService: LoggerService) { }

  async findAll() {
    try {
      const url = `${process.env.FORUM_URL}/api/forum/posts/`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      this.loggerService.error(`Error occurred while fetching forum posts: ${error.message}`, ForumService.name);
      throw new Error('Failed to fetch forum posts.'); 
    }
  }

  async remove(id: number) {
    try {
      const url = `${process.env.FORUM_URL}/api/forum/admin/posts/${id}`;
      const response = await axios.delete(url, {
        headers: {
          'X-Admin-Password': process.env.FORUM_ADMIN_PASSWORD
        }
      });

      return response.data;
    } catch (error) {
      this.loggerService.error(`Error occurred while deleting forum post: ${error.message}`, ForumService.name);
      throw new Error('Failed to delete forum post'); 
    }
  }

}
