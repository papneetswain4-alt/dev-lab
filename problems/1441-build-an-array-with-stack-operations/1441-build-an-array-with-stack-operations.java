class Solution {
    public List<String> buildArray(int[] target, int n) {
        List<String> s = new ArrayList<>();
        int i , j = 0 ;
        for(i = 1 ; i <= n ; i++ ){
            if(j==target.length) break;
                s.add("Push");
                if(i == target[j] ){
                    j++;
                }else{
                    s.add("Pop");
                }
            
        }
        return s;
    }
}