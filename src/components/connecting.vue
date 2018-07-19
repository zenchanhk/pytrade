
<style lang="less">
@import './connecting.less';
    .container{
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        display: block;
        background: rgba(211, 211, 211, 0.719);
    }
    .text-div {
        display: flex;
        flex-direction: row;
    }
    .connecting-text {        
        font-family: 'Lato', sans-serif;
        font-weight: 300;
        font-size: 35px;
        opacity: 1;
        -webkit-animation: fade-in-out 2.5s infinite; 
        -moz-animation: fade-in-out 2.5s infinite; 
        -o-animation: fade-in-out 2.5s infinite; 
        animation: fade-in-out 2.5s infinite; 
    }
    .recon-text {
        font-size: 35px;        
    }
</style>

<template>    
    <div class="container">
        <div class='text-div'>
            <span v-show="action==0" class="connecting-text" >{{desc}}</span>
            <div v-show="action==1" class="recon-text" >
                <span>{{desc}}</span>
                <span :style="{'font-size': '45px', 'color': 'red'}" >{{ ' ' + remaining + ' '}}</span>
                <span>seconds</span>
            </div>            
        </div>
        <div v-show="action==0" class="load-wrapp">
            <div class="load-2">                
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </div>
        </div >

        <div v-show="action==1" id="glass-container">
            <div id="glass">
                <div class="top half-glass triangle"></div>
                <div class="bottom half-glass triangle rotate"></div>
            </div>
            <div id="layer-1">
                <div>
                    <div class="top layer-1 triangle"></div>
                </div>
                <div class="rotate">
                    <div class="bottom layer-1 triangle"></div>
                </div>
            </div>
            <div id="layer-2">
                <div>
                    <div class="top layer-2 triangle"></div>
                </div>
                <div class="rotate">
                    <div class="bottom layer-2 triangle"></div>
                </div>
            </div>
            <div id="sand-stream"></div>
            <div id="bond">
                <div class="top bond triangle"></div>
                <div class="bottom bond triangle"></div>
            </div>
        </div>
    </div>
</template>

<script>   
    import { mapGetters } from 'vuex';

    export default {
        name: 'vue-connecting',
        props: {
        },
        data () {                        
            return {              
                remaining: 0,
                /*
                action: -1,
                desc: '',
                timer: null,*/
            };
        },
        computed: {
            ...mapGetters('status', [
                'action',
                'desc',
                'timer',
            ]),
        },
        watch: {
            timer: function(val) {
                if (val) {
                    this.startTimer(val - 1);
                }
            }, /*
            action: function(val) {
                this.action = val.action;
                this.desc = val.desc;
                if (val.timer) {
                    this.startTimer(val.timer - 1);
                }
            }*/
        },
        methods: {
            startTimer(duration) {
                var timer = duration;
                var self = this;
                var x = setInterval(() => {
                    self.remaining = timer;
                    if (--timer < 0) {
                        clearInterval(x);
                    }
                }, 1000);
            }
        }

    };
</script>