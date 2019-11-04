; (function (global, factory) {
    factory();
})(window, function () {
    console.log('remove sub folders');
    /**
     *  abc"往"abc"中的任意一个位置插入，只要符合插入情况就可以了
     */

    /**
    * @param {string[]} words
    * @param {string[]} puzzles
    * @return {number[]}
    */
    var isValid = function (S) {
        console.log(S);
        const stack = [];

        for (const s of S) {
            if (s === 'b' && (stack[stack.length - 1] !== 'a' || !stack.length)) {
                return false;
            } else if (s === 'c' && (stack[stack.length - 1] !== 'b' || !stack.length)) {
                return false
            }
            stack.push(s);

            if (s == 'c') {
                stack.splice(stack.indexOf(s) - 2, 3);
            }

        }
        return !stack.length

    };

    console.log(isValid("aabcbc"));


    var isValid2 = function (S) {
        let char_num = {};
        char_num['a'] = char_num['b'] = char_num['c'] = 0;
        for (let i = 0; S[i]; ++i) {
            if ((S[i] == 'a' && S[i + 1] == 'c') ||                  //防止：abacbc
                (S[i] == 'b' && S[i + 1] == 'b')) return false;  //防止：aabbcc

            ++char_num[S[i]];
            if ((char_num['a'] < char_num['b']) ||                 //b的数量不能大于a
                (char_num['b'] < char_num['c']) ||                 //c的数量不能大于b
                (char_num['a'] < char_num['c'])) return false;  //c的数量不能大于a
        }

        return ((char_num['a'] == char_num['b']) && (char_num['b'] == char_num['c'])); //abc数量必须相等
    }

    console.log(isValid2("aabcbc"));



    // 吃掉所有香蕉的最小速度 k
    // 输入: piles = [3,6,7,11], H = 8
    // 输出: 4
    var maximumProduct = function(nums) {
        if (nums ===3) {
            return nums[0] * nums[1] * nums[2]
        }
        var max = Math.max.apply(null, nums), min = Math.min.apply(null, nums);
        nums.splice(nums.indexOf(max),1);
        nums.splice(nums.indexOf(min),1);
        var secondMax = Math.max.apply(null, nums), secondMin = Math.min.apply(null, nums);
        nums.splice(nums.indexOf(secondMax),1);
        var thirdMax = Math.max.apply(null, nums)
        var x1 = min * secondMin * max,
            x2 = thirdMax * secondMax * max;
        return x1 > x2 ? x1 : x2
        
        
    };

    console.log(maximumProduct([722,634,-504,-379,163,-613,-842,-578,750,951,-158,30,-238,-392,-487,-797,-157,-374,999,-5,-521,-879,-858,382,626,803,-347,903,-205,57,-342,186,-736,17,83,726,-960,343,-984,937,-758,-122,577,-595,-544,-559,903,-183,192,825,368,-674,57,-959,884,29,-681,-339,582,969,-95,-455,-275,205,-548,79,258,35,233,203,20,-936,878,-868,-458,-882,867,-664,-892,-687,322,844,-745,447,-909,-586,69,-88,88,445,-553,-666,130,-640,-918,-7,-420,-368,250,-786]));
    

})