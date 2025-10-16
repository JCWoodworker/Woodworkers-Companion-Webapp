import "./App.css"
import HomePage from "./components/HomePage"
import PrivacyPolicyPage from "./components/PrivacyPolicy"
import SupportPage from "./components/SupportPage"
import Tool2View from "./components/tools/Tool2View"
import Tool3View from "./components/tools/Tool3View"
import Tool4View from "./components/tools/Tool4View"
import Tool5View from "./components/tools/Tool5View"
import Tool6View from "./components/tools/Tool6View"
import Tool7View from "./components/tools/Tool7View"
import Tool8View from "./components/tools/Tool8View"
import Tool9View from "./components/tools/Tool9View"
import BoardFootCalculatorView from "./components/tools/BoardFootCalculator/BoardFootCalculatorView"
import { Route, Routes } from "react-router-dom"

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
				<Route path="/support" element={<SupportPage />} />
				<Route path="/tool/1" element={<BoardFootCalculatorView />} />
				<Route path="/tool/2" element={<Tool2View />} />
				<Route path="/tool/3" element={<Tool3View />} />
				<Route path="/tool/4" element={<Tool4View />} />
				<Route path="/tool/5" element={<Tool5View />} />
				<Route path="/tool/6" element={<Tool6View />} />
				<Route path="/tool/7" element={<Tool7View />} />
				<Route path="/tool/8" element={<Tool8View />} />
				<Route path="/tool/9" element={<Tool9View />} />
			</Routes>
		</>
	)
}
export default App
