import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaHome, FaHistory } from "react-icons/fa"
import { useBoardFootViewModel } from "./BoardFootViewModel"
import UnitToggle from "./components/UnitToggle"
import InputSection from "./components/InputSection"
import BoardList from "./components/BoardList"
import Summary from "./components/Summary"
import EditBoardModal from "./components/EditBoardModal"
import SaveOrderModal from "./components/SaveOrderModal"
import HistoryView from "./components/HistoryView"
import type { BoardEntry } from "../../models/BoardFootModels.js"
import type { SavedOrder } from "../../models/SavedOrderModels.js"
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Button,
} from "@mui/material"
import "./BoardFootCalculatorView.css"

const BoardFootCalculatorView = () => {
	const navigate = useNavigate()
	const viewModel = useBoardFootViewModel()

	const [showHistory, setShowHistory] = useState(false)
	const [editBoard, setEditBoard] = useState<BoardEntry | null>(null)
	const [showSaveModal, setShowSaveModal] = useState(false)
	const [showExportDialog, setShowExportDialog] = useState(false)
	const [showClearDialog, setShowClearDialog] = useState(false)

	const handleExport = () => {
		setShowExportDialog(true)
	}

	const handleClear = () => {
		setShowClearDialog(true)
	}

	const confirmClear = () => {
		viewModel.clearAll()
		setShowClearDialog(false)
	}

	const handleExportConfirm = async () => {
		const exportText = viewModel.exportData()

		if (navigator.share) {
			try {
				await navigator.share({
					title: "Board Foot Calculator Export",
					text: exportText,
				})
			} catch (error) {
				console.log("Share cancelled")
			}
		} else {
			navigator.clipboard.writeText(exportText)
			alert("Export data copied to clipboard!")
		}

		setShowExportDialog(false)
	}

	const handleEditOrder = (order: SavedOrder) => {
		viewModel.loadOrder(order.boards)
	}

	if (showHistory) {
		return (
			<HistoryView
				onBack={() => setShowHistory(false)}
				onEdit={handleEditOrder}
			/>
		)
	}

	return (
		<div className="calculator-view">
			{/* Header Buttons */}
			<button
				className="home-button"
				onClick={() => navigate("/")}
				aria-label="Home"
			>
				<FaHome size={24} />
			</button>
			<button
				className="history-button"
				onClick={() => setShowHistory(true)}
				aria-label="History"
			>
				<FaHistory size={24} />
			</button>

			{/* Main Content */}
			<div className="calculator-content">
				<h1 className="calculator-title">Board Foot Calculator</h1>

				{/* Unit Toggle */}
				<UnitToggle
					selectedUnit={viewModel.selectedUnit}
					onToggle={(unit) => {
						viewModel.setSelectedUnit(unit)
						// Reset length unit when switching to metric
						if (unit === "Metric") {
							viewModel.setLengthUnit("ft" as any)
						}
					}}
				/>

				{/* Input Section */}
				<InputSection
					unit={viewModel.selectedUnit}
					lengthUnit={viewModel.lengthUnit}
					onLengthUnitChange={viewModel.setLengthUnit}
					pricingType={viewModel.pricingType}
					onPricingTypeChange={viewModel.setPricingType}
					thickness={viewModel.thickness}
					onThicknessChange={viewModel.setThickness}
					width={viewModel.width}
					onWidthChange={viewModel.setWidth}
					length={viewModel.length}
					onLengthChange={viewModel.setLength}
					quantity={viewModel.quantity}
					onQuantityChange={viewModel.setQuantity}
					woodSpecies={viewModel.woodSpecies}
					onWoodSpeciesChange={viewModel.setWoodSpecies}
					price={viewModel.price}
					onPriceChange={viewModel.setPrice}
					canAddBoard={viewModel.canAddBoard}
					onAddBoard={viewModel.addBoard}
				/>

				{/* Save Order Button (only when boards exist) */}
				{viewModel.boards.length > 0 && (
					<button
						className="btn-primary save-order-btn"
						onClick={() => setShowSaveModal(true)}
					>
						Save Order
					</button>
				)}

				{/* Board List */}
				{viewModel.boards.length > 0 && (
					<BoardList
						boards={viewModel.boards}
						onDelete={viewModel.removeBoard}
						onEdit={setEditBoard}
					/>
				)}

				{/* Summary */}
				{viewModel.boards.length > 0 && (
					<Summary
						totalBoardFeet={viewModel.totalBoardFeet}
						totalCost={viewModel.totalCost}
						onExport={handleExport}
						onClear={handleClear}
					/>
				)}
			</div>

			{/* Edit Board Modal */}
			<EditBoardModal
				open={editBoard !== null}
				board={editBoard}
				onClose={() => setEditBoard(null)}
				onSave={(board) => {
					viewModel.updateBoard(board)
					setEditBoard(null)
				}}
			/>

			{/* Save Order Modal */}
			<SaveOrderModal
				open={showSaveModal}
				boards={viewModel.boards}
				onClose={() => setShowSaveModal(false)}
				onSaved={() => {
					viewModel.clearAll()
				}}
			/>

			{/* Export Dialog */}
			<Dialog
				open={showExportDialog}
				onClose={() => setShowExportDialog(false)}
			>
				<DialogTitle>Export Data</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<pre
							style={{
								fontFamily: "monospace",
								fontSize: "0.85rem",
								whiteSpace: "pre-wrap",
								maxHeight: "400px",
								overflow: "auto",
							}}
						>
							{viewModel.exportData()}
						</pre>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setShowExportDialog(false)}>Cancel</Button>
					<Button onClick={handleExportConfirm} variant="contained">
						{"share" in navigator ? "Share" : "Copy to Clipboard"}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Clear Confirmation Dialog */}
			<Dialog open={showClearDialog} onClose={() => setShowClearDialog(false)}>
				<DialogTitle>Clear All Boards</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to clear all boards? This action cannot be
						undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setShowClearDialog(false)}>Cancel</Button>
					<Button onClick={confirmClear} color="error" variant="contained">
						Clear All
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}

export default BoardFootCalculatorView
