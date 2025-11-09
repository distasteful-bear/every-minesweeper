import MineSweeperBoard from "@/components/MineSweeperBoard";

function generateRandomBoard(boardSize: number, mines: number) {
    var seed: number[] = []
    const totalCellsToAllocate = (boardSize ** 2) - mines

    var total = 0
    for (let i = 0; i <= mines; i++) {
        var value = Math.round((totalCellsToAllocate / mines) * (Math.random() + 0.5))
        total += value
        seed.push(value)
    }
    console.log(
        "array before cleaning: ", seed
    )

    var err = totalCellsToAllocate - total
    var seedLength = seed.length
    while (err != 0) {
        const i = Math.round(seedLength * Math.random())
        if (err > 0) {
            seed[i]++
            err--
        }
        if (err < 0) {
            seed[i]--
            err++
        }
    }
    console.log("array after cleaning:", seed)
    return seed
}

export default function PlayDemo() {

    const seed_array: number[] = generateRandomBoard(9, 10)

    return (
        <MineSweeperBoard size={9} seed={seed_array} />
    )
}