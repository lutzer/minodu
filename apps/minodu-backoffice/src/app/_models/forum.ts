export interface Avatar {
  id: number;
  filename: string;
  file_urlpath: string;
}

export interface Author {
  id: number;
  name: string;
  avatar: Avatar;
}

export interface ForumFile {
  id: number;
  text: string;
  filename: string;
  content_type: string;
  file_hash: string;
  file_urlpath: string;
  processing_state: string;
}

export interface Forum {
  id: number;
  title: string;
  text: string;
  created_at: Date | string;
  updated_at: Date | string;
  parent_id: number;
  author: Author;
  files: ForumFile[];
}
