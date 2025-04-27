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