import {
	View,
	Text,
	TextInput,
	StyleSheet,
	Pressable,
	ScrollView,
} from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Patient, Gender } from "../types/patient";
import { createPatient, updatePatient } from "../services/Api";
import { useState } from "react";

const schema = z.object({
	firstName: z.string().min(2, "Required"),
	lastName: z.string().min(2, "Required"),
	email: z.string().email("Invalid email"),
	phone: z.string().min(7, "Too short"),
	birthDate: z
		.string()
		.refine(
			(v) => !Number.isNaN(new Date(v).getTime()) && new Date(v) < new Date(),
			"Invalid date"
		),
	gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
	address: z.string().optional(),
	conditions: z.string().optional(), 
	notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function PatientForm({
	initialValues,
	onCancel,
	onSubmit,
}: {
	initialValues?: Patient;
	onCancel: () => void;
	onSubmit: (p: Patient) => void;
}) {
	const [saving, setSaving] = useState(false);

	const {
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: initialValues
			? {
					firstName: initialValues.firstName,
					lastName: initialValues.lastName,
					email: initialValues.email,
					phone: initialValues.phone,
					birthDate: initialValues.birthDate.slice(0, 10),
					gender: initialValues.gender as Gender,
					address: initialValues.address ?? "",
					conditions: (initialValues.conditions ?? []).join(", "),
					notes: initialValues.notes ?? "",
			  }
			: {
					firstName: "",
					lastName: "",
					email: "",
					phone: "",
					birthDate: "1990-01-01",
					gender: "other",
					address: "",
					conditions: "",
					notes: "",
			  },
	});

	const bind = (name: keyof FormValues) => ({
		onChangeText: (t: string) =>
			setValue(name, t as any, { shouldValidate: true }),
	});

	const submit = handleSubmit(async (values) => {
		setSaving(true);
		const payload: Omit<Patient, "id"> = {
			firstName: values.firstName,
			lastName: values.lastName,
			email: values.email,
			phone: values.phone,
			birthDate: values.birthDate,
			gender: values.gender,
			address: values.address || undefined,
			conditions: values.conditions
				? values.conditions
						.split(",")
						.map((s) => s.trim())
						.filter(Boolean)
				: undefined,
			notes: values.notes || undefined,
		};
		try {
			const saved = initialValues
				? await updatePatient({ id: initialValues.id, ...payload })
				: await createPatient(payload);
			onSubmit(saved);
		} finally {
			setSaving(false);
		}
	});

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>
					{initialValues ? "Edit patient" : "New patient"}
				</Text>
			</View>

			<ScrollView contentContainerStyle={{ padding: 16 }}>
				<Field label="First name" error={errors.firstName?.message}>
					<TextInput
						style={styles.input}
						defaultValue={initialValues?.firstName || ""}
						{...bind("firstName")}
					/>
				</Field>
				<Field label="Last name" error={errors.lastName?.message}>
					<TextInput
						style={styles.input}
						defaultValue={initialValues?.lastName || ""}
						{...bind("lastName")}
					/>
				</Field>
				<Field label="Email" error={errors.email?.message}>
					<TextInput
						style={styles.input}
						keyboardType="email-address"
						autoCapitalize="none"
						defaultValue={initialValues?.email || ""}
						{...bind("email")}
					/>
				</Field>
				<Field label="Phone" error={errors.phone?.message}>
					<TextInput
						style={styles.input}
						keyboardType="phone-pad"
						defaultValue={initialValues?.phone || ""}
						{...bind("phone")}
					/>
				</Field>
				<Field
					label="Birth date (YYYY-MM-DD)"
					error={errors.birthDate?.message}
				>
					<TextInput
						style={styles.input}
						autoCapitalize="none"
						defaultValue={
							initialValues?.birthDate?.slice(0, 10) || "1990-01-01"
						}
						{...bind("birthDate")}
					/>
				</Field>
				<Field label="Gender" error={errors.gender?.message}>
					<TextInput
						style={styles.input}
						autoCapitalize="none"
						defaultValue={initialValues?.gender || "other"}
						{...bind("gender")}
					/>
				</Field>
				<Field label="Address" error={errors.address?.message}>
					<TextInput
						style={styles.input}
						defaultValue={initialValues?.address || ""}
						{...bind("address")}
					/>
				</Field>
				<Field label="Conditions" error={errors.conditions?.message}>
					<TextInput
						style={styles.input}
						defaultValue={(initialValues?.conditions ?? []).join(", ")}
						{...bind("conditions")}
					/>
				</Field>
				<Field label="Notes" error={errors.notes?.message}>
					<TextInput
						style={[styles.input, { height: 80 }]}
						multiline
						defaultValue={initialValues?.notes || ""}
						{...bind("notes")}
					/>
				</Field>
			</ScrollView>

			<View style={styles.footer}>
				<Pressable
					onPress={onCancel}
					style={({ pressed }) => [
						styles.btnGhost,
						pressed && { opacity: 0.8 },
					]}
				>
					<Text style={styles.btnGhostText}>Cancel</Text>
				</Pressable>
				<Pressable
					disabled={saving}
					onPress={submit}
					style={({ pressed }) => [
						styles.btn,
						pressed && { opacity: 0.9 },
						saving && { opacity: 0.6 },
					]}
				>
					<Text style={styles.btnText}>{saving ? "Saving…" : "Save"}</Text>
				</Pressable>
			</View>
		</View>
	);
}

function Field({
	label,
	error,
	children,
}: {
	label: string;
	error?: string;
	children: React.ReactNode;
}) {
	return (
		<View style={{ marginBottom: 12 }}>
			<Text style={styles.label}>{label}</Text>
			{children}
			{!!error && <Text style={styles.error}>{error}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "white" },
	header: {
		paddingTop: 16,
		paddingHorizontal: 16,
		paddingBottom: 8,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: "#eee",
	},
	title: { fontSize: 18, fontWeight: "700" },
	label: { marginBottom: 6, color: "#333", fontWeight: "600" },
	input: {
		backgroundColor: "#f3f4f6",
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderWidth: 1,
		borderColor: "#e5e7eb",
	},
	error: { color: "#c00", marginTop: 4 },
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 16,
		borderTopWidth: StyleSheet.hairlineWidth,
		borderTopColor: "#eee",
	},
	btn: {
		backgroundColor: "#2d6cdf",
		paddingHorizontal: 18,
		paddingVertical: 12,
		borderRadius: 10,
	},
	btnText: { color: "white", fontWeight: "700" },
	btnGhost: { paddingHorizontal: 8, paddingVertical: 12 },
	btnGhostText: { color: "#444", fontWeight: "600" },
});
