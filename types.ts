export enum Shelf {
  WantToRead = 'Want to Read',
  Reading = 'Reading',
  Finished = 'Finished',
}

export interface Book {
  id: string;
  title: string;
  authors: string[];
  coverUrl: string;
  description?: string;
  pageCount?: number;
  shelf: Shelf;
}

export interface Quote {
  id: string;
  bookId: string;
  text: string;
  tags: string[];
  dateAdded: string;
}

export enum View {
  Bookshelf = 'bookshelf',
  AddBook = 'addBook',
  BookDetail = 'bookDetail',
  Settings = 'settings',
}