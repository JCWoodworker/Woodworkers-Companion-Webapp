import { useState, useEffect } from "react"
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
} from "@mui/material"
import type { BoardEntry } from "../../../../models/BoardFootModels"
import { createSavedOrder } from "../../../../models/SavedOrderModels"
import {
	saveOrder,
	getNextOrderNumber,
	clearWorkInProgress,
} from "../../../../utils/localStorage"

interface SaveOrderModalProps {
	open: boolean
	boards: BoardEntry[]
	onClose: () => void
	onSaved: () => void
}

const SaveOrderModal = ({
	open,
	boards,
	onClose,
	onSaved,
}: SaveOrderModalProps) => {
	const [orderName, setOrderName] = useState("")
	const [nextNumber, setNextNumber] = useState(1)

	useEffect(() => {
		if (open) {
			setNextNumber(getNextOrderNumber())
			setOrderName("")
		}
	}, [open])

	const handleSave = (name: string) => {
		const order = createSavedOrder(name, boards, nextNumber)
		saveOrder(order)
		clearWorkInProgress()
		onSaved()
		onClose()
	}

	const handleSaveWithName = () => {
		handleSave(orderName)
	}

	const handleSkipNaming = () => {
		handleSave("")
	}

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Save Order</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					label="Order Name"
					type="text"
					fullWidth
					variant="outlined"
					value={orderName}
					onChange={(e) => setOrderName(e.target.value)}
					placeholder={`Order ${nextNumber}`}
					onKeyPress={(e) => {
						if (e.key === "Enter" && orderName.trim()) {
							handleSaveWithName()
						}
					}}
				/>
				<div style={{ marginTop: "12px", color: "#666", fontSize: "0.9rem" }}>
					Leave blank to use default name: Order {nextNumber}
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSkipNaming} color="secondary">
					Use Default Name
				</Button>
				<Button
					onClick={handleSaveWithName}
					variant="contained"
					disabled={!orderName.trim()}
				>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default SaveOrderModal
