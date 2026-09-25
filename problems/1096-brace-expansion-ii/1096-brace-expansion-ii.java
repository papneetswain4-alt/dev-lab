class Solution {

    int i = 0;

    public List<String> braceExpansionII(String expression) {
        Set<String> result = parse(expression);
        List<String> answer = new ArrayList<>(result);

        Collections.sort(answer);

        return answer;
    }


    public Set<String> parse(String expression) {

        Set<String> result = new HashSet<>();
        Set<String> current = new HashSet<>();
        current.add("");

        while (i < expression.length()) {

            char ch = expression.charAt(i);

            if (Character.isLetter(ch)) {
                Set<String> set = new HashSet<>();
                set.add(String.valueOf(ch));
                current = concatenate(current , set);
                i++; 
            } 
            else if (ch == '{') {
                i++;
                Set<String> set = parse(expression);
                current = concatenate(current, set);
            } 
            else if (ch == ',') {
                result.addAll(current);
                current = new HashSet<>();
                current.add("");
                i++;
            } 
            else if (ch == '}'){
                result.addAll(current);
                i++;
                return result;
            }
        }

        result.addAll(current);

        return result;
    }


    public Set<String> concatenate(Set<String> first , Set<String> second){

        Set<String> result = new HashSet<>();
        for(String a : first){
            for(String b : second){
                result.add(a+b);
            }
        }

        return result;
    }
}