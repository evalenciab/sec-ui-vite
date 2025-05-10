// Interfaces for SearchForAccess page options and form

export interface IUserOption {
    id: string;
    label: string;
}

export interface IApplicationOption {
    id: string;
    label: string;
}

export interface IAccessTypeOption {
    id: string;
    label: string;
}

export interface ISearchFormInput {
    user: IUserOption | null;
    application: string;
    accessType: string;
} 
export interface IRequestAccessFormInput {
    user: IUserOption | null;
    application: string;
    accessType: string;
	comment: string;
}

export interface IUser {
    id: string;
    name: string;
    email: string;
    roles: string[];
    lastAccess: string;
    addedBy: string;
    addedAt: string;
}

