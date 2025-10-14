export interface Article {
  id: number;
  articleNumber: string;
  title: string;
  content: string;
  section?: string;
  chapter?: string;
  isActive: boolean;
  lastModified?: string;
  modificationReason?: string;
  createdAt: string;
  updatedAt: string;
  references?: Reference[];
  tags?: Tag[];
}

export interface Reference {
  id: number;
  referenceText: string;
  targetArticleNumber?: string;
  referenceType?: string;
  externalUrl?: string;
}

export interface Tag {
  id: number;
  name: string;
  description?: string;
  color?: string;
}

export interface SearchResponse {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
}