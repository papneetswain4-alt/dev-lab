class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        int numOfSubset = 1 << nums.length;
        List<List<Integer>> result = new ArrayList<>();
        
        for(int num = 0 ; num < numOfSubset ; num++){
            List<Integer> set = new ArrayList<>();
            for(int i = 0 ; i < nums.length ; i++){
                if((num & (1 << i)) != 0){
                    set.add(nums[i]);
                }
            }
            result.add(set);
        }
        return result;
    }
}