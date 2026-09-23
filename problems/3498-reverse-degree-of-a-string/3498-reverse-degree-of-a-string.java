class Solution {
    public int reverseDegree(String s) {
        String reversedAlphabet = "zyxwvutsrqponmlkjihgfedcba";
        int sum = 0;
        for(int i = 0 ; i < s.length() ; i++){
            char c = s.charAt(i);
            int reversedIndex = reversedAlphabet.indexOf(c);
            int product = (i+1)*(reversedIndex + 1);
            sum += product;
        }
        return sum;
    }
}