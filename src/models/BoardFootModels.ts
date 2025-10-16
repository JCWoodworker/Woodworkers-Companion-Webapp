// MARK: - Measurement Unit
export const MeasurementUnit = {
	Imperial: "Imperial",
	Metric: "Metric",
} as const
export type MeasurementUnit =
	(typeof MeasurementUnit)[keyof typeof MeasurementUnit]

// MARK: - Length Unit (for Imperial)
export const LengthUnit = {
	Feet: "ft",
	Inches: "in",
} as const
export type LengthUnit = (typeof LengthUnit)[keyof typeof LengthUnit]

// MARK: - Pricing Type
export const PricingType = {
	PerBoardFoot: "Per Board Foot",
	Linear: "Linear",
} as const
export type PricingType = (typeof PricingType)[keyof typeof PricingType]

// MARK: - Wood Species List
export class WoodSpecies {
	static readonly commonHardwoods: string[] = [
		"Ash",
		"Black Limba",
		"Bloodwood",
		"Cherry",
		"Douglas Fir",
		"Hickory",
		"Maple",
		"Maple (Ambrosia)",
		"Maple (Birdseye)",
		"Maple (Curly)",
		"Oak (Red)",
		"Oak (White)",
		"Padauk",
		"Pine",
		"Poplar",
		"Purple Heart",
		"Tigerwood",
		"Walnut (Black)",
		"Walnut (Peruvian)",
		"Wenge",
		"Zebrawood",
	]
}

// MARK: - Board Entry
export interface BoardEntry {
	id: string
	thickness: number | null
	width: number | null
	length: number
	quantity: number
	unit: MeasurementUnit
	lengthUnit: LengthUnit | null // Only used for Imperial
	price: number | null
	pricingType: PricingType
	woodSpecies: string | null
}

// Helper functions for BoardEntry
export const calculateBoardFeet = (board: BoardEntry): number => {
	// Linear pricing doesn't use board feet
	if (board.pricingType === PricingType.Linear) {
		return 0
	}

	if (!board.thickness || !board.width) return 0

	switch (board.unit) {
		case MeasurementUnit.Imperial: {
			// For Imperial, thickness is in quarters, so convert to inches first
			// Board Feet = (Thickness in inches × Width in inches × Length in feet) / 12 × Quantity
			const thicknessInInches = board.thickness / 4.0

			// Convert length to feet if it's in inches
			const lengthInFeet =
				board.lengthUnit === LengthUnit.Inches
					? board.length / 12.0
					: board.length

			return (
				((thicknessInInches * board.width * lengthInFeet) / 12.0) *
				board.quantity
			)
		}
		case MeasurementUnit.Metric: {
			// Convert to board feet: 1 board foot = 2359.737 cm³
			// Thickness (cm) × Width (cm) × Length (cm) / 2359.737 × Quantity
			return (
				((board.thickness * board.width * board.length) / 2359.737) *
				board.quantity
			)
		}
	}
}

export const calculateCost = (board: BoardEntry): number => {
	if (!board.price) return 0

	switch (board.pricingType) {
		case PricingType.PerBoardFoot:
			return calculateBoardFeet(board) * board.price
		case PricingType.Linear:
			// For linear, just multiply length by price and quantity
			return board.length * board.price * board.quantity
	}
}

export const getBoardDisplayString = (
	board: BoardEntry,
	includeSpecies: boolean = true
): string => {
	const quantityStr = board.quantity > 1 ? `${board.quantity} × ` : ""
	const speciesStr =
		includeSpecies && board.woodSpecies ? ` - ${board.woodSpecies}` : ""

	if (board.pricingType === PricingType.Linear) {
		// Linear only shows length
		switch (board.unit) {
			case MeasurementUnit.Imperial: {
				const lengthSymbol = board.lengthUnit === LengthUnit.Inches ? '"' : "'"
				return `${quantityStr}${board.length}${lengthSymbol}${speciesStr}`
			}
			case MeasurementUnit.Metric:
				return `${quantityStr}${board.length}cm${speciesStr}`
		}
	}

	if (!board.thickness || !board.width) return ""

	switch (board.unit) {
		case MeasurementUnit.Imperial: {
			// Show thickness in quarters format
			const thicknessInt = Math.round(board.thickness)
			const lengthSymbol = board.lengthUnit === LengthUnit.Inches ? '"' : "'"
			return `${quantityStr}${thicknessInt}/4" × ${board.width}" × ${board.length}${lengthSymbol}${speciesStr}`
		}
		case MeasurementUnit.Metric:
			return `${quantityStr}${board.thickness}cm × ${board.width}cm × ${board.length}cm${speciesStr}`
	}
}

// MARK: - Common Lumber Sizes
export interface LumberPreset {
	name: string
	thickness: number
	width: number
}

export const imperialPresets: LumberPreset[] = [
	{ name: "1×2", thickness: 4, width: 1.5 },
	{ name: "1×3", thickness: 4, width: 2.5 },
	{ name: "1×4", thickness: 4, width: 3.5 },
	{ name: "1×6", thickness: 4, width: 5.5 },
	{ name: "1×8", thickness: 4, width: 7.25 },
	{ name: "1×10", thickness: 4, width: 9.25 },
	{ name: "1×12", thickness: 4, width: 11.25 },
	{ name: "2×4", thickness: 8, width: 3.5 },
	{ name: "2×6", thickness: 8, width: 5.5 },
	{ name: "2×8", thickness: 8, width: 7.25 },
	{ name: "2×10", thickness: 8, width: 9.25 },
	{ name: "2×12", thickness: 8, width: 11.25 },
	{ name: "4×4", thickness: 16, width: 3.5 },
	{ name: "6×6", thickness: 24, width: 5.5 },
]

export const metricPresets: LumberPreset[] = [
	{ name: "2×5", thickness: 2, width: 5 },
	{ name: "2×10", thickness: 2, width: 10 },
	{ name: "2×15", thickness: 2, width: 15 },
	{ name: "3×10", thickness: 3, width: 10 },
	{ name: "3×15", thickness: 3, width: 15 },
	{ name: "4×10", thickness: 4, width: 10 },
	{ name: "4×15", thickness: 4, width: 15 },
	{ name: "5×10", thickness: 5, width: 10 },
	{ name: "5×15", thickness: 5, width: 15 },
	{ name: "5×20", thickness: 5, width: 20 },
]
