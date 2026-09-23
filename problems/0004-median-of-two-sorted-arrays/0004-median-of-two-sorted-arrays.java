class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        int n = nums1.length;
        int m = nums2.length;
        int[] mergeArray = new int[n+m];
        int i = 0;
        int j = 0;
        for(int k = 0 ; k < (n+m) ; k++){
            if (i == n) {
                mergeArray[k] = nums2[j++];
            } else if (j == m) {
                mergeArray[k] = nums1[i++];
            } else if (nums1[i] <= nums2[j]) {
                mergeArray[k] = nums1[i++];
            } else {
                mergeArray[k] = nums2[j++];
            }             
        }
        int mid = (n+m)/2;
        if((n+m)%2==0){
            return (double)(mergeArray[mid-1]+mergeArray[mid])/2;
        }
        return mergeArray[mid];
    }
}