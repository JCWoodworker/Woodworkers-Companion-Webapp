import { useNavigate } from "react-router-dom"
import { FaHome } from "react-icons/fa"
import "./ToolView.css"

const Tool5View = () => {
	const navigate = useNavigate()

	return (
		<div className="tool-view">
			<button
				className="home-button"
				onClick={() => navigate("/")}
				aria-label="Home"
			>
				<FaHome size={24} />
			</button>
			<h1 className="tool-title">Tool 5</h1>
		</div>
	)
}

export default Tool5View
