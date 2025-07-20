# For MineSweeper, How many possible boards are there and how do we ID them?

## Work on my own:

(For all of these examples I will be using a 9x9 grid with 10 bombs.)

Well the obvious idea about how many options there are is to count all available spaces to place a bomb and place them one at a time.
Lets call this board counting theory #1.

This produces:
81 \* 80 \* 79 \* 78 \* 77 \* 76 \* 75 \* 74 \* 73 \* 72
= 6.816310368×10^18

Which is very very large. However this is not entirely a fair calculation. Because one options with this method is that the bombs are placed in first 10 slots:
(0,1), (0,2), (0,3), (0,4), (0,5), (0,6), (0,7), (0,8), (0,9), (1,0)

However using the same logic of placement, the following is a 'unique' placement based on our board counting theory #1
(0,2), (0,1), (0,3), (0,4), (0,5), (0,6), (0,7), (0,8), (0,9), (1,0)

This is a single swap of a bomb, which to the player is identical. In this exact configuration, with all 10 bombs at the start, there are 10 factorial (3,628,800) boards being counted in our theory #1.

This partly explains the ~6x10^18 options, which felt unreasonable anyway.

We could go down the route of changing our original theory to only place the second mine after the first to prevent this sort of problem, which reduces the boards dramatically. Because if mine 1 is placed on (3,4) there are only 43 available spaces\* compared to 80 in theory #1.

\* (43 because there are 51 spaces after (3,4) and there must be atleast 8 spaces left over for the next bombs.)

While this change would allow us to elimate the first issue, the question becomes how do you model the board states which are available.

To solve this I think it is best to solve for the gaps between bombs rather than their position. This sublte change makes the problem more intelligable.

To describe a board in terms of gaps, we can use an array of Integers, which in total equal the number of tiles on the board minus the total number of mines.

This is a valid solution of this format, for a 9x9 grid with 10 bombs:
[0,1,44,2,3,12,1,1,1,1,5]

This is another valid format:
[0,0,0,0,0,0,0,0,0,0,71]

(if a visual is helpful, imagine the minesweeper map is a 1d array of tiles instead of a grid, and the commas in this array represent the bomb locations.)

The question now becomes how can we iterate through all possible values for the array where the total of all items remains 71?

Pasting this into Claude Sonnet 4, gave this response:

## Claude Sonnet 4

This is a fascinating combinatorial problem! You've correctly identified that the naive counting approach overcounts due to ordering, and your gap-based representation is an elegant solution. Let me break down the mathematics and provide some approaches.

### The Combinatorial Foundation

You're absolutely right that the initial calculation of 81×80×...×72 overcounts because it treats different orderings of the same bomb placement as distinct. The correct count is the combination formula:
C(81,10) = 81!/(10!×71!) ≈ 5.36×10^12
This is much more reasonable than your initial 6.8×10^18.

### Gap Representation Analysis

Your gap-based representation is brilliant because it transforms the problem into: "How many ways can we write 71 as a sum of 11 non-negative integers?"
This is a classic "stars and bars" combinatorial problem. The answer is:
C(71+11-1, 11-1) = C(81,10) = 5.36×10^12
Notice this matches our bomb placement calculation - that's not a coincidence! The gap representation and bomb placement are mathematically equivalent.
Iterating Through All Possible Gap Arrays
Here are several approaches to generate all valid gap arrays:

1.  Recursive Generation
    ```python
    def generate_gap_arrays(remaining_sum, num_positions, current_array=[]):
        if num_positions == 1:
            yield current_array + [remaining_sum]
            return
        for gap in range(remaining_sum + 1):
            yield from generate_gap_arrays(
            remaining_sum - gap,
            num_positions - 1,
            current_array + [gap]
            )
    ```
2.  Lexicographic Ordering
    Start with [0,0,0,0,0,0,0,0,0,0,71] and systematically increment:

    If the last element > 0, move one unit from last to second-to-last
    If last element = 0, find the rightmost non-zero element and redistribute

3.  Mathematical Indexing
    You can create a bijection between gap arrays and integers 0 to C(81,10)-1:

    ```python
    def index_to_gap_array(index, total_sum=71, positions=11): # Convert index to gap array using combinatorial number system
    gaps = [0] \* positions
    remaining = total_sum
    for i in range(positions - 1): # Find largest k where C(remaining + positions - i - 1, positions - i - 1) <= index
    k = 0
    while comb(remaining - k + positions - i - 2, positions - i - 2) > index:
    k += 1
    gaps[i] = k
    remaining -= k
    if remaining + positions - i - 2 >= 0:
    index -= comb(remaining + positions - i - 2, positions - i - 2)

        gaps[-1] = remaining
        return gaps
    ```

### Board Identification

For a unique board ID system, you could:

Gap Array as ID: Use the gap array directly as a unique identifier
Lexicographic Index: Assign each gap array an index based on lexicographic ordering
Hash Function: Create a hash of the gap array for more compact IDs

Practical Considerations
With 5.36×10^12 possible boards, you're dealing with:

~45 bits of information per board
~5.6 TB if storing each board ID as 8 bytes
Significant computational challenges for exhaustive analysis

Your gap-based approach is not only mathematically elegant but also computationally efficient for representing and manipulating Minesweeper boards. It transforms a spatial problem into a pure combinatorial one, making many analyses much more tractable.
