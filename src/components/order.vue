<style scoped>
    .order-slot {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .order1 {
        display: flex;
        flex-direction: row;
    }
    .order2 {
        display: flex;
        flex-direction: row;
        margin-top: 5px;
    }
    .code {
        min-width: 200px;
        max-width: 300px;
    }
    .lots {
        
        min-width: 50px;
        max-width: 120px;
        margin-left: 5px;
    }
    .direction {
        width: 90px;        
        margin-left: 5px;
    }
    .icon-btn {
        margin-left: 5px;
    }
    .btn {
        margin: 3px;        
        width: 120px;
        height: 70px;
        font-size: 30px;
        background-color: rgb(41, 211, 41);
    }
    .clear-btn-active {
        background-color: red;
    }
    .clear-btn-deactive {
        background-color: #D7DDE4;
    }
    .btn-div {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .btn-text {
        font-size: 24px;
    }
    .tbl1 {
        margin-top: 5px;
        margin-right: 10px;
    }
    .data-last {        
        top: -8px;
        left: -8px;
        bottom: -8px;
        right: -8px;
    }
    .data-status {
        width: 100%;
        height: 100%;
        background-color: rgb(238, 34, 34);
    }
    .data-icon-container {
        display: flex;
        flex-direction: row;
        /*justify-content: space-around;  */      
    }
    .icon-btn-div {
        display: flex;
        flex-direction: column;
        margin-left: 3px;
        height: 68px;
        justify-content: space-between;
    }
    .div-details {
        display: flex;
        flex-direction: row;
    }
    .span-info {
        background: lightpink;
        border-radius: 3px;
        padding: 5px;
        margin-right: 10px;
    }
    .div-msg {
        background: lightgray;
        margin-top: 5px;   
    }
    .div-err {
        background: lightsalmon;
        margin-top: 5px;   
    }
</style>

<template>
    <div>
        <div class='order-slot'>
            <div>
                <div class="order1">                
                    <symbol-search 
                        ref='search1'
                        id='s1' 
                        placeholder="Enter code..." 
                        @select="(item)=>onSelect('s1', item)"
                        @clear="()=>onSymbolClear('s1')"
                        :disabled="pending"/>
                    <a-input-number 
                        :min="0" 
                        :max="10000" 
                        :disabled="pending"
                        :flat="true"
                        :value="lots1" 
                        @change="(val)=>onLotsChange(val, 's1')"
                        placeholder="Enter #lots" 
                        class="lots" />
                    <a-select                     
                        defaultValue="Up"
                        class="direction" 
                        placeholder="Direction"
                        :disabled="pending" 
                        :value="dir1"                   
                        @change="(val)=>onDirChange(val, 's1')">
                        <a-select-option 
                            v-for="item in dirs" 
                            :value="item.value" 
                            :key="item.value">
                            {{ item.label }}
                        </a-select-option>
                    </a-select>
                </div>
                <div class="order2">
                    <symbol-search 
                        ref='search2'
                        id='s2' 
                        placeholder="Enter code..." 
                        @select="(item)=>onSelect('s2', item)"
                        @clear="()=>onSymbolClear('s2')"
                        :disabled="pending"/>
                    <a-input-number 
                        :min="0" 
                        :max="10000" 
                        :disabled="pending"
                        :value="lots2" 
                        @change="(val)=>onLotsChange(val, 's2')" 
                        placeholder="Enter #lots" 
                        class="lots" />
                    <a-select 
                        defaultValue="Down"
                        class="direction" 
                        placeholder="Direction"
                        :disabled="pending"
                        :value="dir2"
                        @change="(val)=>onDirChange(val, 's2')">
                        <a-select-option 
                            v-for="item in dirs" 
                            :value="item.value" 
                            :key="item.value">
                            {{ item.label }}
                        </a-select-option>
                    </a-select>
                </div>            
            </div>
            <div class="btn-div">
                <div class="icon-btn-div">
                    <a-button @click="swap" :disabled="pending" type="primary" shape="circle">
                        <icon name="swap" :scale="1.6" color='white'></icon>
                    </a-button>  
                    <a-button @click="calculate" :disabled="pending" type="primary" shape="circle">
                        <icon name="calculate" :scale="1.6" color='white'></icon>
                    </a-button>
                </div>           
                <a-button @click="()=>!this.pending?this.order():this.cancel()" class="btn"
                    :style="{'background-color': this.pending ? 'red':'rgb(41, 211, 41)'}">
                    {{!this.pending? "Order" : "Cancel"}}
                </a-button>
                <a-button @click="clearAll" :disabled="pending" shape="circle" 
                    :style="{'background-color': this.pending ? '#F5F5F5':'red'}">
                    <icon name="clear" :scale="1.5" :color="this.pending ? 'white' : 'yellow'"></icon>
                </a-button>  
            </div>
        </div> 
        
        <div class="tbl1">
            <a-table 
                bordered
                class="tbl" 
                :columns="columns" 
                :dataSource="data" 
                :scroll="{ x: 1200, y: 250 }"
                :pagination="false" 
                :defaultExpandAllRows="true"
                :expandRowByClick="true"
                size="small"
                 >
                <span slot="symbol" slot-scope="text, record">
                    <div><span>
                        <b>{{(record.contract.secType=='CASH' ? record.contract.tradingClass
                            : record.contract.symbol) + ' '}} </b>
                        <span style="font-size:90%">
                            {{record.contract.lastTradeDateOrContractMonth ? 
                            $moment(record.contract.lastTradeDateOrContractMonth, 'YYYYMMDD').format("MMMDD'YY") + ' @' +
                            record.contract.exchange : ' @' + 
                            (record.contract.primaryExchange ? record.contract.primaryExchange : record.contract.exchange)}}</span>
                    </span></div>
                </span>   
                <span slot="last" slot-scope="text, record">
                    <div class="data-icon-container">
                        <span>{{record.last}}</span>
                    </div>
                </span>
                <span slot="status" slot-scope="text, record">
                    <div class="" v-if="record.trade">
                        <span>{{(record.trade.orderStatus.filled > 0 && record.trade.orderStatus.filled &lt; record.trade.order.totalQuantity) ? 
                                (record.trade.orderStatus.filled + ' / ' + record.trade.order.totalQuantity)
                                : record.trade.orderStatus.status}}</span>
                    </div>
                </span>  
                <span slot="total" slot-scope="text, record">
                    <span><b>{{Math.round((record.last ? record.last : record.marketPrice) * 
                        lookupLots(record.contract.conId) * (record.contract.multiplier?record.contract.multiplier:1))}}</b></span>
                </span>                 
                <a slot="action" slot-scope="text, record" 
                    @click="cancel(record.contract)" 
                    v-if="record.trade && cancellableStatus.includes(record.trade.orderStatus.status)">Cancel</a>
                <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
                    <div class="div-details" v-if="record.trade" >
                        <span class="span-info" >{{'Action: ' + record.trade.order.action}}</span>
                        <span class="span-info" >{{'Order Type: ' + record.trade.order.orderType}}</span>
                        <span class="span-info" >{{'Quantity: ' + (record.trade.orderStatus.filled + ' / ' + record.trade.order.totalQuantity)}}</span>
                        <span class="span-info" >{{'Avg Price: ' + record.trade.orderStatus.avgFillPrice}}</span>
                        <span class="span-info" >{{'Commission: ' + 
                            (record.trade.comcur?(record.trade.comcur + record.trade.commission):'--')}}</span>
                    </div>
                    <div class="div-msg" v-if="record.msgs" >
                        <div v-for="(msg, index) in record.msgs" :key="index" >
                            <span>{{msg}}</span>
                        </div>
                    </div> 
                        
                    <div class="div-err" v-if="record.error" >
                        <span>{{record.error}}</span>
                    </div>
                </div>
            </a-table>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions, mapState } from 'vuex';
import SymbolSearch  from './symbol-search.vue';
import { isNumeric } from '../utils/tools.js';
import * as moment from 'moment';

Object.defineProperty(Vue.prototype, '$moment', { value: moment });

function progressBg(record) {
    var per = 0;
    var bg = '';
    if (record.trade) {
        per = Math.round(record.trade.orderStatus.filled * 100 / 
            (record.trade.orderStatus.filled + record.trade.orderStatus.remaining));
    }
    if (record.trade) {
        switch (record.trade.orderStatus.status) {
            case 'PreSubmitted':
            case 'PendingSubmit':
                bg = 'yellow';
                break;
            case 'Submitted':
                
                break;
            case 'Filled':
                bg = 'yellowgreen';
                break;
            case 'PnedingCancel':
                bg = 'lightcoral';
                break;
            case 'Cancelled':
                bg = 'red';
                break;
            default:
                bg = 'grey';
                break;
        }
    }
    
    return {
        style: {            
            'background': (per > 0 && per < 1) ? `linear-gradient(to right, yellowgreen ${per}%, white ${100-per}%)` : bg
        }
    };
}

const columns = [
    { 
        title: 'Symbol', 
        width: 170, 
        key: 'symbol', 
        fixed: 'left',
        scopedSlots: { customRender: 'symbol' }, 
        customCell: function (record) { 
            return progressBg(record);
        }
    },
    {
        title: 'Last',
        key: '0',
        fixed: 'left',
        width: 100,
        scopedSlots: { customRender: 'last' },
        customCell: function (record) {           
            return {
                style: {
                    'background-color': record.last == null || (isNumeric(record.last) && record.last == record.close) ? 'transparent' :
                        record.last < record.close ? 'rgb(238, 34, 34)' : 'lightgreen',
                    'color': record.marketPrice == null || (isNumeric(record.marketPrice) && record.last == record.close) ? 'black' :
                        record.marketPrice < record.close ? 'yellow' : 'black',
                }
            };
        }
    },
    { title: 'Bid', dataIndex: 'bid', key: '1', width: 80, fixed: 'left' },
    { title: 'Ask', dataIndex: 'ask', key: '2', width: 80, fixed: 'left' },
    { title: 'Market Price', dataIndex: 'marketPrice', key: '3', width: 100, fixed: 'left',
        customCell: function (record) {           
            return {
                style: {
                    'background-color': record.marketPrice == null || (isNumeric(record.marketPrice) && record.last == record.close) ? 'transparent' :
                        record.marketPrice < record.close ? 'rgb(238, 34, 34)' : 'lightgreen',
                    'color': record.marketPrice == null || (isNumeric(record.marketPrice) && record.last == record.close) ? 'black' :
                        record.marketPrice < record.close ? 'yellow' : 'black',
                }
            };
        } },
    { title: 'Total Price', key: 'total', width: 100, fixed: 'left',
        scopedSlots: { customRender: 'total' },
        customCell: function () {           
            return {
                style: {
                    'background-color': 'yellow',
                }
            };
        }   },
    { title: 'Volume', dataIndex: 'volume', key: '4', width: 80 },
    { title: 'Close', dataIndex: 'close', key: '5', width: 80 },
    { title: 'High', dataIndex: 'high', key: '6', width: 80 },
    { title: 'Low', dataIndex: 'low', key: '7' },
    {
        title: 'Status',
        key: '8',
        fixed: 'right',
        width: 100,
        scopedSlots: { customRender: 'status' },
        customCell: function (record) {            
            return progressBg(record);
        }
    },
    {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
        scopedSlots: { customRender: 'action' },
    },
];


export default {
    name: 'Order',
    
    components: {
        SymbolSearch
    },
    mounted() {
        this.setCallbacks();
    },
    data () {
        /*eslint-disable */            
        return {
            pending: false,
            columns,
            //data: [],
            value: null,
            dirs: [
                {value: 0, label: 'LONG'},
                {value: 1, label: 'SHORT'},
            ],
            
        }
    },
    computed: {
        ...mapState('orders', [
            'cancellableStatus',
            'completeStatus'
        ]),
        ...mapGetters('symbols', {
            currentItem: 'getCurItem',
            data: 'getMktData',         //get market data for symbols
            selectedItems: 'getSelectedItems',
            s1: 's1',
            s2: 's2',
        }),
        ...mapGetters('orders', [
            'lots1',
            'lots2',
            'dir1',
            'dir2'
        ]),
        ...mapGetters('settings', [
            'lotslinked',
            'dirlinked'
        ]),
    },
    watch: {
        /* used when getMktData returns a promise
        getMktData(promise) {
            promise.then(result => {
                console.log(result);
                //this.data = result
            });
        }*/
        s1: function(val) {
            if (val && this.lotslinked) {
                this.calLinkedLots({id: 's2'});
            }
            if (!val) {
                this.changeLots({id: 's1', lots: 0});
            }
            if (val && val.trade) {
                this.calPendingStatus();
            }
        },
        s2: function(val) {
            if (val && this.lotslinked) {
                this.calLinkedLots({id: 's1'});
            }
            if (!val) {
                this.changeLots({id: 's2', lots: 0});
            }
            if (val && val.trade) {
                this.calPendingStatus();
            }
        },
        dirlinked: function(val) {
            if (val && this.dir1 == this.dir2) {
                this.changeDir({id: 's1', dir: 0});
                this.changeDir({id: 's2', dir: 1});
            }
        },
        lotslinked: function(val) {
            if (val) {
                this.calculate();
            }
        }
    },
    methods: {
        ...mapActions('orders', {
                'swap': 'swap',
                'changeDir': 'changeDir',
                'changeLots': 'changeLots',
                'calLinkedLots': 'calLinkedLots',
                'clear': 'clear',
                'setCallbacks': 'setCallbacks',
                'placeOrders': 'placeOrders',
                'cancelOrder': 'cancelOrder',
            }),        
        calPendingStatus() {
            if ((!s1 || (s1 && s1.trade && this.completeStatus.includes(s1.trade.orderStatus.status))) ||
                (!s2 || (s2 && s2.trade && this.completeStatus.includes(s2.trade.orderStatus.status)))) {
                this.pending = false;
            }
        },
        order() {
            this.pending = !this.pending;
            this.placeOrders();
        },
        cancel(contract) {
            if (contract)
                this.cancelOrder(contract);
            else
                this.cancelOrder();                
        },
        lookupLots(conId) {
            return conId == this.s1.conId ? this.lots1 : this.lots2;
        },
        clearAll(event) {
            this.clear();
            this.$refs.search1.clear();
            this.$refs.search2.clear();
        },
        onSymbolClear(id) {
            this.changeLots({id: id, lots: 0});
        },
        onSelect(id, item) {
            if (this.lotslinked)
                this.calLinkedLots({id});
        },
        onLotsChange(val, id) {
            if (val && val > 0) {
                this.changeLots({id: id, lots: val});
                if (this.lotslinked)
                    this.calLinkedLots({id});
            }            
        },
        calculate() {
            if ((this.lots1 && !this.lots2) || (this.lots1 && this.lots2)) {
                this.calLinkedLots({id: 's1'});
            }
            if (!this.lots1 && this.lots2) {
                this.calLinkedLots({id: 's2'});
            }
        },
        onDirChange(val, id) {            
            if (this.dirlinked)
                this.swap();
            else
                this.changeDir({id: id, dir: val});
        }
    }
}
</script>