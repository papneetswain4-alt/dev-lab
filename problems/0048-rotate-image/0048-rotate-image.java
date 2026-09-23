class Solution {
    public int[] revers(int[]arr){
        int last=arr.length-1;
        int first=0;
        while(first<last){
            arr[first]=arr[first]^arr[last];
            arr[last]=arr[first]^arr[last];
            arr[first]=arr[first]^arr[last];
            first++;
            last--;
        }
        return arr;
    }
    public void rotate(int[][] matrix) {
        for(int i=0;i<matrix.length-1;i++){
            for(int j=i+1;j<matrix.length;j++){
                matrix[i][j]=matrix[i][j]^matrix[j][i];
                matrix[j][i]=matrix[i][j]^matrix[j][i];
                matrix[i][j]=matrix[i][j]^matrix[j][i];
            }
        }
        for(int i=0;i<matrix.length;i++){
           matrix[i]=revers(matrix[i]);
        }
    }
}