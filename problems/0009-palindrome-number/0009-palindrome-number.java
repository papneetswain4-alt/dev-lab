class Solution {
    public boolean isPalindrome(int x) {
        if(x < 0){
            return false;
        }
        int num = x;
        int reversed = 0;
        while(num != 0){
            int lastDigit = num % 10;          
            reversed = reversed * 10 + lastDigit;
            num = num / 10;  
        }
        return reversed == x;
    }
}