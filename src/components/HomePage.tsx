import { Link } from "react-router-dom"

const HomePage = () => {
	return (
		<div className="page-container">
			<h1>Woodworker's Companion Web</h1>
			<Link to="/privacy-policy">Privacy Policy</Link>
		</div>
	)
}

export default HomePage
