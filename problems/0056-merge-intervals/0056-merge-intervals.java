class Solution {
    public int[][] merge(int[][] intervals) {

        int temp[][] = new int[intervals.length][intervals[0].length];
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);

        temp[0][0] = intervals[0][0];
        temp[0][1] = intervals[0][1];
        int id = 0;

        for(int i = 1; i < intervals.length ; i++){
            if(temp[id][1] >= intervals[i][0]){
                temp[id][1] = Math.max(temp[id][1],intervals[i][1]);
            }else{
                id++;
                temp[id][0] = intervals[i][0];
                temp[id][1] = intervals[i][1];
            }
        }
        int mergeArr[][] = new int[id+1][intervals[0].length];
        for(int i = 0; i <= id ; i++){
            mergeArr[i][0] = temp[i][0];
            mergeArr[i][1] = temp[i][1];
        }


        
        return mergeArr;
        
    }
}