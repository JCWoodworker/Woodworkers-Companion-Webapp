import { useNavigate } from "react-router-dom"
import { allTools } from "../models/Tool"
import { useState } from "react"
import "../App.css"

const ToolTile = ({
	toolId,
	toolName,
}: {
	toolId: number
	toolName: string
}) => {
	const navigate = useNavigate()
	const [isPressed, setIsPressed] = useState(false)

	const handleClick = () => {
		navigate(`/tool/${toolId}`)
	}

	return (
		<div
			className="tool-tile"
			onClick={handleClick}
			onMouseDown={() => setIsPressed(true)}
			onMouseUp={() => setIsPressed(false)}
			onMouseLeave={() => setIsPressed(false)}
			style={{
				transform: isPressed ? "scale(0.97)" : "scale(1)",
				transition: "transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)",
			}}
		>
			<span className="tool-tile-text">{toolName}</span>
		</div>
	)
}

const HomePage = () => {
	return (
		<div className="home-page">
			<div className="home-content">
				{/* Logo */}
				<div className="logo-container">
					<div className="logo-placeholder">
						<span style={{ fontSize: "48px" }}>🪵</span>
					</div>
				</div>

				{/* Caption */}
				<p className="home-subtitle">A collection of tools for woodworkers</p>

				{/* Tool Grid */}
				<div className="tool-grid">
					{allTools.map((tool) => (
						<ToolTile key={tool.id} toolId={tool.id} toolName={tool.name} />
					))}
				</div>
			</div>
		</div>
	)
}

export default HomePage
