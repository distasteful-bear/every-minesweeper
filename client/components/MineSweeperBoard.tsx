import { useState, useEffect } from "react"

export default function MineSweeperBoard(props: { size: number, seed: number[] }) {
    type GameState = "setup" | "play" | "win" | "loss"
    type CellState = "hidden" | "revealed" | "flagged"

    interface Cell {
        hasMine: boolean
        neighborMines: number
        state: CellState
    }

    const [gameState, setGameState] = useState<GameState>('setup')
    const [board, setBoard] = useState<Cell[][]>([])
    const [flagMode, setFlagMode] = useState(false)
    const [minesRemaining, setMinesRemaining] = useState(0)

    const totalCells = props.size ** 2
    const totalMines = props.seed.length - 1

    // Initialize board
    useEffect(() => {
        initializeBoard()
    }, [props.size, props.seed])

    function initializeBoard() {
        // Create empty board
        const newBoard: Cell[][] = Array(props.size).fill(null).map(() =>
            Array(props.size).fill(null).map(() => ({
                hasMine: false,
                neighborMines: 0,
                state: "hidden" as CellState
            }))
        )

        // Place mines using seed
        let seedIndex = 0
        let cellCounter = 0
        let minesPlaced = 0

        for (let row = 0; row < props.size; row++) {
            for (let col = 0; col < props.size; col++) {
                if (minesPlaced >= totalMines) break
                
                if (cellCounter >= props.seed[seedIndex]) {
                    newBoard[row][col].hasMine = true
                    minesPlaced++
                    seedIndex++
                    cellCounter = 0
                } else {
                    cellCounter++
                }
            }
            if (minesPlaced >= totalMines) break
        }

        // Calculate neighbor mines
        for (let row = 0; row < props.size; row++) {
            for (let col = 0; col < props.size; col++) {
                if (!newBoard[row][col].hasMine) {
                    newBoard[row][col].neighborMines = countNeighborMines(newBoard, row, col)
                }
            }
        }

        setBoard(newBoard)
        setGameState('play')
        setMinesRemaining(totalMines)
    }

    function countNeighborMines(b: Cell[][], row: number, col: number): number {
        let count = 0
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue
                const newRow = row + dr
                const newCol = col + dc
                if (newRow >= 0 && newRow < props.size && newCol >= 0 && newCol < props.size) {
                    if (b[newRow][newCol].hasMine) count++
                }
            }
        }
        return count
    }

    function handleCellClick(row: number, col: number) {
        if (gameState !== 'play') return
        if (board[row][col].state === 'revealed') return

        if (flagMode) {
            toggleFlag(row, col)
        } else {
            revealCell(row, col)
        }
    }

    function toggleFlag(row: number, col: number) {
        const newBoard = board.map(r => r.map(c => ({ ...c })))
        
        if (newBoard[row][col].state === 'hidden') {
            newBoard[row][col].state = 'flagged'
            setMinesRemaining(prev => prev - 1)
        } else if (newBoard[row][col].state === 'flagged') {
            newBoard[row][col].state = 'hidden'
            setMinesRemaining(prev => prev + 1)
        }
        
        setBoard(newBoard)
    }

    function revealCell(row: number, col: number) {
        if (board[row][col].state !== 'hidden') return

        const newBoard = board.map(r => r.map(c => ({ ...c })))

        if (newBoard[row][col].hasMine) {
            // Game over - reveal all mines
            for (let r = 0; r < props.size; r++) {
                for (let c = 0; c < props.size; c++) {
                    if (newBoard[r][c].hasMine) {
                        newBoard[r][c].state = 'revealed'
                    }
                }
            }
            setBoard(newBoard)
            setGameState('loss')
            return
        }

        // Reveal cell and cascade if empty
        const toReveal: [number, number][] = [[row, col]]
        const visited = new Set<string>()

        while (toReveal.length > 0) {
            const [r, c] = toReveal.shift()!
            const key = `${r},${c}`
            
            if (visited.has(key)) continue
            visited.add(key)

            if (r < 0 || r >= props.size || c < 0 || c >= props.size) continue
            if (newBoard[r][c].state !== 'hidden') continue
            if (newBoard[r][c].hasMine) continue

            newBoard[r][c].state = 'revealed'

            // If no neighbor mines, cascade to neighbors
            if (newBoard[r][c].neighborMines === 0) {
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue
                        toReveal.push([r + dr, c + dc])
                    }
                }
            }
        }

        setBoard(newBoard)
        checkWin(newBoard)
    }

    function checkWin(b: Cell[][]) {
        let allNonMinesRevealed = true
        for (let row = 0; row < props.size; row++) {
            for (let col = 0; col < props.size; col++) {
                if (!b[row][col].hasMine && b[row][col].state !== 'revealed') {
                    allNonMinesRevealed = false
                    break
                }
            }
            if (!allNonMinesRevealed) break
        }

        if (allNonMinesRevealed) {
            setGameState('win')
        }
    }

    function getCellColor(count: number): string {
        const colors = ['#3b82f6', '#22c55e', '#ef4444', '#8b5cf6', '#f97316', '#ec4899', '#14b8a6', '#64748b']
        return colors[count - 1] || '#64748b'
    }

    // SVG Icons
    const MineIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="7" fill="#ff6b6b" stroke="#ff0000" strokeWidth="1.5"/>
            <circle cx="12" cy="12" r="3" fill="#000"/>
            <line x1="12" y1="5" x2="12" y2="8" stroke="#000" strokeWidth="2"/>
            <line x1="12" y1="16" x2="12" y2="19" stroke="#000" strokeWidth="2"/>
            <line x1="5" y1="12" x2="8" y2="12" stroke="#000" strokeWidth="2"/>
            <line x1="16" y1="12" x2="19" y2="12" stroke="#000" strokeWidth="2"/>
        </svg>
    )

    const FlagIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 21V4M4 8C4 8 5 6 8 6C11 6 13 8 16 8C19 8 20 6 20 6V14C20 14 19 16 16 16C13 16 11 14 8 14C5 14 4 16 4 16" 
                  stroke="#00d9ff" fill="#00d9ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )

    const SearchIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#00ff88" strokeWidth="2"/>
            <path d="M16 16L20 20" stroke="#00ff88" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    )

    const ResetIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C14.39 3 16.58 3.92 18.22 5.5" 
                  stroke="#ffaa00" strokeWidth="2" strokeLinecap="round"/>
            <path d="M18 3V6H21" stroke="#ffaa00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #0a0e27 0%, #1a1f3a 50%, #2d1b2e 100%)',
            padding: '20px',
            fontFamily: '"Courier New", monospace',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Scanline effect */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.15) 3px)',
                pointerEvents: 'none',
                zIndex: 1
            }}/>
            
            <div style={{
                background: 'linear-gradient(145deg, rgba(20,25,45,0.95), rgba(15,20,35,0.98))',
                border: '3px solid #00d9ff',
                boxShadow: '0 0 30px rgba(0,217,255,0.4), inset 0 0 20px rgba(0,217,255,0.1)',
                padding: '25px',
                position: 'relative',
                zIndex: 2
            }}>
                <h1 style={{
                    textAlign: 'center',
                    marginTop: 0,
                    marginBottom: '20px',
                    fontSize: '36px',
                    fontWeight: '700',
                    color: '#00ff88',
                    textShadow: '0 0 10px #00ff88, 0 0 20px #00ff88, 2px 2px 0px #ff006e',
                    fontFamily: '"Courier New", monospace',
                    letterSpacing: '3px',
                    textTransform: 'uppercase'
                }}>
                    MINESWEEPER
                </h1>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    gap: '12px',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        background: 'rgba(0,0,0,0.6)',
                        padding: '8px 16px',
                        border: '2px solid #ff006e',
                        fontWeight: '700',
                        color: '#00d9ff',
                        fontFamily: '"Courier New", monospace',
                        fontSize: '18px',
                        boxShadow: '0 0 15px rgba(255,0,110,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <MineIcon />
                        <span>{minesRemaining}</span>
                    </div>

                    <button
                        onClick={() => setFlagMode(!flagMode)}
                        style={{
                            padding: '8px 16px',
                            border: flagMode ? '2px solid #00d9ff' : '2px solid #00ff88',
                            background: 'rgba(0,0,0,0.7)',
                            color: flagMode ? '#00d9ff' : '#00ff88',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '14px',
                            fontFamily: '"Courier New", monospace',
                            textTransform: 'uppercase',
                            boxShadow: flagMode ? '0 0 15px rgba(0,217,255,0.6)' : '0 0 15px rgba(0,255,136,0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            letterSpacing: '1px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = flagMode ? 'rgba(0,217,255,0.2)' : 'rgba(0,255,136,0.2)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(0,0,0,0.7)'
                        }}
                    >
                        {flagMode ? <><FlagIcon /> FLAG</> : <><SearchIcon /> SCAN</>}
                    </button>

                    <button
                        onClick={initializeBoard}
                        style={{
                            padding: '8px 16px',
                            border: '2px solid #ffaa00',
                            background: 'rgba(0,0,0,0.7)',
                            color: '#ffaa00',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '14px',
                            fontFamily: '"Courier New", monospace',
                            textTransform: 'uppercase',
                            boxShadow: '0 0 15px rgba(255,170,0,0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            letterSpacing: '1px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,170,0,0.2)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(0,0,0,0.7)'
                        }}
                    >
                        <ResetIcon /> RESET
                    </button>
                </div>

                {gameState === 'win' && (
                    <div style={{
                        background: 'rgba(0,255,136,0.2)',
                        border: '2px solid #00ff88',
                        color: '#00ff88',
                        padding: '12px',
                        textAlign: 'center',
                        fontWeight: '700',
                        marginBottom: '15px',
                        fontSize: '16px',
                        fontFamily: '"Courier New", monospace',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        boxShadow: '0 0 20px rgba(0,255,136,0.6), inset 0 0 20px rgba(0,255,136,0.2)',
                        animation: 'pulse 1.5s infinite'
                    }}>
                        MISSION COMPLETE
                    </div>
                )}

                {gameState === 'loss' && (
                    <div style={{
                        background: 'rgba(255,0,110,0.2)',
                        border: '2px solid #ff006e',
                        color: '#ff006e',
                        padding: '12px',
                        textAlign: 'center',
                        fontWeight: '700',
                        marginBottom: '15px',
                        fontSize: '16px',
                        fontFamily: '"Courier New", monospace',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        boxShadow: '0 0 20px rgba(255,0,110,0.6), inset 0 0 20px rgba(255,0,110,0.2)',
                        animation: 'pulse 1.5s infinite'
                    }}>
                        SYSTEM BREACH
                    </div>
                )}

                <div style={{
                    display: 'inline-block',
                    background: 'rgba(0,0,0,0.5)',
                    padding: '6px',
                    border: '2px solid rgba(0,217,255,0.3)',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
                }}>
                    {board.map((row, rowIdx) => (
                        <div key={`row-${rowIdx}`} style={{ display: 'flex' }}>
                            {row.map((cell, colIdx) => (
                                <BoardCell
                                    key={`cell-${rowIdx}-${colIdx}`}
                                    cell={cell}
                                    onClick={() => handleCellClick(rowIdx, colIdx)}
                                    getCellColor={getCellColor}
                                    gameState={gameState}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }
            `}</style>
        </div>
    )
}

function BoardCell(props: {
    cell: { hasMine: boolean, neighborMines: number, state: "hidden" | "revealed" | "flagged" }
    onClick: () => void
    getCellColor: (count: number) => string
    gameState: string
}) {
    const { cell, onClick, getCellColor, gameState } = props

    const baseStyle: React.CSSProperties = {
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '2px',
        borderRadius: '4px',
        fontWeight: '700',
        fontSize: '18px',
        cursor: gameState === 'play' ? 'pointer' : 'default',
        transition: 'all 0.1s',
        userSelect: 'none'
    }

    if (cell.state === 'hidden') {
        return (
            <div
                onClick={onClick}
                style={{
                    ...baseStyle,
                    background: 'linear-gradient(145deg, #94a3b8, #64748b)',
                    boxShadow: '2px 2px 5px rgba(0,0,0,0.2), inset -1px -1px 3px rgba(0,0,0,0.3)',
                }}
                onMouseEnter={(e) => {
                    if (gameState === 'play') {
                        e.currentTarget.style.transform = 'scale(0.95)'
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                }}
            />
        )
    }

    if (cell.state === 'flagged') {
        return (
            <div
                onClick={onClick}
                style={{
                    ...baseStyle,
                    background: 'linear-gradient(145deg, #fca5a5, #ef4444)',
                    boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
                    color: 'white'
                }}
            >
                🚩
            </div>
        )
    }

    // Revealed
    if (cell.hasMine) {
        return (
            <div
                style={{
                    ...baseStyle,
                    background: '#ef4444',
                    color: 'white',
                    boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.3)',
                    fontSize: '22px'
                }}
            >
                💣
            </div>
        )
    }

    return (
        <div
            style={{
                ...baseStyle,
                background: '#f1f5f9',
                color: cell.neighborMines > 0 ? getCellColor(cell.neighborMines) : '#cbd5e1',
                boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.1)',
                cursor: 'default'
            }}
        >
            {cell.neighborMines > 0 ? cell.neighborMines : ''}
        </div>
    )
}