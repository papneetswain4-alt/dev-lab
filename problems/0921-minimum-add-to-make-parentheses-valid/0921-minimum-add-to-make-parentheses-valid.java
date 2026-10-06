class Solution {
    public int minAddToMakeValid(String s) {
        int openCount = 0; 
        int addCount = 0;   
        
        for (char c : s.toCharArray()) {
            if (c == '(') {
                openCount++;
            } else {
                if (openCount > 0) {
                    openCount--;
                } else {
                    addCount++;
                }
            }
        }
        
        return addCount + openCount;
    }
}
