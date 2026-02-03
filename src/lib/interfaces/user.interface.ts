export interface User {
	id: number;
	name: string;
	lastName: string;
	nombre: string;
	apellido: string;
	email: string;
	rol: UserRole;
	roles: UserRole;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
}

export interface LoggedUser {
	id: number;
	email: string;
	name?: string;
	nombre?: string;
	rol?: UserRole;
	roles?: UserRole;
}

export enum UserRole {
	superadmin,
	admin,
	operator,
	customer
}
