import { useState, useEffect } from "react"
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
} from "@mui/material"
import type { BoardEntry } from "../../../../models/BoardFootModels"
import {
	MeasurementUnit,
	LengthUnit,
	PricingType,
	WoodSpecies,
} from "../../../../models/BoardFootModels"
import "./EditBoardModal.css"

interface EditBoardModalProps {
	open: boolean
	board: BoardEntry | null
	onClose: () => void
	onSave: (board: BoardEntry) => void
}

const EditBoardModal = ({
	open,
	board,
	onClose,
	onSave,
}: EditBoardModalProps) => {
	const [thickness, setThickness] = useState("")
	const [width, setWidth] = useState("")
	const [length, setLength] = useState("")
	const [quantity, setQuantity] = useState("")
	const [woodSpecies, setWoodSpecies] = useState("")
	const [price, setPrice] = useState("")
	const [pricingType, setPricingType] = useState<PricingType>(
		PricingType.PerBoardFoot
	)
	const [lengthUnit, setLengthUnit] = useState<LengthUnit>(LengthUnit.Feet)

	useEffect(() => {
		if (board) {
			setThickness(board.thickness?.toString() || "")
			setWidth(board.width?.toString() || "")
			setLength(board.length.toString())
			setQuantity(board.quantity.toString())
			setWoodSpecies(board.woodSpecies || "")
			setPrice(board.price?.toString() || "")
			setPricingType(board.pricingType)
			setLengthUnit(board.lengthUnit || LengthUnit.Feet)
		}
	}, [board])

	const isValid = () => {
		const qty = parseInt(quantity)
		const len = parseFloat(length)

		if (isNaN(qty) || qty <= 0 || isNaN(len) || len <= 0) {
			return false
		}

		if (pricingType === PricingType.PerBoardFoot) {
			const thick = parseFloat(thickness)
			const wid = parseFloat(width)
			return !isNaN(thick) && thick > 0 && !isNaN(wid) && wid > 0
		}

		return true
	}

	const handleSave = () => {
		if (!board || !isValid()) return

		const updatedBoard: BoardEntry = {
			...board,
			thickness:
				pricingType === PricingType.PerBoardFoot ? parseFloat(thickness) : null,
			width:
				pricingType === PricingType.PerBoardFoot ? parseFloat(width) : null,
			length: parseFloat(length),
			quantity: parseInt(quantity),
			price: price ? parseFloat(price) : null,
			pricingType,
			lengthUnit: board.unit === MeasurementUnit.Imperial ? lengthUnit : null,
			woodSpecies: woodSpecies || null,
		}

		onSave(updatedBoard)
		onClose()
	}

	if (!board) return null

	const isImperial = board.unit === MeasurementUnit.Imperial
	const isBoardFoot = pricingType === PricingType.PerBoardFoot

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Edit Board</DialogTitle>
			<DialogContent>
				<div className="edit-board-form">
					{/* Pricing Type Toggle */}
					<div className="pricing-type-toggle">
						<button
							className={`pricing-type-btn ${
								pricingType === PricingType.PerBoardFoot ? "active" : ""
							}`}
							onClick={() => setPricingType(PricingType.PerBoardFoot)}
						>
							Per Board Foot
						</button>
						<button
							className={`pricing-type-btn ${
								pricingType === PricingType.Linear ? "active" : ""
							}`}
							onClick={() => setPricingType(PricingType.Linear)}
						>
							Linear
						</button>
					</div>

					{/* Input Fields */}
					{isBoardFoot && (
						<>
							<div className="input-group">
								<label htmlFor="edit-thickness">
									Thickness {isImperial ? "(quarters)" : "(cm)"}
								</label>
								<input
									id="edit-thickness"
									type="number"
									className="input-field"
									value={thickness}
									onChange={(e) => setThickness(e.target.value)}
									step={isImperial ? "1" : "0.1"}
									min="0"
								/>
							</div>

							<div className="input-group">
								<label htmlFor="edit-width">
									Width {isImperial ? '(")' : "(cm)"}
								</label>
								<input
									id="edit-width"
									type="number"
									className="input-field"
									value={width}
									onChange={(e) => setWidth(e.target.value)}
									step="0.1"
									min="0"
								/>
							</div>
						</>
					)}

					<div className="input-group">
						<label htmlFor="edit-length">
							Length
							{isImperial && (
								<span className="length-unit-toggle">
									<button
										className={`length-unit-btn ${
											lengthUnit === LengthUnit.Feet ? "active" : ""
										}`}
										onClick={() => setLengthUnit(LengthUnit.Feet)}
									>
										ft
									</button>
									<button
										className={`length-unit-btn ${
											lengthUnit === LengthUnit.Inches ? "active" : ""
										}`}
										onClick={() => setLengthUnit(LengthUnit.Inches)}
									>
										in
									</button>
								</span>
							)}
							{!isImperial && " (cm)"}
						</label>
						<input
							id="edit-length"
							type="number"
							className="input-field"
							value={length}
							onChange={(e) => setLength(e.target.value)}
							step="0.1"
							min="0"
						/>
					</div>

					<div className="input-group">
						<label htmlFor="edit-quantity">Quantity</label>
						<input
							id="edit-quantity"
							type="number"
							className="input-field"
							value={quantity}
							onChange={(e) => setQuantity(e.target.value)}
							step="1"
							min="1"
						/>
					</div>

					<div className="input-group">
						<label htmlFor="edit-woodSpecies">Wood Species</label>
						<select
							id="edit-woodSpecies"
							className="input-field"
							value={woodSpecies}
							onChange={(e) => setWoodSpecies(e.target.value)}
						>
							<option value="">Select species...</option>
							{WoodSpecies.commonHardwoods.map((species) => (
								<option key={species} value={species}>
									{species}
								</option>
							))}
						</select>
					</div>

					<div className="input-group">
						<label htmlFor="edit-price">
							Price ($/{isBoardFoot ? "bf" : "linear"})
						</label>
						<input
							id="edit-price"
							type="number"
							className="input-field"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							step="0.01"
							min="0"
						/>
					</div>
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSave} disabled={!isValid()} variant="contained">
					Save
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default EditBoardModal
