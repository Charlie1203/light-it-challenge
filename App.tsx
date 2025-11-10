import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import HomeScreen from "./src/screens/HomeScreen";

export default function App() {
	return (
		<SafeAreaProvider>
			<SafeAreaView style={{ flex: 1, backgroundColor: "#f6f6f7" }}>
				<StatusBar barStyle="dark-content" backgroundColor="#f6f6f7" />
				<HomeScreen />
			</SafeAreaView>
		</SafeAreaProvider>
	);
}
