class Solution {
    public int digitSum(int num){
        int sum = 0 ;
        while(num!=0){
            sum += num%10;
            num = num/10;
        }
        return sum;
    }
    public int smallestIndex(int[] nums) {
        int minSum = Integer.MAX_VALUE;
        for(int i = 0 ; i < nums.length ; i++){
            int sum = digitSum(nums[i]);
            if(sum == i){
                minSum = Math.min(minSum , sum);
            }
        }
       
        return minSum == Integer.MAX_VALUE ? -1 : minSum;
    }
}