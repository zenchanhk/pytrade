
<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;        
        border-radius: 4px;        
        display: flex;
        flex-direction: column;
        min-height: 100vh;

    }
    .footer {
       flex: 0 0 auto;
    }
    .content {
        flex: 1 1 auto;
        background: lightcyan;
        position: relative;
        /*height: 100%; very important for the div inside it being scrollable */
        
    }
    .child {
        position: absolute;
        width: 100%;
        height: 100%;
        min-height: 0px;
        overflow-y: auto;
    }
    .header {
        height: 30px;
        flex: 0 0 auto;
    }  
    .item {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .text {
        padding-left: 10px;
        font-size: 15px;
    }
    .divs {
        background-color: lightgray
    }
    .no-drag {
        width: 100%;
        margin: 5px;
    }
    .vue-draggable-handle {
        
        width: 100%;
        height: 25px;
        background-color: #f5f7f9;
        padding: 3px;
        cursor: pointer;
    }
</style>

<template>    
    <div class="layout">
        
            <Header class="header">
                
            </Header>
            <div class="content">
                <div class="child">
                    <Layout
                        :edit="state.edit"
                        :resize="state.resize"
                        :splits="state.splits">
                        <Pane title="Main Panel" >
                            <div style="display: relative; height: 100%">
                                <resize-sensor @resized="onResize" :debounce="50"></resize-sensor>
                            <Order />
                            </div></Pane>
                        <Pane title="Real Time Data" v-resize:debounce="onResize">
                            <div style="display: relative; height: 100%">
                                <resize-sensor @resized="onResize" :debounce="50"></resize-sensor>
                            <RTData />
                            </div>
                        </Pane>
                        <Pane title="Miscellaneous">
                            
                        </Pane>
                    </Layout>
                </div>
            </div>            
            
        
    </div>
</template>
<style lang="less">
@import './index.less';
</style>
<script>
    import Order from '@/components/order.vue';
    import RTData from '@/components/RTData.vue';
    import VueGridLayout from 'vue-grid-layout';
    import { Layout, Pane } from 'vue-split-layout';
    import resize from 'vue-resize-directive';

    var GridLayout = VueGridLayout.GridLayout;
    var GridItem = VueGridLayout.GridItem;

    const layouts = [
        {
            dir: 'vertical',
            first:0,
            second: {
                dir: 'horizontal',
                first: 1,
                second: 2
            }
        }
    ];


    var testLayout = [
        {'x':0,'y':0,'w':12,'h':7,'i':'2'},
        {'x':0,'y':4,'w':6,'h':7,'i':'0'},
        {'x':6,'y':4,'w':6,'h':7,'i':'1'}
    ];
    
    export default {
        name: 'Home',
        directives: {
            resize,
        },
        /*eslint-disable */
        components: {
            Order,
            RTData,
            Layout, Pane,
            'GridLayout': GridLayout,
		    'GridItem': GridItem
        },
        data () {
                        
            return {
                layout: testLayout,
                draggable: true,
                resizable: true,
                
                state: {
                    extraStyle: false,
                    edit: true,
                    resize: true,
                    splits: layouts[0],
                    layoutN: 0
                },
            };
        },
        methods: {
            onResize() {
                console.log(this.$el.clientWidth);
            },
            //used to adjust scroll y in RTData table
            resizedEvent(i, newH, newW, newHPx, newWPx){
                //console.log("RESIZE i=" + i + ", H=" + newH + ", W=" + newW + ", H(px)=" + newHPx + ", W(px)=" + newWPx);
                console.log(testLayout);
            },
            /*eslint-disable */
            js_print(lang, event, msg) {
                msg = "<b class="+lang+">"+lang+": "+event+":</b> " + msg;
                //var cons = document.getElementById("console");
                //cons.innerHTML += "<div class=msg>"+msg+"</div>";
                this.$Message.info(msg);
            },
            js_callback_1(ret) {
                this.js_print("Javascript", "html_to_data_uri", ret);
            },
            js_callback_2(msg, py_callback) {
                this.js_print("Javascript", "js_callback", msg);
                py_callback("String sent from Javascript");
            },
            order() {
                //console.log(this);
                // eslint-disable-next-line
                html_to_data_uri("test", this.js_callback_1); 
            },
            st() {
                external.test_multiple_callbacks(js_callback_2);
            },
            laodingOptions() {
                console.log('loading...');
                
            },
            onSelect(value) {
                //console.log(selectedOption);
                console.log(this.$vm);
                console.log(value);
                //this.$refs.multiselect.activate();
            },
            change (status) {
                console.log(this.model13 + ', value:' + this.$refs.is1.value);
                //this.$refs.is1.setQuery(null);
                //this.$refs.is1.value='cal';
                this.$nextTick(() => {this.$refs.is1.setQuery('%$cal');console.log(this.value);});
                //this.$refs.is2.focus();
                this.$Message.info('开关状态：' + status);
            },
            onEsc() {
                console.log('on escape');
            },
            remoteMethod1 (query) {
                //console.log("rm1");
                //this.$nextTick(() => console.log(this))
                if (query !== '') {
                    this.loading1 = true;
                    this.list.push('randon');
                    setTimeout(() => {
                        this.loading1 = false;
                        
                        this.options1 = this.cityList.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
                    }, 500);
                } else {
                    this.options1 = [];
                }
            },
            remoteMethod2 (query) {
                if (query !== '') {
                    this.loading2 = true;
                    setTimeout(() => {
                        this.loading2 = false;
                        const list = this.list.map(item => {
                            return {
                                value: item,
                                label: item
                            };
                        });
                        this.options2 = list.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
                    }, 200);
                } else {
                    this.options2 = [];
                }
            }
        }

    };
</script>