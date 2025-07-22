from typing import List


def binomial(n: int, k: int) -> int:
    """Calculate binomial coefficient C(n,k) efficiently"""
    if k > n or k < 0:
        return 0
    if k == 0 or k == n:
        return 1

    # Use the more efficient formula and avoid large factorials
    k = min(k, n - k)  # Take advantage of symmetry
    result = 1
    for i in range(k):
        result = result * (n - i) // (i + 1)
    return result


def gap_array_to_index(gaps: List[int], total_sum: int = 71, positions: int = 11) -> int:
    """
    Convert a gap array to its unique index using combinatorial number system.

    This uses the stars and bars bijection where we map gap arrays to 
    combinations of positions for the "bars" (mine locations).

    Args:
        gaps: List of 11 non-negative integers that sum to 71
        total_sum: Total sum of gaps (71 for our minesweeper problem)
        positions: Number of positions in gap array (11 for our problem)

    Returns:
        Integer index from 0 to C(81,10)-1
    """
    if len(gaps) != positions:
        raise ValueError(f"Gap array must have exactly {positions} elements")
    if sum(gaps) != total_sum:
        raise ValueError(f"Gap array must sum to {total_sum}")

    # Convert gaps to cumulative positions of the "bars"
    # In stars and bars, we have 71 stars and 10 bars
    # The bars are placed at positions that correspond to cumulative gap sums
    bar_positions = []
    cumulative = 0

    for i in range(positions - 1):  # Only first 10 gaps create bars
        cumulative += gaps[i]
        # +i accounts for the bars themselves
        bar_positions.append(cumulative + i)

    # Convert combination to index using combinatorial number system
    index = 0
    n = total_sum + positions - 1  # 71 + 11 - 1 = 81

    for i, pos in enumerate(sorted(bar_positions)):
        # Add all combinations where the i-th element is smaller than pos
        for smaller_pos in range(0 if i == 0 else sorted(bar_positions)[i-1] + 1, pos):
            # Count combinations with this smaller position
            remaining_positions = len(bar_positions) - i - 1
            max_remaining = n - 1 - smaller_pos
            index += binomial(max_remaining, remaining_positions)

    return index


def index_to_gap_array(index: int, total_sum: int = 71, positions: int = 11) -> List[int]:
    """
    Convert an index back to its corresponding gap array.

    Args:
        index: Integer from 0 to C(81,10)-1
        total_sum: Total sum that gaps should add to (71)
        positions: Number of positions in gap array (11)

    Returns:
        List of 11 integers representing the gap array
    """
    if index < 0 or index >= binomial(total_sum + positions - 1, positions - 1):
        raise ValueError(
            f"Index must be between 0 and {binomial(total_sum + positions - 1, positions - 1) - 1}")

    # Find the combination corresponding to this index
    bar_positions = []
    remaining_index = index
    n = total_sum + positions - 1  # 81
    k = positions - 1  # 10

    current_pos = 0
    for i in range(k):
        # Find the position of the i-th bar
        while True:
            # Count combinations if we place the bar at current_pos
            remaining_k = k - i - 1
            remaining_n = n - 1 - current_pos
            combinations_with_this_pos = binomial(remaining_n, remaining_k)

            if remaining_index < combinations_with_this_pos:
                # This is the correct position
                bar_positions.append(current_pos)
                break
            else:
                # Try next position
                remaining_index -= combinations_with_this_pos
                current_pos += 1

        current_pos += 1  # Next bar must be at least one position later

    # Convert bar positions back to gaps
    gaps = [0] * positions
    prev_pos = -1

    for i, bar_pos in enumerate(bar_positions):
        # Gap before this bar (accounting for previous bars)
        gaps[i] = bar_pos - prev_pos - 1
        prev_pos = bar_pos

    # Last gap gets the remainder
    gaps[-1] = n - 1 - prev_pos

    return gaps


def verify_bijection(num_tests: int = 1000) -> bool:
    """
    Verify that our bijection functions are correct by testing round-trips.
    """
    import random

    total_boards = binomial(81, 10)
    print(f"Total possible boards: {total_boards:,}")

    success_count = 0

    for _ in range(num_tests):
        # Test 1: Random index -> gap array -> index
        test_index = random.randint(0, total_boards - 1)
        gap_array = index_to_gap_array(test_index)
        recovered_index = gap_array_to_index(gap_array)

        if test_index == recovered_index:
            success_count += 1
        else:
            print(f"FAIL: {test_index} -> {gap_array} -> {recovered_index}")
            return False

    print(f"All {num_tests} round-trip tests passed!")
    return True


"""
# Example usage and demonstration
if __name__ == "__main__":
    # Example gap arrays from your original post
    example_gaps_1 = [0, 1, 44, 2, 3, 12, 1, 1, 1, 1, 5]
    example_gaps_2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 71]

    print("=== Gap Array to Index Bijection ===\n")

    # Test the examples
    print("Example 1:", example_gaps_1)
    index_1 = gap_array_to_index(example_gaps_1)
    print(f"Index: {index_1:,}")
    recovered_1 = index_to_gap_array(index_1)
    print(f"Recovered: {recovered_1}")
    print(f"Match: {example_gaps_1 == recovered_1}\n")

    print("Example 2:", example_gaps_2)
    index_2 = gap_array_to_index(example_gaps_2)
    print(f"Index: {index_2:,}")
    recovered_2 = index_to_gap_array(index_2)
    print(f"Recovered: {recovered_2}")
    print(f"Match: {example_gaps_2 == recovered_2}\n")

    # Test edge cases
    print("=== Edge Cases ===")

    # First possible gap array
    first_gaps = index_to_gap_array(0)
    print(f"Index 0: {first_gaps}")

    # Last possible gap array
    last_index = binomial(81, 10) - 1
    last_gaps = index_to_gap_array(last_index)
    print(f"Index {last_index:,}: {last_gaps}")

    print("\n=== Verification ===")
    verify_bijection(1000)


"""


# FYI, this was almost entirely claude so it may be buggy.
