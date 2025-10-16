import {
	MeasurementUnit,
	LengthUnit,
	PricingType,
	WoodSpecies,
} from "../../../../models/BoardFootModels"
import "./InputSection.css"

interface InputSectionProps {
	unit: MeasurementUnit
	lengthUnit: LengthUnit
	onLengthUnitChange: (unit: LengthUnit) => void
	pricingType: PricingType
	onPricingTypeChange: (type: PricingType) => void
	thickness: string
	onThicknessChange: (value: string) => void
	width: string
	onWidthChange: (value: string) => void
	length: string
	onLengthChange: (value: string) => void
	quantity: string
	onQuantityChange: (value: string) => void
	woodSpecies: string
	onWoodSpeciesChange: (value: string) => void
	price: string
	onPriceChange: (value: string) => void
	canAddBoard: boolean
	onAddBoard: () => void
}

const InputSection = (props: InputSectionProps) => {
	const {
		unit,
		lengthUnit,
		onLengthUnitChange,
		pricingType,
		onPricingTypeChange,
		thickness,
		onThicknessChange,
		width,
		onWidthChange,
		length,
		onLengthChange,
		quantity,
		onQuantityChange,
		woodSpecies,
		onWoodSpeciesChange,
		price,
		onPriceChange,
		canAddBoard,
		onAddBoard,
	} = props

	const isImperial = unit === MeasurementUnit.Imperial
	const isBoardFoot = pricingType === PricingType.PerBoardFoot

	return (
		<div className="input-section-container">
			{/* Pricing Type Toggle */}
			<div className="pricing-type-toggle">
				<button
					className={`pricing-type-btn ${
						pricingType === PricingType.PerBoardFoot ? "active" : ""
					}`}
					onClick={() => onPricingTypeChange(PricingType.PerBoardFoot)}
				>
					Per Board Foot
				</button>
				<button
					className={`pricing-type-btn ${
						pricingType === PricingType.Linear ? "active" : ""
					}`}
					onClick={() => onPricingTypeChange(PricingType.Linear)}
				>
					Linear
				</button>
			</div>

			{/* Input Fields */}
			<div className="input-fields">
				{/* Thickness (only for board foot) */}
				{isBoardFoot && (
					<div className="input-group">
						<label htmlFor="thickness">
							Thickness {isImperial ? "(quarters)" : "(cm)"}
						</label>
						<input
							id="thickness"
							type="number"
							className="input-field"
							value={thickness}
							onChange={(e) => onThicknessChange(e.target.value)}
							placeholder={isImperial ? "e.g., 4 for 4/4" : "e.g., 2"}
							step={isImperial ? "1" : "0.1"}
							min="0"
						/>
						{isImperial && thickness && (
							<div className="input-hint">
								{Math.round(parseFloat(thickness))}/4" ={" "}
								{(parseFloat(thickness) / 4).toFixed(2)}"
							</div>
						)}
					</div>
				)}

				{/* Width (only for board foot) */}
				{isBoardFoot && (
					<div className="input-group">
						<label htmlFor="width">Width {isImperial ? '(")' : "(cm)"}</label>
						<input
							id="width"
							type="number"
							className="input-field"
							value={width}
							onChange={(e) => onWidthChange(e.target.value)}
							placeholder={isImperial ? "e.g., 6" : "e.g., 15"}
							step="0.1"
							min="0"
						/>
					</div>
				)}

				{/* Length */}
				<div className="input-group">
					<label htmlFor="length">
						Length
						{isImperial && (
							<span className="length-unit-toggle">
								<button
									className={`length-unit-btn ${
										lengthUnit === LengthUnit.Feet ? "active" : ""
									}`}
									onClick={() => onLengthUnitChange(LengthUnit.Feet)}
								>
									ft
								</button>
								<button
									className={`length-unit-btn ${
										lengthUnit === LengthUnit.Inches ? "active" : ""
									}`}
									onClick={() => onLengthUnitChange(LengthUnit.Inches)}
								>
									in
								</button>
							</span>
						)}
						{!isImperial && " (cm)"}
					</label>
					<input
						id="length"
						type="number"
						className="input-field"
						value={length}
						onChange={(e) => onLengthChange(e.target.value)}
						placeholder={
							isImperial
								? lengthUnit === LengthUnit.Feet
									? "e.g., 8"
									: "e.g., 96"
								: "e.g., 200"
						}
						step="0.1"
						min="0"
					/>
				</div>

				{/* Quantity */}
				<div className="input-group">
					<label htmlFor="quantity">Quantity</label>
					<input
						id="quantity"
						type="number"
						className="input-field"
						value={quantity}
						onChange={(e) => onQuantityChange(e.target.value)}
						placeholder="e.g., 1"
						step="1"
						min="1"
					/>
				</div>

				{/* Wood Species */}
				<div className="input-group">
					<label htmlFor="woodSpecies">Wood Species</label>
					<select
						id="woodSpecies"
						className="input-field"
						value={woodSpecies}
						onChange={(e) => onWoodSpeciesChange(e.target.value)}
					>
						<option value="">Select species...</option>
						{WoodSpecies.commonHardwoods.map((species) => (
							<option key={species} value={species}>
								{species}
							</option>
						))}
					</select>
				</div>

				{/* Price */}
				<div className="input-group">
					<label htmlFor="price">
						Price ($/{isBoardFoot ? "bf" : "linear"})
					</label>
					<input
						id="price"
						type="number"
						className="input-field"
						value={price}
						onChange={(e) => onPriceChange(e.target.value)}
						placeholder="Optional"
						step="0.01"
						min="0"
					/>
				</div>
			</div>

			{/* Add Board Button */}
			<button
				className={`btn-success add-board-btn ${canAddBoard ? "" : "disabled"}`}
				onClick={onAddBoard}
				disabled={!canAddBoard}
			>
				Add Board
			</button>
		</div>
	)
}

export default InputSection
