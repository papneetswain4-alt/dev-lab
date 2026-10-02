
class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> result = new ArrayList<>();
        backTracking(n, 0, 0, result, "");
        return result;
    }

    public void backTracking(int n, int open, int close, List<String> result, String s) {
        if (open == n && close == n) {
            result.add(s);
            return;
        }

        if (open < n) {
            backTracking(n, open + 1, close, result, s + "(");
        }

        if (close < open) {
            backTracking(n, open, close + 1, result, s + ")");
        }
    }
}