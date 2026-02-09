import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ForumService {

  constructor() { }

  async findAll() {

    try {
      // const response = await axios.get(`${process.env.FORUM_URL}/v1/users`, {
      //   params: {
      //     secret: process.env.FORUM_ADMIN_PASSWORD
      //   }
      // });
      // return response.data;

      // return mock data
        return [
        {
          "id": 0,
          "title": "Bienvenue sur le forum",
          "text": "Ceci est le premier message de bienvenue sur notre forum.",
          "created_at": "2026-01-28T23:27:11.985Z",
          "updated_at": "2026-01-28T23:27:11.985Z",
          "parent_id": 0,
          "author": {
            "id": 1,
            "name": "Administrateur",
            "avatar": {
              "id": 1,
              "filename": "admin-avatar.png",
              "file_urlpath": "/uploads/avatars/admin.png"
            }
          },
          "files": [
            {
              "id": 1,
              "text": "Guide d'utilisation",
              "filename": "guide.pdf",
              "content_type": "application/pdf",
              "file_hash": "abc123def456",
              "file_urlpath": "/uploads/files/guide.pdf",
              "processing_state": "completed"
            }
          ]
        },
        {
          "id": 1,
          "title": "Annonce importante",
          "text": "Nouvelle fonctionnalité disponible à partir d'aujourd'hui.",
          "created_at": "2026-01-29T10:15:30.123Z",
          "updated_at": "2026-01-29T10:15:30.123Z",
          "parent_id": 0,
          "author": {
            "id": 2,
            "name": "Modérateur",
            "avatar": {
              "id": 2,
              "filename": "mod-avatar.jpg",
              "file_urlpath": "/uploads/avatars/moderator.jpg"
            }
          },
          "files": []
        }
      ];

    } catch (error) {
      console.error('Forum.all.error', error);
      return false;
    }
  }

  async remove(id: number) {
    try {
      // const response = await axios.delete(process.env.FORUM_URL + '/' + id, {
      //   params: {
      //     secret: process.env.FORUM_ADMIN_PASSWORD
      //   }
      // });

      // return response.data;
      return {
        success: true,
        message: `Post avec ID ${id} supprimé avec succès`,
      };
    } catch (error) {
      console.log('Forum.entry.delete.error', error);
      return false;
    }
  }

}
