class Solution {
    public int[] shuffle(int[] nums, int n) {
        int arr[] = new int[2 * n];
        int r = 0;
        int m = n;
        int i = 0;
        while (i < 2*n) {
            if(i%2 != 0){
                arr[i] = nums[m]; 
                m++;
            }else{
                arr[i] = nums[r];
                r++;
            }
            i++;
            
        }
        return arr ;
    }
}