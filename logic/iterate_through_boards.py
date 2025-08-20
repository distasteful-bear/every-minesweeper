import os
import time
from gap_array import index_to_gap_array
from display_board_state import display_board_state


delay = 3


for i in range(1700000000000, 1800000000000):

    gap_array = index_to_gap_array(i)

    print("Gap Array:", gap_array)

    display_board_state(gap_array, 9, 10)

    if delay > 0.01:
        time.sleep(delay)
        delay = delay / 1.5
    else:
        time.sleep(0.1)

    os.system('cls')
