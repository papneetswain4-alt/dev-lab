
import java.util.Arrays;

class Solution {
    public long minSumSquareDiff(int[] nums1, int[] nums2,
                                 int k1, int k2) {
        int n = nums1.length;
        int[] diff = new int[n];
        long k = (long) k1 + k2;
        int max = 0;
        long sum = 0;

        for (int i = 0; i < n; i++) {
            diff[i] = Math.abs(nums1[i] - nums2[i]);
            max = Math.max(max, diff[i]);
            sum += diff[i];
        }

        if (k >= sum) return 0;

        int lo = 0, hi = max;

        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            long needed = 0;

            for (int d : diff) {
                if (d > mid) needed += d - mid;
            }

            if (needed <= k) hi = mid;
            else lo = mid + 1;
        }

        int level = lo;
        long used = 0;
        long ans = 0;
        int count = 0;

        for (int d : diff) {
            if (d > level) {
                used += d - level;
                ans += (long) level * level;
                count++;
            } else {
                ans += (long) d * d;
                if (d == level) count++;
            }
        }

        long remaining = k - used;

        for (int i = 0; i < n && remaining > 0; i++) {
            if (diff[i] >= level && level > 0) {
                ans -= (long) level * level;
                ans += (long) (level - 1) * (level - 1);
                remaining--;
            }
        }

        return ans;
    }
}
