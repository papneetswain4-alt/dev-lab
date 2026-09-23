class Solution {
    public int[] findErrorNums(int[] nums) {
      int count[] = new int[nums.length];
      int repetition = 0;
      int lost = 0;
      for(int i = 0 ; i<nums.length ; i++){
        count[nums[i]-1]++;
      }
      for(int i = 0 ; i<nums.length ; i++){
        if(count[i] == 0){
            lost = i+1; 
        }
        if(count[i] == 2){
            repetition = i+1; 
        }
      }
      return new int[]{repetition,lost};

    }
}