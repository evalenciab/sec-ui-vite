// Interface for User, mirroring the one in src/types/search.ts
export interface IUser {
    id: string;
    name: string;
    email: string;
    roles: string[];
    lastAccess: string;
    addedBy: string;
    addedAt: string;
}

// Mock data for users
const mockUsers: IUser[] = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        roles: ['Admin', 'User'],
        lastAccess: '2023-10-26T10:00:00Z',
        addedBy: 'AdminUser',
        addedAt: '2023-01-15T09:00:00Z',
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        roles: ['User'],
        lastAccess: '2023-10-25T11:30:00Z',
        addedBy: 'AdminUser',
        addedAt: '2023-02-20T14:15:00Z',
    },
    {
        id: '3',
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        roles: ['Editor'],
        lastAccess: '2023-10-26T12:00:00Z',
        addedBy: 'John Doe',
        addedAt: '2023-03-10T16:45:00Z',
    },
];

/**
 * Fetches all users.
 * @returns A promise that resolves to an array of IUser objects.
 */
export function getUsers(): Promise<IUser[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockUsers]);
        }, 500); // Simulate network delay
    });
}

/**
 * Fetches a user by their ID.
 * @param id - The ID of the user to fetch.
 * @returns A promise that resolves to the IUser object if found, otherwise undefined.
 */
export function getUserById(id: string): Promise<IUser | undefined> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = mockUsers.find((u) => u.id === id);
            resolve(user);
        }, 300); // Simulate network delay
    });
}

/**
 * Searches users by a search term.
 * Filters users by name or email (case-insensitive).
 * @param searchTerm - The term to search for.
 * @returns A promise that resolves to an array of IUser objects matching the search term.
 */
export function searchUsers(searchTerm: string): Promise<IUser[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (!searchTerm.trim()) {
                resolve([...mockUsers]); // Return all users if searchTerm is empty or whitespace
                return;
            }
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const filteredUsers = mockUsers.filter(
                (user) =>
                    user.name.toLowerCase().includes(lowercasedSearchTerm) ||
                    user.email.toLowerCase().includes(lowercasedSearchTerm)
            );
            resolve(filteredUsers);
        }, 200); // Simulate network delay
    });
} 