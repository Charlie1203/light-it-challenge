import { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Pressable,
	LayoutAnimation,
	Platform,
	UIManager,
} from "react-native";
import type { Patient } from "../types/patient";

if (
	Platform.OS === "android" &&
	UIManager.setLayoutAnimationEnabledExperimental
) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

function fullName(p: Patient) {
	return `${p.firstName} ${p.lastName}`;
}
function yearsFrom(dateIso: string) {
	const d = new Date(dateIso);
	const now = new Date();
	let y = now.getFullYear() - d.getFullYear();
	const m = now.getMonth() - d.getMonth();
	if (m < 0 || (m === 0 && now.getDate() < d.getDate())) y--;
	return y;
}

export default function PatientCard({
	patient,
	onEdit,
}: {
	patient: Patient;
	onEdit: () => void;
}) {
	const [open, setOpen] = useState(false);
	const [showFullNotes, setShowFullNotes] = useState(false);

	const toggle = () => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setOpen((v) => !v);
	};

	return (
		<View style={styles.card}>
			<View style={styles.row}>
				<View style={{ flex: 1 }}>
					<Text style={styles.name}>{fullName(patient)}</Text>
					<Text style={styles.sub}>
						{[patient.email, patient.phone].filter(Boolean).join(" · ") || "—"}
					</Text>
				</View>
				<Pressable
					onPress={onEdit}
					style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.8 }]}
					accessibilityLabel="Edit patient"
				>
					<Text style={styles.editText}>Edit</Text>
				</Pressable>
			</View>

			<Pressable
				onPress={toggle}
				style={({ pressed }) => [
					styles.detailsBtn,
					pressed && { opacity: 0.8 },
				]}
			>
				<Text style={styles.detailsText}>
					{open ? "Hide details" : "Show details"}
				</Text>
			</Pressable>

			{open && (
				<View style={styles.details}>
					{/* Address */}
					{patient.address ? (
						<Text style={styles.detailLine}>
							<Text style={styles.detailLabel}>Address: </Text>
							<Text style={styles.detailValue}>{patient.address}</Text>
						</Text>
					) : null}

					{/* Conditions */}
					{patient.conditions?.length ? (
						<View style={{ marginTop: 4 }}>
							<Text style={styles.detailLabel}>Conditions:</Text>
							<View style={styles.chipWrap}>
								{patient.conditions.map((c, i) => (
									<View key={i} style={styles.chip}>
										<Text style={styles.chipText}>{c}</Text>
									</View>
								))}
							</View>
						</View>
					) : null}

					{/* Notes (colapsables) */}
					{patient.notes ? (
						<View style={{ marginTop: 6 }}>
							<Text style={styles.detailLabel}>Notes:</Text>
							<Text
								style={styles.notesText}
								numberOfLines={showFullNotes ? undefined : 3}
							>
								{patient.notes}
							</Text>
							{patient.notes.length > 90 ? (
								<Pressable onPress={() => setShowFullNotes((s) => !s)}>
									<View style={{ alignItems: "flex-end" }}>
										<Text style={styles.moreLess}>
											{showFullNotes ? "Show less" : "Show more"}
										</Text>
									</View>
								</Pressable>
							) : null}
						</View>
					) : null}

					{/* Si no hay nada */}
					{!patient.address && !patient.conditions?.length && !patient.notes ? (
						<Text style={styles.muted}>No extra info</Text>
					) : null}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: "white",
		borderRadius: 14,
		padding: 12,
		marginBottom: 10,
		shadowColor: "#000",
		shadowOpacity: 0.06,
		shadowRadius: 6,
		elevation: 2,
	},
	row: { flexDirection: "row", alignItems: "center" },
	name: { fontSize: 16, fontWeight: "700" },
	sub: { color: "#555", marginTop: 2 },
	editBtn: {
		backgroundColor: "#e9eefc",
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderRadius: 8,
	},
	editText: { color: "#2d6cdf", fontWeight: "600" },
	detailsBtn: { marginTop: 8, paddingVertical: 6 },
	detailsText: { color: "#2d6cdf", fontWeight: "600" },
	details: { marginTop: 6, gap: 4 },
	line: { color: "#333" },
	muted: { color: "#777", fontStyle: "italic" },

	detailLine: {
		marginBottom: 4,
		lineHeight: 20,
	},
	detailLabel: {
		fontWeight: "700",
		color: "#1f2937",
	},
	detailValue: {
		color: "#374151",
	},
	chipWrap: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 6,
		marginTop: 4,
	},
	chip: {
		backgroundColor: "#e0e7ff",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 999,
	},
	chipText: {
		color: "#4338ca",
		fontWeight: "600",
		fontSize: 12,
	},
	notesText: {
		color: "#374151",
		lineHeight: 20,
		marginTop: 4,
	},
	moreLess: {
		marginTop: 4,
		color: "teal",
		fontWeight: "600",
		fontSize: 11,
		alignSelf: "flex-end",
	},
});
