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
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode p = l1;
        ListNode q = l2;
        ListNode prev = null;

        int carry = 0;

        while (p != null || q != null) {

            int val1 = (p != null) ? p.val : 0;
            int val2 = (q != null) ? q.val : 0;

            int sum = val1 + val2 + carry;

            int value = sum % 10;
            carry = sum / 10;
            
            if (p != null) {
                p.val = value;
                prev = p;
                p = p.next;
            } else {
                // l1 ended → attach new node
                prev.next = new ListNode(value);
                prev = prev.next;
            }

            if (q != null) q = q.next;
        }

        // leftover carry
        if (carry != 0) {
            prev.next = new ListNode(carry);
        }

        return l1;
    }
}