import { useState, useEffect, useCallback } from "react"
import type { BoardEntry } from "../../../models/BoardFootModels"
import {
	MeasurementUnit,
	LengthUnit,
	PricingType,
	calculateBoardFeet,
	calculateCost,
	getBoardDisplayString,
} from "../../../models/BoardFootModels"
import { v4 as uuidv4 } from "uuid"
import {
	saveWorkInProgress,
	loadWorkInProgress,
	clearWorkInProgress,
} from "../../../utils/localStorage"

export const useBoardFootViewModel = () => {
	// Unit selection
	const [selectedUnit, setSelectedUnit] = useState<MeasurementUnit>(
		MeasurementUnit.Imperial
	)
	const [lengthUnit, setLengthUnit] = useState<LengthUnit>(LengthUnit.Feet)
	const [pricingType, setPricingType] = useState<PricingType>(
		PricingType.PerBoardFoot
	)

	// Input fields
	const [thickness, setThickness] = useState<string>("")
	const [width, setWidth] = useState<string>("")
	const [length, setLength] = useState<string>("")
	const [quantity, setQuantity] = useState<string>("1")
	const [woodSpecies, setWoodSpecies] = useState<string>("")
	const [price, setPrice] = useState<string>("")

	// Boards array
	const [boards, setBoards] = useState<BoardEntry[]>([])

	// Load work in progress on mount
	useEffect(() => {
		const savedBoards = loadWorkInProgress()
		if (savedBoards && savedBoards.length > 0) {
			setBoards(savedBoards)
			// Set unit from first board if available
			if (savedBoards[0]) {
				setSelectedUnit(savedBoards[0].unit)
				if (savedBoards[0].lengthUnit) {
					setLengthUnit(savedBoards[0].lengthUnit)
				}
			}
		}
	}, [])

	// Auto-save work in progress whenever boards change
	useEffect(() => {
		if (boards.length > 0) {
			saveWorkInProgress(boards)
		}
	}, [boards])

	// Computed values
	const totalBoardFeet = boards.reduce(
		(sum, board) => sum + calculateBoardFeet(board),
		0
	)
	const totalCost = boards.reduce((sum, board) => sum + calculateCost(board), 0)

	// Validation
	const canAddBoard = useCallback(() => {
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

		// Linear pricing only needs length and quantity
		return true
	}, [quantity, length, thickness, width, pricingType])

	// Add board
	const addBoard = useCallback(() => {
		if (!canAddBoard()) return

		const newBoard: BoardEntry = {
			id: uuidv4(),
			thickness:
				pricingType === PricingType.PerBoardFoot ? parseFloat(thickness) : null,
			width:
				pricingType === PricingType.PerBoardFoot ? parseFloat(width) : null,
			length: parseFloat(length),
			quantity: parseInt(quantity),
			unit: selectedUnit,
			lengthUnit: selectedUnit === MeasurementUnit.Imperial ? lengthUnit : null,
			price: price ? parseFloat(price) : null,
			pricingType,
			woodSpecies: woodSpecies || null,
		}

		setBoards((prev) => [...prev, newBoard])

		// Clear dimension fields but keep price and species
		setThickness("")
		setWidth("")
		setLength("")
		setQuantity("1")
	}, [
		thickness,
		width,
		length,
		quantity,
		woodSpecies,
		price,
		selectedUnit,
		lengthUnit,
		pricingType,
		canAddBoard,
	])

	// Remove board
	const removeBoard = useCallback((boardId: string) => {
		setBoards((prev) => prev.filter((board) => board.id !== boardId))
	}, [])

	// Update board
	const updateBoard = useCallback((updatedBoard: BoardEntry) => {
		setBoards((prev) =>
			prev.map((board) => (board.id === updatedBoard.id ? updatedBoard : board))
		)
	}, [])

	// Clear all
	const clearAll = useCallback(() => {
		setBoards([])
		setThickness("")
		setWidth("")
		setLength("")
		setQuantity("1")
		setWoodSpecies("")
		setPrice("")
		clearWorkInProgress()
	}, [])

	// Export data
	const exportData = useCallback(() => {
		let text = "Board Foot Calculator Export\n\n"

		// Group boards by species
		const boardsBySpecies = new Map<string, BoardEntry[]>()

		boards.forEach((board) => {
			const species = board.woodSpecies || "Unknown"
			if (!boardsBySpecies.has(species)) {
				boardsBySpecies.set(species, [])
			}
			boardsBySpecies.get(species)!.push(board)
		})

		// Output each species group
		boardsBySpecies.forEach((speciesBoards, species) => {
			text += `${species}:\n`

			let speciesBoardFeet = 0
			let speciesCost = 0

			speciesBoards.forEach((board) => {
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
		if (totalBoardFeet > 0) {
			text += `Total Board Feet: ${totalBoardFeet.toFixed(2)} bf\n`
		}
		if (totalCost > 0) {
			text += `Total Cost: $${totalCost.toFixed(2)}\n`
		}

		return text
	}, [boards, totalBoardFeet, totalCost])

	// Load order from history
	const loadOrder = useCallback((orderBoards: BoardEntry[]) => {
		setBoards(orderBoards)
		if (orderBoards.length > 0) {
			const firstBoard = orderBoards[0]
			setSelectedUnit(firstBoard.unit)
			if (firstBoard.lengthUnit) {
				setLengthUnit(firstBoard.lengthUnit)
			}
			if (firstBoard.pricingType) {
				setPricingType(firstBoard.pricingType)
			}
			if (firstBoard.woodSpecies) {
				setWoodSpecies(firstBoard.woodSpecies)
			}
			if (firstBoard.price) {
				setPrice(firstBoard.price.toString())
			}
		}
	}, [])

	return {
		// State
		selectedUnit,
		setSelectedUnit,
		lengthUnit,
		setLengthUnit,
		pricingType,
		setPricingType,
		thickness,
		setThickness,
		width,
		setWidth,
		length,
		setLength,
		quantity,
		setQuantity,
		woodSpecies,
		setWoodSpecies,
		price,
		setPrice,
		boards,
		setBoards,
		// Computed
		totalBoardFeet,
		totalCost,
		canAddBoard: canAddBoard(),
		// Methods
		addBoard,
		removeBoard,
		updateBoard,
		clearAll,
		exportData,
		loadOrder,
	}
}
