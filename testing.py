from math import comb



def index_to_gap_array(index, total_sum=71, positions=11):
    # Convert index to gap array using combinatorial number system
    gaps = [0] * positions
    remaining = total_sum

    for i in range(positions - 1):
        # Find largest k where C(remaining + positions - i - 1, positions - i - 1) <= index
        k = 0
        while comb(remaining - k + positions - i - 2, positions - i - 2) > index:
            k += 1
        gaps[i] = k
        remaining -= k
        if remaining + positions - i - 2 >= 0:
            index -= comb(remaining + positions - i - 2, positions - i - 2)

    gaps[-1] = remaining
    return gaps



for i in range(4):
    print(index_to_gap_array(i))