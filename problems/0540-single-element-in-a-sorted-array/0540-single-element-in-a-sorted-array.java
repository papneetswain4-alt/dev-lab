class Solution {
    public int singleNonDuplicate(int[] nums) {
        int low  = 0 ;
        int high = nums.length - 1;
        while(low < high){
            int mid = low + (high - low) / 2;
            if(nums[low] ==  nums[low + 1]){
                low = low + 2;
            }else{
                return nums[low];
            }

            
            if(nums[high] ==  nums[high - 1]){
                high = high - 2;
            }else{
                return nums[high];
            }
            
        }
        return nums[low];

    }
}