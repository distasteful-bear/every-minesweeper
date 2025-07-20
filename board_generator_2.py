import csv


mines = 4
row_len = 4

# trying out all possible seeds for this board config.
csv_sheet = [["Seed", "Gap Values", "Valid"]]
for i in range(248833):
    
    if i % 1000 == 0:
        print(f"Completed {i} operations.")
    seed = i
    csv_row = [seed]
    
    
    # this is the gaps between the mines.
    gap_array = []
    
    for mine in range(mines):
        gap_array.append(0)
    gap_array.append(0) # (There should be one more gap than mines to allow the gaps to be one either end of the mines)
  
    max_value = row_len * row_len - mines # The max value is the highest possible value when all other gaps are zero   
        
    while seed >= max_value:
        seed -= max_value
        gap_array[-2] += 1 
    
    gap_array[-1] += seed
    seed = 0
    
    # need a better way to iterate though valid optoins the search space is tiny in comparison.
    for i in range(-mines,0):
        while gap_array[i] > max_value:
            gap_array[i-1] += 1
            gap_array[i] -= max_value
            
    str_gap_array = []
    
    for val in gap_array:
        str_gap_array.append(str(val))
            
    csv_row.append(", ".join(str_gap_array))
    
    total = 0
    for val in gap_array:
        total += val
    
    if total <= max_value:    
        csv_row.append(
            "true"
        )
    else:
        csv_row.append("false")
    csv_sheet.append(csv_row)


with open("Testing Seeds.csv", "w") as file:
    
    writer = csv.writer(file)
    
    writer.writerows(csv_sheet)

"""

def generateAdjFromSeed(mines, row_len, seed):
    
    # need to return an array when total value of row_len^2
    # use seed to salt randomizer

    total_tiles = row_len * row_len
    max_adj = total_tiles - mines
    
    
    
    #y = seed_num 
    
    #x = mine_count len array which equals max_adj when added
    
    adjustments = []
    for i in range(mines):
        adjustments.append(0)
        
    value = seed
    r = value % max_adj
    value = value // max_adj
    adjustments[-1] = value
    
    #if value != 0:
    #seed / 


def getSalt(mines):
    return []
    

def generateMap(mines, row_len, seed):
    total_tiles = row_len * row_len

    mine_positions = []
    for mine in range(mines):
        mine_positions.append(mine)
        
    adj_from_seed = generateAdjFromSeed(mines, row_len, seed)
    
    determinitic_salt = getSalt(mines)
    
    # need to adjust the mine positions with the salt and seed
    
    final_bit_map = []
    for i in range(total_tiles):
        final_bit_map.append("_")
        
    for mine in mine_positions:
        final_bit_map[mine] = "0"
        
    return final_bit_map

def printMap(bit_map, row_len):    

    print("MineSweeper Map")    
    for row in range(row_len):
        print("  " + ",".join(bit_map[(row*row_len):(row*row_len + row_len)]) + "  ")

row_len = 4
mines = 3
seed = 1

bit_map = generateMap(mines, row_len, seed)

printMap(bit_map, row_len)

"""