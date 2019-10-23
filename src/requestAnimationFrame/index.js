import { createNamespace } from '../utils/create'
import { isSameSecond, parseTimeData, parseFormat, formatDate } from './utils';
import { raf, cancelRaf } from '../utils/dom/raf';
const [createComponent, bem] = createNamespace('frame')


import './index.less';
export default createComponent({
    props: {
        millisecond: Boolean,
        time: {
            type: Number,
            default: 0
        },
        format: {
            type: String,
            default: 'HH:mm:ss'
        },
        autoStart: {
            type: Boolean,
            default: true
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.init();
            this.animate();
            this.animateSlide();
        })
    },
    data() {
        return {
            remain: 0,
            offset: 0,
            offsetY: 0,
            percent: 0,
            remainOffset: Date.now()
        }
    },
    watch: {
        time: {
            immediate: true,
            handler: 'reset'
        }
    },
    methods: {
        init() {
            const _this = this;
            function step() {
                const remainOffset = Date.now();
                if (!isSameSecond(remainOffset, _this.remainOffset)) {
                    _this.setOffset(remainOffset);
                }
                _this.raf_id = requestAnimationFrame(step);
            }
            step();
        },
        animate() {
            const dom = this.$refs.frame;
            const { width } = dom.parentElement.getBoundingClientRect();
            const { offsetWidth } = dom;
            const _this = this;
            const distance = width - offsetWidth
            function step() {
                if (_this.offset <= distance / 2) {
                    _this.offset++;
                    requestAnimationFrame(step);
                }else if (_this.offsetY <= distance / 2) {
                    _this.offsetY++;
                    requestAnimationFrame(step);
                }

            }
            requestAnimationFrame(step);
            // step();
            
        },
        animateSlide() {
            const dom = this.$refs.slide, thumb = this.$refs.slide.thumb;
            const _this = this;
            function step() {
                _this.percent += 100  / 2 / 230;
                if (_this.percent >= 0 && _this.percent <= 100) {
                    _this.percent = Math.min(Math.max(0, _this.percent), 100);
                    dom.style.setProperty('--percent', _this.percent);
                    requestAnimationFrame(step);
                }
            }
            requestAnimationFrame(step);
        },
        setOffset(remain) {
            this.remainOffset = remain;
            if (remain === 0) {
                this.pauseOffset();
            }
        },
        pauseOffset() {
            cancelAnimationFrame(this.raf_id)
        },
        start() {
            if (this.counting) {
                return;
            }
            this.counting = true;
            this.endTime = Date.now() + this.remain;
            this.tick();
        },
        pause() {
            this.counting = false;
            cancelRaf(this.rafId);
        },
        reset() {
            this.pause();
            this.remain = this.time;

            if (this.autoStart) {
                this.start();
            }
        },
        tick() {
            if (this.millisecond) {
                this.microTick();
            } else {
                this.macroTick();
            }
        },
        microTick() {
            this.rafId = raf(() => {
                this.setRemain(this.getRemain());

                if (this.remain !== 0) {
                    this.microTick();
                }
            });
        },

        macroTick() {
            this.rafId = raf(() => {
                const remain = this.getRemain();
                
                if (!isSameSecond(remain, this.remain) || remain === 0) {
                    this.setRemain(remain);
                }

                if (this.remain !== 0) {
                    this.macroTick();
                }
            });
        },

        getRemain() {
            return Math.max(this.endTime - Date.now(), 0);
        },

        setRemain(remain) {
            this.remain = remain;

            if (remain === 0) {
                this.pause();
                this.$emit('finish');
            }
        }

    },
    computed: {
        trackStyle() {
            return {
                transform: `translateX(${this.offset}px) translateY(${this.offsetY}px) `,
                backgroundImage: `liner-gradient(#f45, #456)`
            }
        },
        timeData() {
            return parseTimeData(this.remain);
        },

        formattedTime() {
            return parseFormat(this.format, this.timeData);
        },
    },
    render() {
        return (
            <div class={bem()} >
                <div class={bem('item')}>{formatDate(new Date(this.remainOffset))}</div>

                <div>
                    {this.slots('default', this.timeData) || this.formattedTime}
                </div>

                <div ref="frame" style={this.trackStyle} class={bem('animate')}>{this.offset}</div>

                <div class={bem('slide')} ref="slide">
                    <div class={bem('button')}></div>
                    <button class={bem('thumb')} ref="thumb"></button>
                </div>
            </div>
        )
    }
})