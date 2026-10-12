class Solution {
    public List<Integer> majorityElement(int[] nums) {
        List<Integer> num = new ArrayList<>();

        for (int i = 0; i < nums.length; i++) {
            int count = 0;

            if (num.contains(nums[i])) {
                continue;
            }

            for (int j = 0; j < nums.length; j++) {
                if (nums[i] == nums[j]) {
                    count++;
                }
            }

            if (count > nums.length / 3) {
                num.add(nums[i]);
            }
        }

        return num;
    }
}
