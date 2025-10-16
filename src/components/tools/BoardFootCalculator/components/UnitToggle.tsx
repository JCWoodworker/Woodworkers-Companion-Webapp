import { MeasurementUnit } from "../../../../models/BoardFootModels"
import "./UnitToggle.css"

interface UnitToggleProps {
	selectedUnit: MeasurementUnit
	onToggle: (unit: MeasurementUnit) => void
}

const UnitToggle = ({ selectedUnit, onToggle }: UnitToggleProps) => {
	return (
		<div className="unit-toggle-container">
			<button
				className={`unit-toggle-btn ${
					selectedUnit === MeasurementUnit.Imperial ? "active" : ""
				}`}
				onClick={() => onToggle(MeasurementUnit.Imperial)}
			>
				Imperial
			</button>
			<button
				className={`unit-toggle-btn ${
					selectedUnit === MeasurementUnit.Metric ? "active" : ""
				}`}
				onClick={() => onToggle(MeasurementUnit.Metric)}
			>
				Metric
			</button>
		</div>
	)
}

export default UnitToggle
