
# This first part seems to work but only for numbers that 
# are 2^n so we would need to trash 
# some generated values or something to get it to work

# def feistel_round(x, key, rounds=4, bits=16):
#     """Feistel round function for permutation"""
#     mask = (1 << (bits // 2)) - 1
#     L = (x >> (bits // 2)) & mask
#     R = x & mask
#     for i in range(rounds):
#         F = (R * key + i * 0x9e3779b9) & mask
#         L, R = R, L ^ F
#     return (L << (bits // 2)) | R

# def feistel_permutation(k, n, key=0xABCDEF):
#     """Feistel-based permutation function that maps k to a unique value in range(n)"""
#     if k >= n:
#         raise ValueError("k must be less than n")
#     bits = (n - 1).bit_length()
#     size = 1 << bits
#     while True:
#         perm = feistel_round(k, key, bits=bits)
#         if perm < n:
#             return perm
#         k += 1  # Skip values outside the range

# # Example usage
# n = 100
# for k in range(100):
#     print(f"perm({k}) = {feistel_permutation(k, n)}")


import hashlib
# This seems to work the only thing is generating a coprime but it seems to be very fast even with large ranges (also I pretty sure if just get a prime larger than any range it we could just plug in as a coprime and it would work like a seed)
def bijective_permutation(k, n, seed="default_seed"):
    """
    Bijective permutation function that maps integers from 1 to n to unique integers in the same range.
    Uses a fixed seed and modular arithmetic to ensure repeat-free, deterministic mapping.
    """
    if not (1 <= k <= n):
        raise ValueError("k must be in the range 1 to n")

    # Generate a multiplier that is coprime with n using the seed
    def coprime_multiplier(n, seed):
        # Hash the seed to get a deterministic number
        h = hashlib.sha256(seed.encode()).hexdigest()
        num = int(h, 16)
        # Try successive values until we find one that is coprime with n
        for i in range(n):
            candidate = (num + i) % n
            if candidate > 1 and gcd(candidate, n) == 1:
                return candidate
        raise ValueError("Failed to find coprime multiplier")

    # Greatest common divisor
    def gcd(a, b):
        while b:
            a, b = b, a % b
        return a

    multiplier = coprime_multiplier(n, seed)
    return (k * multiplier) % n + 1  # Map to 1..n

# Demonstrate the function for n = 100
n = 20
seed = "example_seed"
results = [bijective_permutation(k, n, seed) for k in range(1, 21)]

# Print the first 20 mappings
for k, v in zip(range(1, 21), results):
    print(f"{k} → {v}")

