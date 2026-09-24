class Solution {
    public int lengthOfLongestSubstring(String s) {
        
        HashMap<Character, Integer> hash = new HashMap<>();

        int left = 0;
        int right = 0;
        int maxSubstring = Integer.MIN_VALUE;
        while(right < s.length()){
            char c = s.charAt(right);
            
            if(hash.containsKey(c)){
                int index = hash.get(c);
                if(left <= index){
                    left = index + 1;
                }
            }
            hash.put(c , right);
            maxSubstring = Math.max(maxSubstring , (right - left + 1));
            right++;
        }
        return maxSubstring == Integer.MIN_VALUE ? 0 : maxSubstring ;
    }
}