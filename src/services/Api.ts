import { Patient } from "../types/patient";

const BASE = process.env.EXPO_PUBLIC_API_BASE_URL;
const PATH = process.env.EXPO_PUBLIC_API_PATIENTS_PATH || "/users";

type AnyObj = Record<string, any>;

function splitName(full: string): { firstName: string; lastName: string } {
	if (!full) return { firstName: "", lastName: "" };
	const parts = full.trim().split(/\s+/);
	const firstName = parts.shift() || "";
	const lastName = parts.join(" ") || "";
	return { firstName, lastName };
}

function normalizePatient(raw: AnyObj): Patient {
	const { firstName, lastName } = splitName(raw.name || "");
	return {
		id: String(raw.id ?? raw._id ?? raw.uuid),
		firstName,
		lastName,
		birthDate: raw.createdAt || "1990-01-01",
		gender: "other",
		email: "",
		phone: "",
		address: raw.website || undefined,
		conditions: undefined,
		notes: raw.description || undefined,
	};
}

async function apiFetch(input: string, init?: RequestInit) {
	if (!BASE) throw new Error("Missing BASE URL");
	const res = await fetch(`${BASE}${input}`, {
		...init,
		headers: {
			"Content-Type": "application/json",
			...(init?.headers || {}),
		},
	});
	if (!res.ok) {
		const txt = await res.text().catch(() => "");
		throw new Error(`HTTP ${res.status}: ${txt || res.statusText}`);
	}
	return res.json();
}

export async function getPatients(): Promise<Patient[]> {
	try {
		const json = await apiFetch(PATH, { method: "GET" });
		const arr = Array.isArray(json)
			? json
			: Array.isArray(json?.data)
			? json.data
			: [];
		return arr.map(normalizePatient);
	} catch (e) {
		const data = await import("../mocks/patients.json");
		return data.default as Patient[];
	}
}

export async function createPatient(p: Omit<Patient, "id">): Promise<Patient> {
	await new Promise((r) => setTimeout(r, 200));
	return { id: `local-${Date.now()}`, ...p };
}

export async function updatePatient(p: Patient): Promise<Patient> {
	await new Promise((r) => setTimeout(r, 200));
	return p;
}
