class Solution {
    public int reverseDegree(String s) {
        int sum = 0;
        for (int i = 0; i < s.length(); i++) {
            int reversedIndex = 'z' - s.charAt(i) + 1;
            sum += (i + 1) * reversedIndex ;
        }
        return sum;
    }
}
