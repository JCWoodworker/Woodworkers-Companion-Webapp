import "./App.css"
import HomePage from "./components/HomePage"
import PrivacyPolicyPage from "./components/PrivacyPolicy"
import { Route, Routes } from "react-router-dom"
import SupportPage from "./components/SupportPage"

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
				<Route path="/support" element={<SupportPage />} />
			</Routes>
		</>
	)
}
export default App
