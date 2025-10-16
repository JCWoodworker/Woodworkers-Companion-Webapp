import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
} from "@mui/material"
import { FaShare, FaTrash } from "react-icons/fa"
import type { SavedOrder } from "../../../../models/SavedOrderModels"
import { generateExportText } from "../../../../models/SavedOrderModels"
import "./OrderDetailModal.css"

interface OrderDetailModalProps {
	open: boolean
	order: SavedOrder | null
	onClose: () => void
	onDelete: (orderId: string) => void
}

const OrderDetailModal = ({
	open,
	order,
	onClose,
	onDelete,
}: OrderDetailModalProps) => {
	if (!order) return null

	const exportText = generateExportText(order)

	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: order.name,
					text: exportText,
				})
			} catch (error) {
				// User cancelled or error occurred
				console.log("Share cancelled")
			}
		} else {
			// Fallback: copy to clipboard
			navigator.clipboard.writeText(exportText)
			alert("Order details copied to clipboard!")
		}
	}

	const handlePrint = () => {
		const printWindow = window.open("", "_blank")
		if (printWindow) {
			printWindow.document.write(`
				<html>
					<head>
						<title>${order.name}</title>
						<style>
							body { font-family: monospace; padding: 20px; }
							pre { white-space: pre-wrap; }
						</style>
					</head>
					<body>
						<pre>${exportText}</pre>
					</body>
				</html>
			`)
			printWindow.document.close()
			printWindow.print()
		}
	}

	const handleDelete = () => {
		if (window.confirm(`Are you sure you want to delete "${order.name}"?`)) {
			onDelete(order.id)
			onClose()
		}
	}

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>{order.name}</DialogTitle>
			<DialogContent>
				<div className="order-detail-content">
					<pre className="order-export-text">{exportText}</pre>
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleDelete} color="error" startIcon={<FaTrash />}>
					Delete
				</Button>
				<Button onClick={handleShare} startIcon={<FaShare />}>
					Share
				</Button>
				<Button onClick={handlePrint}>Print</Button>
				<Button onClick={onClose} variant="contained">
					Done
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default OrderDetailModal
