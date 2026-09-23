class Solution {
    public List<Integer> theRow(int num){
        List<Integer> row = new ArrayList<>();
        row.add(1);
        int ans=1;
        for(int i=1;i<num;i++){
            ans=ans*(num-i);
            ans=ans/i;
            row.add(ans);
        }
        return row;
    }
    public List<List<Integer>> generate(int numRows) {
        List<List<Integer>> triangle= new ArrayList<>();
        for(int i=1;i<=numRows;i++){
            triangle.add(theRow(i));
        }
        return triangle;
    }
}