import type { BoardEntry } from "../models/BoardFootModels"
import type { SavedOrder } from "../models/SavedOrderModels"

const STORAGE_KEYS = {
	SAVED_ORDERS: "savedOrders",
	WORK_IN_PROGRESS: "workInProgress",
}

// Save an order to localStorage
export const saveOrder = (order: SavedOrder): void => {
	try {
		const orders = loadOrders()
		// Ensure date is properly formatted when saving
		const orderToSave = {
			...order,
			date: order.date.toISOString(),
		}
		orders.push(orderToSave as any)
		localStorage.setItem(STORAGE_KEYS.SAVED_ORDERS, JSON.stringify(orders))
	} catch (error) {
		console.error("Error saving order:", error)
	}
}

// Load all orders from localStorage
export const loadOrders = (): SavedOrder[] => {
	try {
		const data = localStorage.getItem(STORAGE_KEYS.SAVED_ORDERS)
		if (!data) return []

		const orders = JSON.parse(data) as SavedOrder[]
		// Convert date strings back to Date objects
		return orders.map((order) => ({
			...order,
			date: new Date(order.date),
		}))
	} catch (error) {
		console.error("Error loading orders:", error)
		return []
	}
}

// Delete an order by ID
export const deleteOrder = (orderId: string): void => {
	try {
		const orders = loadOrders()
		const filtered = orders.filter((order) => order.id !== orderId)
		localStorage.setItem(STORAGE_KEYS.SAVED_ORDERS, JSON.stringify(filtered))
	} catch (error) {
		console.error("Error deleting order:", error)
	}
}

// Delete all orders
export const deleteAllOrders = (): void => {
	try {
		localStorage.removeItem(STORAGE_KEYS.SAVED_ORDERS)
	} catch (error) {
		console.error("Error deleting all orders:", error)
	}
}

// Get the next order number
export const getNextOrderNumber = (): number => {
	const orders = loadOrders()
	if (orders.length === 0) return 1

	// Find the highest order number
	let maxNumber = 0
	orders.forEach((order) => {
		const match = order.name.match(/Order (\d+)/)
		if (match) {
			const num = parseInt(match[1], 10)
			if (num > maxNumber) maxNumber = num
		}
	})

	return maxNumber + 1
}

// Save work in progress
export const saveWorkInProgress = (boards: BoardEntry[]): void => {
	try {
		localStorage.setItem(STORAGE_KEYS.WORK_IN_PROGRESS, JSON.stringify(boards))
	} catch (error) {
		console.error("Error saving work in progress:", error)
	}
}

// Load work in progress
export const loadWorkInProgress = (): BoardEntry[] | null => {
	try {
		const data = localStorage.getItem(STORAGE_KEYS.WORK_IN_PROGRESS)
		if (!data) return null
		return JSON.parse(data) as BoardEntry[]
	} catch (error) {
		console.error("Error loading work in progress:", error)
		return null
	}
}

// Clear work in progress
export const clearWorkInProgress = (): void => {
	try {
		localStorage.removeItem(STORAGE_KEYS.WORK_IN_PROGRESS)
	} catch (error) {
		console.error("Error clearing work in progress:", error)
	}
}

// Update an existing order
export const updateOrder = (updatedOrder: SavedOrder): void => {
	try {
		const orders = loadOrders()
		const index = orders.findIndex((order) => order.id === updatedOrder.id)
		if (index !== -1) {
			// Ensure date is properly formatted when saving
			const orderToSave = {
				...updatedOrder,
				date: updatedOrder.date.toISOString(),
			}
			orders[index] = orderToSave as any
			localStorage.setItem(STORAGE_KEYS.SAVED_ORDERS, JSON.stringify(orders))
		}
	} catch (error) {
		console.error("Error updating order:", error)
	}
}
