class Solution {
    public int maxProfit(int[] prices) {
        int Mprofit=0;
        int min=prices[0];

        for(int item:prices){
            if(item<min){
                min=item;
            }
            if((item-min)>Mprofit){
                Mprofit=item-min;
            }
        }
        return Mprofit;
    }
}