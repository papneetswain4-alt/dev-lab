class Solution {
    public List<Boolean> prefixesDivBy5(int[] nums) {
        ArrayList<Boolean> answer = new ArrayList<>();
        int current = 0;

        for (int bit : nums) {
            current = (current * 2 + bit) % 5;
            answer.add(current == 0);
        }
        
        return answer;
    }
}