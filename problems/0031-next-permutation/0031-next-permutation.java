class Solution {
    public void nextPermutation(int[] nums) {
        int n = nums.length;
        int index = -1;
        for(int i=n-2;i>=0;i--){
            if(nums[i]<nums[i+1]){
                index = i;
                break;
            
            }
        }
        int temp=0;
        int l;
        int r;
        if(index == -1){
            l=0;
            r=n-1;
            while(r>l){
                temp=nums[l];
                nums[l]=nums[r];
                nums[r]=temp;
                l++;
                r--;
            }
            return;
        }
        for(int i=n-1;i>=0;i--){
            if(nums[i]>nums[index]){
                temp=nums[i];
                nums[i]=nums[index];
                nums[index]=temp;
                break;
            }
        }
        l=index+1;
        r=n-1;
        while(r>l){
            temp=nums[l];
            nums[l]=nums[r];
            nums[r]=temp;
            l++;
            r--;
        }
    }
}