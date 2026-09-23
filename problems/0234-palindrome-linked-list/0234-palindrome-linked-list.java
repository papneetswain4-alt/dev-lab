/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode middleNode(ListNode head){
        ListNode temp = head;
        int count = 0;
        while(temp != null){
            temp = temp.next ;
            count++;
        }
        temp = head;
        
        for(int i = 0; i< (count/2) ; i++ ){
            temp = temp.next;
        }
        return temp;
    }
    public ListNode reverse(ListNode head) {
        ListNode prv = null, nx, temp = head;
        while (temp != null) {
            nx = temp.next;
            temp.next = prv;
            prv = temp;
            temp = nx;
        }
        return prv;
    }
    public boolean isPalindrome(ListNode head) {
        ListNode reversehead, midnode , temp = head;
        midnode = middleNode(temp);
        reversehead = reverse(midnode);
        ListNode temp2 = reversehead;
        while(temp != midnode ){
            if (temp2.val != temp.val){
                return false;
            }
            temp = temp.next;
            temp2 =temp2.next;
        }
        return true;
        
    }
}