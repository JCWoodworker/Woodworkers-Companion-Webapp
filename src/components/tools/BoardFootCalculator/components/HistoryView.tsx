import { useState, useEffect } from "react"
import {
	FaArrowLeft,
	FaTrash,
	FaShare,
	FaEdit,
	FaClock,
	FaCalendar,
} from "react-icons/fa"
import type { SavedOrder } from "../../../../models/SavedOrderModels"
import {
	loadOrders,
	deleteOrder,
	deleteAllOrders,
} from "../../../../utils/localStorage"
import { generateExportText } from "../../../../models/SavedOrderModels"
import OrderDetailModal from "./OrderDetailModal"
import "./HistoryView.css"

interface HistoryViewProps {
	onBack: () => void
	onEdit: (order: SavedOrder) => void
}

const HistoryView = ({ onBack, onEdit }: HistoryViewProps) => {
	const [orders, setOrders] = useState<SavedOrder[]>([])
	const [selectedOrder, setSelectedOrder] = useState<SavedOrder | null>(null)
	const [isDetailOpen, setIsDetailOpen] = useState(false)
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

	useEffect(() => {
		loadOrdersFromStorage()

		const handleResize = () => {
			setIsMobile(window.innerWidth < 768)
		}

		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [])

	const loadOrdersFromStorage = () => {
		const loaded = loadOrders()
		// Sort by date, newest first
		loaded.sort((a, b) => b.date.getTime() - a.date.getTime())
		setOrders(loaded)
	}

	const handleDelete = (orderId: string) => {
		if (window.confirm("Are you sure you want to delete this order?")) {
			deleteOrder(orderId)
			loadOrdersFromStorage()
		}
	}

	const handleDeleteAll = () => {
		if (
			window.confirm(
				"Are you sure you want to delete ALL orders? This action cannot be undone."
			)
		) {
			deleteAllOrders()
			loadOrdersFromStorage()
		}
	}

	const handleShare = async (order: SavedOrder) => {
		const exportText = generateExportText(order)

		if (navigator.share) {
			try {
				await navigator.share({
					title: order.name,
					text: exportText,
				})
			} catch (error) {
				console.log("Share cancelled", error)
			}
		} else {
			navigator.clipboard.writeText(exportText)
			alert("Order details copied to clipboard!")
		}
	}

	const handleEdit = (order: SavedOrder) => {
		onEdit(order)
		onBack()
	}

	const handleViewDetails = (order: SavedOrder) => {
		setSelectedOrder(order)
		setIsDetailOpen(true)
	}

	const handleDetailClose = () => {
		setIsDetailOpen(false)
		setSelectedOrder(null)
		loadOrdersFromStorage() // Refresh in case of deletion
	}

	return (
		<div className="history-view">
			<div className="history-header">
				<button className="back-button" onClick={onBack} aria-label="Back">
					<FaArrowLeft size={24} />
				</button>
				<h1 className="history-title">Order History</h1>
				{orders.length > 0 && (
					<button
						className="delete-all-button"
						onClick={handleDeleteAll}
						aria-label="Delete All"
					>
						<FaTrash size={20} />
					</button>
				)}
			</div>

			<div className="history-content">
				{orders.length === 0 ? (
					<div className="empty-state">
						<p>No saved orders yet</p>
						<p className="empty-state-subtitle">
							Orders you save will appear here
						</p>
					</div>
				) : isMobile ? (
					// Mobile: Card View
					<div className="order-cards">
						{orders.map((order) => (
							<div
								key={order.id}
								className="order-card"
								onClick={() => handleViewDetails(order)}
							>
								<div className="order-card-header">
									<h3 className="order-card-name">{order.name}</h3>
									<div className="order-card-cost">
										${order.totalCost.toFixed(2)}
									</div>
								</div>
								<div className="order-card-meta">
									<div className="order-card-date">
										<FaCalendar size={14} />
										<span>{order.date.toLocaleDateString()}</span>
									</div>
									<div className="order-card-time">
										<FaClock size={14} />
										<span>{order.date.toLocaleTimeString()}</span>
									</div>
								</div>
								<div className="order-card-actions">
									<button
										onClick={(e) => {
											e.stopPropagation()
											handleEdit(order)
										}}
										className="order-action-btn edit"
									>
										<FaEdit /> Edit
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation()
											handleShare(order)
										}}
										className="order-action-btn share"
									>
										<FaShare /> Share
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation()
											handleDelete(order.id)
										}}
										className="order-action-btn delete"
									>
										<FaTrash /> Delete
									</button>
								</div>
							</div>
						))}
					</div>
				) : (
					// Desktop: Table View
					<div className="order-table-container">
						<table className="order-table">
							<thead>
								<tr>
									<th>Order Name</th>
									<th>Date</th>
									<th>Time</th>
									<th>Total</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{orders.map((order) => (
									<tr
										key={order.id}
										onClick={() => handleViewDetails(order)}
										className="order-row"
									>
										<td className="order-name">{order.name}</td>
										<td>{order.date.toLocaleDateString()}</td>
										<td>{order.date.toLocaleTimeString()}</td>
										<td className="order-cost">
											${order.totalCost.toFixed(2)}
										</td>
										<td className="order-actions">
											<button
												onClick={(e) => {
													e.stopPropagation()
													handleEdit(order)
												}}
												className="order-action-btn edit"
												title="Edit"
											>
												<FaEdit />
											</button>
											<button
												onClick={(e) => {
													e.stopPropagation()
													handleShare(order)
												}}
												className="order-action-btn share"
												title="Share"
											>
												<FaShare />
											</button>
											<button
												onClick={(e) => {
													e.stopPropagation()
													handleDelete(order.id)
												}}
												className="order-action-btn delete"
												title="Delete"
											>
												<FaTrash />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			<OrderDetailModal
				open={isDetailOpen}
				order={selectedOrder}
				onClose={handleDetailClose}
				onDelete={handleDelete}
			/>
		</div>
	)
}

export default HistoryView
