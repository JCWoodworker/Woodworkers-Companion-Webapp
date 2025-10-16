import { describe, it, expect } from "vitest"
import type { BoardEntry } from "./BoardFootModels"
import {
	MeasurementUnit,
	LengthUnit,
	PricingType,
	calculateBoardFeet,
	calculateCost,
	getBoardDisplayString,
} from "./BoardFootModels"

describe("BoardFootModels", () => {
	describe("calculateBoardFeet", () => {
		it("should calculate board feet correctly for imperial measurements", () => {
			const board: BoardEntry = {
				id: "1",
				thickness: 8, // 8/4" = 2"
				width: 6,
				length: 8,
				quantity: 1,
				unit: MeasurementUnit.Imperial,
				lengthUnit: LengthUnit.Feet,
				price: 5.0,
				pricingType: PricingType.PerBoardFoot,
				woodSpecies: "Oak",
			}

			const result = calculateBoardFeet(board)
			expect(result).toBeCloseTo(8.0, 1) // 2" × 6" × 8' / 12 = 8 bf
		})

		it("should return 0 for linear pricing", () => {
			const board: BoardEntry = {
				id: "1",
				thickness: null,
				width: null,
				length: 8,
				quantity: 1,
				unit: MeasurementUnit.Imperial,
				lengthUnit: LengthUnit.Feet,
				price: 5.0,
				pricingType: PricingType.Linear,
				woodSpecies: "Pine",
			}

			const result = calculateBoardFeet(board)
			expect(result).toBe(0)
		})

		it("should handle imperial length in inches", () => {
			const board: BoardEntry = {
				id: "1",
				thickness: 4, // 4/4" = 1"
				width: 6,
				length: 96, // 96 inches = 8 feet
				quantity: 1,
				unit: MeasurementUnit.Imperial,
				lengthUnit: LengthUnit.Inches,
				price: 5.0,
				pricingType: PricingType.PerBoardFoot,
				woodSpecies: "Oak",
			}

			const result = calculateBoardFeet(board)
			expect(result).toBeCloseTo(4.0, 1) // 1" × 6" × 8' / 12 = 4 bf
		})
	})

	describe("calculateCost", () => {
		it("should calculate cost correctly for per board foot pricing", () => {
			const board: BoardEntry = {
				id: "1",
				thickness: 8,
				width: 6,
				length: 8,
				quantity: 1,
				unit: MeasurementUnit.Imperial,
				lengthUnit: LengthUnit.Feet,
				price: 5.0,
				pricingType: PricingType.PerBoardFoot,
				woodSpecies: "Oak",
			}

			const result = calculateCost(board)
			expect(result).toBeCloseTo(40.0, 1) // 8 bf × $5.00 = $40.00
		})

		it("should calculate cost correctly for linear pricing", () => {
			const board: BoardEntry = {
				id: "1",
				thickness: null,
				width: null,
				length: 8,
				quantity: 2,
				unit: MeasurementUnit.Imperial,
				lengthUnit: LengthUnit.Feet,
				price: 3.0,
				pricingType: PricingType.Linear,
				woodSpecies: "Pine",
			}

			const result = calculateCost(board)
			expect(result).toBe(48.0) // 8' × $3.00 × 2 = $48.00
		})

		it("should return 0 when price is null", () => {
			const board: BoardEntry = {
				id: "1",
				thickness: 8,
				width: 6,
				length: 8,
				quantity: 1,
				unit: MeasurementUnit.Imperial,
				lengthUnit: LengthUnit.Feet,
				price: null,
				pricingType: PricingType.PerBoardFoot,
				woodSpecies: "Oak",
			}

			const result = calculateCost(board)
			expect(result).toBe(0)
		})
	})

	describe("getBoardDisplayString", () => {
		it("should format imperial board foot board correctly", () => {
			const board: BoardEntry = {
				id: "1",
				thickness: 8,
				width: 6,
				length: 8,
				quantity: 1,
				unit: MeasurementUnit.Imperial,
				lengthUnit: LengthUnit.Feet,
				price: 5.0,
				pricingType: PricingType.PerBoardFoot,
				woodSpecies: "Oak",
			}

			const result = getBoardDisplayString(board)
			expect(result).toBe('8/4" × 6" × 8\' - Oak')
		})

		it("should format linear board correctly", () => {
			const board: BoardEntry = {
				id: "1",
				thickness: null,
				width: null,
				length: 8,
				quantity: 1,
				unit: MeasurementUnit.Imperial,
				lengthUnit: LengthUnit.Feet,
				price: 3.0,
				pricingType: PricingType.Linear,
				woodSpecies: "Pine",
			}

			const result = getBoardDisplayString(board)
			expect(result).toBe("8' - Pine")
		})

		it("should include quantity when greater than 1", () => {
			const board: BoardEntry = {
				id: "1",
				thickness: 4,
				width: 6,
				length: 8,
				quantity: 5,
				unit: MeasurementUnit.Imperial,
				lengthUnit: LengthUnit.Feet,
				price: 5.0,
				pricingType: PricingType.PerBoardFoot,
				woodSpecies: "Maple",
			}

			const result = getBoardDisplayString(board)
			expect(result).toBe('5 × 4/4" × 6" × 8\' - Maple')
		})
	})
})
