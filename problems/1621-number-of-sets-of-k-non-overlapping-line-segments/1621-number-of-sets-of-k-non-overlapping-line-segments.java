class Solution {
    public int numberOfSets(int n, int k) {
        int MOD = 1_000_000_007;
        long numerator = 1;
        long denominator = 1;

        int total = n + k - 1;
        int choose = 2 * k;

        for (int i = 0; i < choose; i++) {
            numerator = (numerator * (total - i)) % MOD;
            denominator = (denominator * (choose - i)) % MOD;
        }


        long inverse = 1;
        long exponent = MOD-2;

        while (exponent > 0) {
            if (exponent % 2 == 1) {
                inverse = (inverse * denominator) % MOD;
            }

            denominator = (denominator * denominator) % MOD;
            exponent /= 2;
        }


        long result = (numerator * inverse) % MOD;

        return (int) result;
    
    }
}