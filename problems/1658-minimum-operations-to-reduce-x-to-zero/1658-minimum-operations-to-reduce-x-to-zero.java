class Solution {
    public int minOperations(int[] nums, int x) {
        int totalSumOfArray = Arrays.stream(nums).sum();
        if(totalSumOfArray < x){
            return -1;
        }
        if(totalSumOfArray == x){
            return nums.length;
        }
        int currentSum = 0;
        int target = totalSumOfArray - x;
        int minOp = Integer.MAX_VALUE;
        int left = 0;
        
        for(int right = 0 ; right < nums.length ; right++){
            currentSum += nums[right];
            while( currentSum >= target){
                if(currentSum == target){
                    minOp = Math.min(minOp , (nums.length - (right-left+1)) );
                }
                currentSum -= nums[left];
                left++;
            } 
        }

        if(minOp == Integer.MAX_VALUE){
            return -1;
        }
        return minOp;
    }
}