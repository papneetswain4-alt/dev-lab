class Solution {
    public String reverseParentheses(String s) {

        Stack<StringBuilder> stack = new Stack<>();
        StringBuilder current = new StringBuilder();

        for (char ch : s.toCharArray()) {

            if (ch == '(') {
                // Save the string before this bracket
                stack.push(current);
                current = new StringBuilder();

            } else if (ch == ')') {
                // Reverse the content inside parentheses
                current.reverse();

                // Restore the previous string and append
                StringBuilder previous = stack.pop();
                previous.append(current);

                current = previous;

            } else {
                current.append(ch);
            }
        }

        return current.toString();
    }
}