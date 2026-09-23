class Solution {
    public int minSumOfLengths(int[] arr, int target) {

        int n = arr.length;

        int[] prefix = new int[n];

        int left = 0;
        int currentSum = 0;

        int minLength = Integer.MAX_VALUE;
        int answer = Integer.MAX_VALUE;

        for (int right = 0; right < n; right++) {

            currentSum += arr[right];

            while (currentSum > target) {
                currentSum -= arr[left];
                left++;
            }

            if (currentSum == target) {

                int length = right - left + 1;

                // Check if there is a previous
                // non-overlapping subarray
                if (left > 0 && prefix[left - 1] != Integer.MAX_VALUE) {

                    answer = Math.min(
                        answer,
                        length + prefix[left - 1]
                    );
                }

                // Store the shortest subarray found so far
                minLength = Math.min(minLength, length);
            }

            // Carry forward the best length
            // found up to this index
            if (right == 0) {
                prefix[right] = minLength;
            } else {
                prefix[right] = Math.min(
                    prefix[right - 1],
                    minLength
                );
            }
        }

        if (answer == Integer.MAX_VALUE) {
            return -1;
        }

        return answer;
    }
}