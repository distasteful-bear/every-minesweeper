

def display_board_state(gap_array, row_len, mines):
    print("minesweeper board:")

    board_in_1d = []

    mine_counter = 0
    for gap in gap_array:
        gap_counter = gap
        while gap_counter > 0:
            board_in_1d.append("_")
            gap_counter -= 1

        if mine_counter < mines:
            board_in_1d.append("0")
            mine_counter += 1

    for i in range(row_len):
        print("|".join(board_in_1d[(i*row_len):(i*row_len) + row_len]))


# sample_board_config = [0, 1, 44, 2, 3, 12, 1, 1, 1, 1, 5]
# display_board_state(sample_board_config, 9, 10)
