import { useEffect, useState } from "react";
import {
	View,
	Text,
	FlatList,
	ActivityIndicator,
	StyleSheet,
	Pressable,
	Modal,
} from "react-native";

import type { Patient } from "../types/patient";
import PatientCard from "../components/PatientCard";
import PatientForm from "../components/PatientForm";
import { getPatients } from "../services/Api";
import Notification from "../components/Notificacion";

export default function HomeScreen() {
	const [patients, setPatients] = useState<Patient[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingModal, setLoadingModal] = useState(false);
	const [notification, setNotification] = useState<{
		message: string;
		type?: "success" | "error";
	} | null>(null);

	const [modalVisible, setModalVisible] = useState(false);
	const [editing, setEditing] = useState<Patient | null>(null);

	useEffect(() => {
		(async () => {
			try {
				const data = await getPatients();
				setPatients(data);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator />
				<Text style={styles.muted}>Loading patients…</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Patients</Text>
				<Pressable
					onPress={() => {
						setEditing(null);
						setModalVisible(true);
					}}
					style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.8 }]}
					accessibilityLabel="Add patient"
				>
					<Text style={styles.addBtnText}>+ Add</Text>
				</Pressable>
			</View>

			{patients.length === 0 ? (
				<View style={styles.center}>
					<Text style={styles.muted}>No patients yet</Text>
				</View>
			) : (
				<FlatList
					data={patients}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ paddingVertical: 8 }}
					renderItem={({ item }) => (
						<PatientCard
							patient={item}
							onEdit={() => {
								setEditing(item);
								setModalVisible(true);
							}}
						/>
					)}
				/>
			)}

			<Modal
				visible={modalVisible}
				transparent
				animationType="fade"
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalCard}>
						{loadingModal ? (
							<View style={styles.loaderBox}>
								<ActivityIndicator size="large" color="#2d6cdf" />
								<Text style={styles.loaderText}>Saving…</Text>
							</View>
						) : (
							<PatientForm
								initialValues={editing ?? undefined}
								onCancel={() => setModalVisible(false)}
								onSubmit={(saved) => {
									// simula un “guardado” de 1 segundo
									setLoadingModal(true);
									setTimeout(() => {
										setLoadingModal(false);
										setModalVisible(false);
										setNotification({
											message: "Patient saved successfully",
											type: "success",
										});

										setPatients((prev) => {
											const exists = prev.find((p) => p.id === saved.id);
											if (exists)
												return prev.map((p) => (p.id === saved.id ? saved : p));
											return [saved, ...prev];
										});
									}, 2000);
								}}
							/>
						)}
					</View>
				</View>
			</Modal>

			{notification && (
				<Notification
					message={notification.message}
					type={notification.type}
					onHide={() => setNotification(null)}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f6f6f7",
		paddingHorizontal: 16,
		paddingTop: 35,
	},
	center: { flex: 1, alignItems: "center", justifyContent: "center" },
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 8,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.35)",
		alignItems: "center",
		justifyContent: "center",
	},
	modalCard: {
		width: "90%",
		height: "70%",
		backgroundColor: "white",
		borderRadius: 16,
		padding: 16,
		elevation: 10,
		shadowColor: "#000",
		shadowOpacity: 0.2,
		shadowRadius: 10,
	},

	title: { fontSize: 22, fontWeight: "700" },
	addBtn: {
		backgroundColor: "#2d6cdf",
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderRadius: 10,
	},
	addBtnText: { color: "white", fontWeight: "600" },
	muted: { color: "#666", marginTop: 8 },
	loaderBox: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		gap: 12,
	},
	loaderText: {
		color: "#2d6cdf",
		fontWeight: "600",
		fontSize: 16,
	},
});
