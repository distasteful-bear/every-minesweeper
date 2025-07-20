
# This is a simple workspace file to try out the theory behind the board generator. 
# Once the final form is decided, this generator will be built in Go for use in our API
    
"""THIS IS BROKEN AND SHIT
# need to generate a number using the str seed. 
# the string seed is treated as a base 36 value, and is converted to an int
def generateNumberFromSeed(seed: str):
    
    if not seed.isalnum():
        raise ValueError("Seed is not alphanumeric")
    if len(seed) != 3:
        raise ValueError("Seed was not 3 characters long.")
    
    seed = seed.lower()
    
    num = 0

    char_count = 0
    for char in seed:
        val = 0
        if str(char).isalpha():
            val = (36 ^ char_count) + (ord(char)-70) # unicode for a is 97 (char are after numbers)
        
        if str(char).isdigit():
            val = (36 ^ char_count) + (ord(char)-48) # unicode for 0 is 48
        num += val
        
        print(f"Val for char {char} is: {val}")
        
        char_count += 1
    
    return num

seed = "100"

        
print("Number from Seed:", generateNumberFromSeed(seed))
"""

import math


def convertToBaseN(base_n:int, value: int):
    final_value = []
    
    val = value
    while val != 0:
        r = val % base_n
        final_value.append(r)
        
        val = val // base_n # this is floor division so it rounds down
        
    return final_value
        

null_seed = 0
seed = 144 # 1 is first possible seed


def generateBoardFromSeedNum(seed_num: int):
    print(f"Seed: {seed_num}")
    mine_count = 4
    mines = []
    for i in range(0, mine_count):
        mines.append(0)
    
    total_tiles = 16
    row_length = int(math.sqrt(total_tiles))
    base_of_mines_struct = total_tiles - mine_count
    
    vals_in_base_val = convertToBaseN(base_of_mines_struct, seed_num)
    
    print(f"Vales from base Value Calc: {vals_in_base_val}")
    
    for val in vals_in_base_val:
        mines[i] = val
        
    print("mines: ", mines)
        
    final_bit_map = []
    
    for i in range(total_tiles):
        final_bit_map.append('.')
        
        
    for mine_pos in mines:
        
        pos_counter = 0
        virtual_pos_counter = 0
        
        for cell in final_bit_map:
            if cell == '.':    
                if virtual_pos_counter == mine_pos:
                    final_bit_map[pos_counter] = '0'
                virtual_pos_counter += 1
            pos_counter += 1
        
            
        
    print("Mine Sweeper Board:")
    for i in range(row_length):
        print(final_bit_map[(i*4):(i*4)+4])
    
    
generateBoardFromSeedNum(seed_num=seed)