class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        int count[] = new int[nums.length];
        List<Integer> result = new ArrayList<>();

        for(int num:nums){
            count[num-1]++;
        }
        
        for(int i = 0 ; i<nums.length ; i++){
            if(count[i] == 0){
                result.add(i+1);
            }
        }
        return result;
    }
}