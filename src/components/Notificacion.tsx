import { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

export default function Notification({
	message,
	type = "success",
	onHide,
}: {
	message: string;
	type?: "success" | "error";
	onHide: () => void;
}) {
	const opacity = new Animated.Value(0);

	useEffect(() => {
		Animated.timing(opacity, {
			toValue: 1,
			duration: 250,
			useNativeDriver: true,
		}).start(() => {
			setTimeout(() => {
				Animated.timing(opacity, {
					toValue: 0,
					duration: 250,
					useNativeDriver: true,
				}).start(onHide);
			}, 2000);
		});
	}, []);

	return (
		<Animated.View
			style={[
				styles.container,
				{ opacity, backgroundColor: type === "error" ? "#f87171" : "#4ade80" },
			]}
		>
			<Text style={styles.text}>{message}</Text>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		bottom: 40,
		left: "10%",
		right: "10%",
		borderRadius: 10,
		paddingVertical: 10,
		paddingHorizontal: 16,
		elevation: 4,
		shadowColor: "#000",
		shadowOpacity: 0.15,
		shadowRadius: 6,
		alignItems: "center",
	},
	text: { color: "white", fontWeight: "600" },
});
