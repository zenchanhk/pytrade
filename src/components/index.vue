
<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #fcfeff;        
        border-radius: 4px;        
        width: 100%;
        height: 100%; 
        
        min-height: 100vh;
        position: absolute;

        -moz-user-select: none; 
        -webkit-user-select: none; 
        -ms-user-select:none; 
        user-select:none;
        -o-user-select:none;
        cursor: pointer;
    }
    .content {   
        --bg: rgb(22, 170, 89);     
        width: 100%;
        height: 100%;
        
        position: fixed;
        background: var(--bg);
        /*height: 100%; very important for the div inside it being scrollable */
        
    }
    .vue-draggable-handle {        
        width: 100%;
        height: 25px;
        background-color: #f5f7f9;
        padding: 3px;
        cursor: pointer;
    }
    .toolbar {
        position: relative;
        z-index: 2;
        background: -webkit-linear-gradient(top, rgba(179,220,237,1) 0%,rgba(41,184,229,1) 50%,rgba(188,224,238,1) 100%);
        border-bottom-left-radius: 18px;
        border-top-left-radius: 18px;
        border-bottom-right-radius: 4px;
        border-top-right-radius: 4px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .connecting {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        z-index: 3;
    }
    .divider {
        height: 70%;
        width: 1px;
        border-style: solid;
        border-width: 1px;
        border-color: white;
        margin-left: 8px;
        margin-right: 5px;
    }
    .setting-btn {
        margin-left: 2px;
        background: linear-gradient(to bottom, rgba(254,252,234,1) 0%,rgba(241,218,54,1) 98%);        
    }
    .toolbar-icon {
        margin-left: 3px;
        margin-right: 3px;
    }
    .account {
        --bg: linear-gradient(to bottom, rgba(149,149,149,1) 0%,rgba(13,13,13,1) 46%,
                rgba(1,1,1,1) 50%,rgba(10,10,10,1) 53%,rgba(78,78,78,1) 76%,rgba(56,56,56,1) 87%,
                rgba(27,27,27,1) 100%);
        --clr: red;
        width: 65px;
        height: 75%;
        margin-left: 3px;
        margin-right: 3px;
        color: var(--clr);
        background: var(--bg);
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-radius: 3px;
        cursor: pointer;
    }
</style>

<template>    
    <div class="layout">                     
        <div class="content" :style="content_clr">
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
                    <all-orders />
                    </div>
                </Pane>
                <Pane title="Miscellaneous">
                    <a-button @click="onClick">test</a-button>
                    <input ref='test' :value="val" />
                    
                </Pane>
            </Layout>
        </div> 
        
        <vue-draggable-resizable class="toolbar" v-show="connected"
            :parent="true" :x="posX" :y="posY" :minh="36" :w="204"
            :h="36" :resizable="false" :drag-cancel="'.cancel'">            
                <a-button @click="showSettings" shape="circle" :disabled="pending"  
                    class="setting-btn cancel">
                    <icon name="tool" :scale="1.5" color="blue"></icon>
                </a-button>
                <div class="divider" />
                <icon :name="lan_connected ? 'lan-connect' : 'lan-disconnect'" :scale="2.7" 
                    :color="lan_connected ? 'green' : 'red'" class="toolbar-icon" ></icon>
                <icon :name="server_connected ? 'server-ok' : 'server-broken'" :scale="2.6" 
                    :color="server_connected ? 'green' : 'red'" class="toolbar-icon" ></icon>
                <icon :name="connected ? 'connect' : 'disconnect'" :scale="2.7" 
                    :color="connected ? 'green' : 'red'" class="toolbar-icon" ></icon>
                <div class='account'  :style="account_clr">
                    <span><b>{{account}}</b></span>
                </div>
        </vue-draggable-resizable>  

        <vue-connecting v-show="!connected" class="connecting"/> 
        
        <a-modal ref="modal"
            title="Preferences"
            v-model="settingsDialogVisiable"
            @ok="save"
            @cancel="cancel"
            :closable='false'
            :confirmLoadinTestg="confirmLoading"
        >
            <vue-settings ref='settings'/>        
        </a-modal>
        
    </div>
</template>
<style lang="less">
@import './index.less';
</style>
<script>
    import Vue from 'vue';
    import Order from '@/components/order.vue';
    import AllOrders from '@/components/allorders.vue';
    import Settings from '@/components/settings.vue';
    import Connecting from '@/components/connecting.vue';
    import { Layout, Pane } from 'vue-split-layout';
    import { mapState, mapActions, mapGetters } from 'vuex';
    import resize from 'vue-resize-directive';
    
    //string formatting 
    //console.log('Is that a %s or a %s?... No, it\'s %s!'.format('plane', 'bird', 'SOman'));
    String.prototype.format = function() {
        return [...arguments].reduce((p,c) => p.replace(/%s/,c), this);
    };

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

    Vue.component('vue-settings', Settings);
    Vue.component('vue-connecting', Connecting);

    export default {
        name: 'Home',
        directives: {
            resize,
        },
        mounted() {
            //set IBConnect callback
            this.setCallback();
            this.readSettings();
            this.setSymbolCallbacks();
        },
        components: {
            Order,
            AllOrders,
            Settings,
            Layout, Pane
        },
        data () {

            return {              
                val: '',
                state: {
                    extraStyle: false,
                    edit: true,
                    resize: true,
                    splits: layouts[0],
                    layoutN: 0
                },
                pending: false,
                settingsDialogVisiable: false,
                confirmLoading: false,
                posX: 2,
                posY: 2,
            };
        },
        watch: {
            val: function(v) {
                console.log(v);
            }
        },
        computed: {
            ...mapState('status', [
                'connected',
                'lan_connected',
                'server_connected',
                'account',
                'status',
            ]),
            ...mapGetters('settings', [
                'posX1',
                'posY1',
            ]),
            account_clr: function() {
                return '--bg: ' + (this.account == 'PAPER' ? 
                    `linear-gradient(to bottom, rgba(254,252,234,1) 0%,rgba(241,218,54,1) 98%);
                    --clr: blue` : 
                    this.account == 'LIVING' ?
                        `linear-gradient(to bottom, rgba(180,227,145,1) 0%,rgba(97,196,25,1) 50%,
                        rgba(180,227,145,1) 100%); --clr: black` : '');
            },
            content_clr: function() {
                return '--bg: ' + (this.lan_connected && this.server_connected ? 'rgb(22, 170, 89)' : 'red');
            }
        },
        methods: {
            ...mapActions('settings', {
                'readSettings': 'read',
                'saveSettings': 'save',
            }),
            ...mapActions('status', {
                'setCallback': 'setCallback',                
            }),
            ...mapActions('symbols', {
                'setSymbolCallbacks': 'setCallbacks',                
            }),
            showSettings() {
                this.settingsDialogVisiable = true;
                //this.$refs.showSettingBtn.blur();
            },
            onClick() {
                //this.$refs.test.value='test';
                this.val = 'HelloWorld.vue';
            },
            onResize() {
                console.log(this.$el.clientWidth);
            },
            save() {
                this.confirmLoading = true;
                this.$refs.settings.save()
                    .then(() => {
                        this.confirmLoading = false;
                        this.settingsDialogVisiable = false;
                    });                
            },
            cancel() {
                this.$refs.settings.cancel();                
            }
        }

    };
</script>