export interface Blog {
  id: number;
  title: string;
  imageUrl: string;
  shortDescription: string;
  fullContent: string;
  author: string;
  publishedDate: Date;
  categories: string[];
}
