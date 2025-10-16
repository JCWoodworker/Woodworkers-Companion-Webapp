import { FaTrash } from "react-icons/fa"
import type { BoardEntry } from "../../../../models/BoardFootModels"
import {
	calculateBoardFeet,
	calculateCost,
	getBoardDisplayString,
} from "../../../../models/BoardFootModels"
import "./BoardList.css"

interface BoardListProps {
	boards: BoardEntry[]
	onDelete: (boardId: string) => void
	onEdit: (board: BoardEntry) => void
}

const BoardList = ({ boards, onDelete, onEdit }: BoardListProps) => {
	return (
		<div className="board-list-container">
			<h3 className="board-list-title">Boards</h3>
			<div className="board-list">
				{boards.map((board) => {
					const boardFeet = calculateBoardFeet(board)
					const cost = calculateCost(board)

					return (
						<div
							key={board.id}
							className="board-row"
							onClick={() => onEdit(board)}
						>
							<div className="board-info">
								<div className="board-dimensions">
									{getBoardDisplayString(board)}
								</div>
								<div className="board-details">
									{boardFeet > 0 && <span>{boardFeet.toFixed(2)} bf</span>}
									{cost > 0 && <span>${cost.toFixed(2)}</span>}
								</div>
							</div>
							<button
								className="board-delete-btn"
								onClick={(e) => {
									e.stopPropagation()
									onDelete(board.id)
								}}
								aria-label="Delete board"
							>
								<FaTrash />
							</button>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default BoardList
