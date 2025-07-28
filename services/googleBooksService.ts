import { Book, Shelf } from '../types';

const API_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

// Helper to safely get properties from the API response and provide defaults
const getSafe = <T>(getter: () => T, defaultValue: T): T => {
    try {
        const value = getter();
        return value === undefined || value === null ? defaultValue : value;
    } catch (e) {
        return defaultValue;
    }
};

export const searchBooks = async (query: string): Promise<Book[]> => {
    if (!query) {
        return [];
    }
    
    console.log(`Searching for books with query: ${query}`);
    
    try {
        const response = await fetch(`${API_BASE_URL}?q=${encodeURIComponent(query)}&maxResults=20`);
        if (!response.ok) {
            throw new Error(`Google Books API failed with status ${response.status}`);
        }
        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            return [];
        }

        const results: Book[] = data.items.map((item: any) => {
            const coverUrl = getSafe(() => item.volumeInfo.imageLinks.thumbnail, 'https://via.placeholder.com/300x450.png?text=No+Cover');
            return {
                id: getSafe(() => item.id, `local-${Date.now()}-${Math.random()}`),
                title: getSafe(() => item.volumeInfo.title, 'Untitled'),
                authors: getSafe(() => item.volumeInfo.authors, ['Unknown Author']),
                coverUrl: coverUrl.replace(/^http:/, 'https:'), // Ensure HTTPS for security
                description: getSafe(() => item.volumeInfo.description, 'No description available.'),
                pageCount: getSafe(() => item.volumeInfo.pageCount, undefined),
                shelf: Shelf.WantToRead, // Default shelf for new books
            };
        });

        return results;
    } catch (error) {
        console.error("Error searching books:", error);
        // Return an empty array to prevent the app from crashing
        return [];
    }
};