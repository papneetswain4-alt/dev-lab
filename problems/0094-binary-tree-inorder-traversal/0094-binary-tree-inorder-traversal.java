/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        TreeNode temp = root ;
        List<Integer> result = new ArrayList<>();
        traverse(temp , result);
        return result;
        
    }
    public void traverse(TreeNode node , List<Integer> order) {
        if (node == null) return;
        
        traverse(node.left ,order);       
        order.add(node.val); 
        traverse(node.right, order);  
    }    
}


