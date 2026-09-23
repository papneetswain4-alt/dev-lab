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
    public ListNode sortLists(ListNode head){
        ListNode temp = head;
        int i = 0;
        int count = 0;
        while(temp != null){
            temp = temp.next ;
            count++;
        }
        int arr[] = new int[count];
        temp = head;
        while(temp != null){
            arr[i] = temp.val;
            i++;
            temp = temp.next;
        }
        Arrays.sort(arr);
        i=0;
        temp = head;
        while(temp != null){
            temp.val = arr[i];
            i++;
            temp = temp.next;
        }
        return head;  
    }

    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        if (list1 == null) {
            return list2;
        }

        ListNode p = list1;

        while (p.next != null) {
            p = p.next;
        }

        p.next = list2;

        list1 = sortLists(list1);
        return list1;

        
    }
}