class Solution {
    public int[] findMissingAndRepeatedValues(int[][] grid) {
        int count[] = new int [grid.length*grid.length];
        for(int i = 0; i<grid.length ; i++){
            for(int j = 0; j<grid.length ; j++){
                count[grid[i][j]-1] = count[grid[i][j]-1] + 1;
            }
        }
        int A = 0 , B = 0;
        for(int i = 0 ; i < count.length ; i++){
            if(count[i] == 2){
                A = i+1;
            }
            if(count[i] == 0){
                B = i+1;
            }
        }   
       
        return new int[]{A,B};
        
    }
}