import "./Summary.css"

interface SummaryProps {
	totalBoardFeet: number
	totalCost: number
	onExport: () => void
	onClear: () => void
}

const Summary = ({
	totalBoardFeet,
	totalCost,
	onExport,
	onClear,
}: SummaryProps) => {
	return (
		<div className="summary-container">
			<div className="summary-content">
				<div className="summary-header">Summary</div>
				{totalBoardFeet > 0 && (
					<div className="summary-row">
						<span className="summary-label">Total Board Feet:</span>
						<span className="summary-value">
							{totalBoardFeet.toFixed(2)} bf
						</span>
					</div>
				)}
				{totalCost > 0 && (
					<div className="summary-row">
						<span className="summary-label">Total Cost:</span>
						<span className="summary-value">${totalCost.toFixed(2)}</span>
					</div>
				)}
			</div>
			<div className="summary-actions">
				<button className="btn-primary" onClick={onExport}>
					Export
				</button>
				<button className="btn-danger" onClick={onClear}>
					Clear All
				</button>
			</div>
		</div>
	)
}

export default Summary
