<template>
    <div>
        {{ `x: ${x}, y: ${y}`}}
        <div ref="move" class="event-move" ></div>
    </div>
</template>
<script>
export default {
    mounted() {
        this.$nextTick(() => {
            this.init();
        });
    },
    data() {
        return {
            x: 0,
            y: 0
        }
    },
    methods: {
        init() {
            const _this = this;
            const move = this.$refs.move;
            const {width, height} = document.body.getBoundingClientRect();
            console.log(width, height);
            
            move.onmousedown = function(e) {
                const clickX = e.offsetX;
                const clickY = e.offsetY;
                console.log(clickX, clickY);
                
                document.onmousemove = function(e) {
                    _this.x = e.clientX;
                    _this.y = e.clientY;
                    const moveX = e.clientX - clickX, moveY = e.clientY - clickY
                    if (moveX > 0 && moveX < width && moveY > 0 && moveY < height ) {
                        move.style.webkitTransform = `translate(${moveX}px, ${moveY}px)`
                    }
                }
            }
            

            document.onmouseup = function(e) {
                console.log(e);
                
                document.onmousemove = null;
            }

        }
    }
}
</script>

<style lang="less">
    .event-move {
        width: 200px;
        height: 120px;
        background-color: #f90;
    }
</style>