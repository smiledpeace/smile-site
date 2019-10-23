;
(function (global, factory) {
    factory();
})(window, function () {
    console.log('I am a teacher');
    /**
     * @param {string} command
     * @param {number[][]} obstacles
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */

    var isPassed = function (command, x, y, dx, dy) {
        console.log(dx, dy);
        
        var round = Math.floor(Math.min(x / dx, y / dy));


        let cnt = command.length * round;  // 前几轮的总次数
        dx *= round; dy *= round; // 在第x-1或y-1层时的位置
        
        // console.log(cnt , dx, dy);

        if (dx == x && dy == y) return cnt; // 正好就是要找的点，直接返回。
        for (let i = 0, len = command.length; i < len; i++) { // 遍历第x层或y层，如果经过，那么答案一定会遍历到。
            let c = command[i];
            if (c == 'U') dy++; // 要按command的顺序走
            else dx++;
            cnt++; 

            console.log(dx, dy);
            
            if (dx == x && dy == y) return cnt; 
        }
        return -1
        
    }
    var robot = function (command, obstacles, x, y) {
        var dx = 0, dy = 0;
        // 算出up和right各有多少个。
        for(let i = 0, len = command.length; i < len ; i++) {
            let char = command[i];
            if  (char === "U") {
                dy++;
            }else {
                dx++;
            }
        }
        var ans = isPassed(command, x, y, dx, dy);
        console.log(ans);
        
        if (ans == -1) return false; // 终点都没经过，肯定false
        for(let o = 0, len = obstacles.length;  o < len; o++) {
            let ob = obstacles[o];
            var cnt = isPassed(command, ob[0], ob[1], dx, dy);
            
            if (cnt != -1 && cnt < ans) return false; // //不等于-1，说明经过了，然后再看这个点和终点哪个次数多。ans多，说明这个点在ans前面，返回false。
        }
        return true;

    }



    console.log(robot('URR', [], 3, 2));
    ;
})