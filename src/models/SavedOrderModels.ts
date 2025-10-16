import type { BoardEntry } from "./BoardFootModels"
import {
	calculateBoardFeet,
	calculateCost,
	getBoardDisplayString,
} from "./BoardFootModels"

// MARK: - Saved Order
export interface SavedOrder {
	id: string
	name: string
	date: Date
	boards: BoardEntry[]
	totalBoardFeet: number
	totalCost: number
}

// Export text generation
export const generateExportText = (order: SavedOrder): string => {
	let text = `${order.name}\n`
	text += `Date: ${order.date.toLocaleDateString()} ${order.date.toLocaleTimeString()}\n\n`

	// Group boards by species
	const boardsBySpecies = new Map<string, BoardEntry[]>()

	order.boards.forEach((board) => {
		const species = board.woodSpecies || "Unknown"
		if (!boardsBySpecies.has(species)) {
			boardsBySpecies.set(species, [])
		}
		boardsBySpecies.get(species)!.push(board)
	})

	// Output each species group
	boardsBySpecies.forEach((boards, species) => {
		text += `${species}:\n`

		let speciesBoardFeet = 0
		let speciesCost = 0

		boards.forEach((board) => {
			const bf = calculateBoardFeet(board)
			const cost = calculateCost(board)
			speciesBoardFeet += bf
			speciesCost += cost

			text += `  ${getBoardDisplayString(board, false)}`
			if (bf > 0) {
				text += ` - ${bf.toFixed(2)} bf`
			}
			if (cost > 0) {
				text += ` - $${cost.toFixed(2)}`
			}
			text += "\n"
		})

		if (speciesBoardFeet > 0) {
			text += `  Subtotal: ${speciesBoardFeet.toFixed(2)} bf`
		}
		if (speciesCost > 0) {
			if (speciesBoardFeet > 0) {
				text += ` - `
			} else {
				text += `  Subtotal: `
			}
			text += `$${speciesCost.toFixed(2)}`
		}
		text += "\n\n"
	})

	// Overall totals
	if (order.totalBoardFeet > 0) {
		text += `Total Board Feet: ${order.totalBoardFeet.toFixed(2)} bf\n`
	}
	if (order.totalCost > 0) {
		text += `Total Cost: $${order.totalCost.toFixed(2)}\n`
	}

	return text
}

// Create a saved order from boards
export const createSavedOrder = (
	name: string,
	boards: BoardEntry[],
	orderNumber?: number
): SavedOrder => {
	const totalBoardFeet = boards.reduce(
		(sum, board) => sum + calculateBoardFeet(board),
		0
	)
	const totalCost = boards.reduce((sum, board) => sum + calculateCost(board), 0)

	const orderName = name.trim() || `Order ${orderNumber || 1}`

	return {
		id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
		name: orderName,
		date: new Date(),
		boards: boards.map((b) => ({ ...b })), // Deep copy
		totalBoardFeet,
		totalCost,
	}
}
