class Solution {
    public int maxDepth(String s) {
        int max_Depth = 0;
        int current_Depth = 0;
        for(int i = 0 ; i < s.length() ; i++){
            char c = s.charAt(i);
            if( c == '(' ){
                current_Depth += 1;
                max_Depth = Math.max(max_Depth, current_Depth);
            }else if(c == ')'){
                current_Depth -= 1;
            }
        }
        return max_Depth;
       
    }
}