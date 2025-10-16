import "./App.css"
import HomePage from "./components/HomePage"
import PrivacyPolicyPage from "./components/PrivacyPolicy"
import { Route, Routes } from "react-router-dom"

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
			</Routes>
		</>
	)
}
export default App
