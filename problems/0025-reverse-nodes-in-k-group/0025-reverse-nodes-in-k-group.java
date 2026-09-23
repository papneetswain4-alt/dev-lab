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
    public ListNode reverse(ListNode head){
        ListNode prv=null , nx , temp = head;
        while(temp != null){
            nx =  temp.next;
            temp.next = prv;
            prv = temp;
            temp = nx;
        }
        return prv;
    }
    public ListNode findKthNode(ListNode head ,int k){
        ListNode temp = head;
        for(int i = 1 ; i<k ; i++){
            temp = temp.next;
            if (temp == null) break;
        }
        return temp;
    }
    

    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode prv=null, kthNode, newHead , nx , temp = head ;
        while(temp != null){
            kthNode = findKthNode(temp , k);
            if(kthNode == null){
                if(prv!=null) prv.next = temp;
                break;
            }
            nx = kthNode.next;
            kthNode.next = null;
            newHead = reverse(temp);
            if(temp==head){
                head = newHead;
            }else{
                if(prv!=null) prv.next = newHead;
            }
            prv = temp;
            temp = nx;
            
        }
    return head;

    }
}