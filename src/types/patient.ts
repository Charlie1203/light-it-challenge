export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export interface Patient {
	id: string;
	firstName: string;
	lastName: string;
	birthDate: string;
	gender: Gender;
	email: string;
	phone: string;
	address?: string;
	conditions?: string[];
	notes?: string;
	createdAt?: string;
}
