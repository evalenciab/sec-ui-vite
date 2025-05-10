import { IUser } from "../types/search";

export const mockUsers: IUser[] = [
  {
    id: "EVALENCIA",
    name: "Elias Valencia",
    email: "elias.valencia@example.com",
    roles: ["Admin", "User"],
    lastAccess: "2024-06-01T10:00:00Z",
    addedBy: "JDOE",
    addedAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "JDOE",
    name: "John Doe",
    email: "john.doe@example.com",
    roles: ["User"],
    lastAccess: "2024-05-28T14:30:00Z",
    addedBy: "EVALENCIA",
    addedAt: "2024-02-10T11:30:00Z",
  },
  {
    id: "ASMITH",
    name: "Alice Smith",
    email: "alice.smith@example.com",
    roles: ["Business Owner"],
    lastAccess: "2024-05-20T08:15:00Z",
    addedBy: "JDOE",
    addedAt: "2024-03-05T13:45:00Z",
  },
  {
    id: "BWILLIAMS",
    name: "Bob Williams",
    email: "bob.williams@example.com",
    roles: ["User", "Auditor"],
    lastAccess: "2024-05-30T16:00:00Z",
    addedBy: "EVALENCIA",
    addedAt: "2024-04-01T10:20:00Z",
  },
  {
    id: "CMARTINEZ",
    name: "Carla Martinez",
    email: "carla.martinez@example.com",
    roles: ["User"],
    lastAccess: "2024-05-25T12:00:00Z",
    addedBy: "ASMITH",
    addedAt: "2024-04-20T15:10:00Z",
  },
];
