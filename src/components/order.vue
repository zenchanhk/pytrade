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
        justify-content: space-around;
        
    }
</style>

<template>
    <div>
        <div class='order-slot'>
            <div>
                <div class="order1">                
                    <symbol-search 
                        id='s1' 
                        placeholder="Enter code..." 
                        @select="(item)=>onSelect('s1', item)"
                        :disabled="pending"/>
                    <a-input-number 
                        :min="1" 
                        :max="10" 
                        :disabled="pending"
                        :flat="true"
                        v-model="lots1" 
                        @change="(val)=>onLotsChange(val, 0)"
                        placeholder="Enter #lots" 
                        class="lots" />
                    <a-select                     
                        defaultValue="Up"
                        class="direction" 
                        placeholder="Direction"
                        :disabled="pending"                    
                        @change="(val)=>onDirChange(val, 0)">
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
                        id='s2' 
                        placeholder="Enter code..." 
                        @select="(item)=>onSelect('s2', item)"
                        :disabled="pending"/>
                    <a-input-number 
                        :min="1" 
                        :max="10" 
                        :disabled="pending"
                        v-model="lots2" 
                        @change="(val)=>onLotsChange(val, 1)" 
                        placeholder="Enter #lots" 
                        class="lots" />
                    <a-select 
                        defaultValue="Down"
                        class="direction" 
                        placeholder="Direction"
                        :disabled="pending"
                        @change="(val)=>onDirChange(val, 1)">
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
                <a-button @click="swap" :disabled="pending" type="primary" shape="circle">
                    <icon name="swap" :scale="1.5" color='white'></icon>
                </a-button>             
                <a-button @click="order" class="btn"
                    :style="{'background-color': this.pending ? 'red':'rgb(41, 211, 41)'}">
                    {{!this.pending? "Order" : "Cancel"}}
                </a-button>
                <a-button @click="clear($event)" :disabled="pending" shape="circle" 
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
                :scroll="{ x: 1050, y: 130 }"
                :pagination="false" 
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
                <a slot="action" slot-scope="text, record" @click="cancel(record.contract)">Cancel</a>
                
            </a-table>
        </div>
        
    </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import SymbolSearch  from './symbol-search.vue';
import { isNumeric } from '../utils/tools.js';
import * as moment from 'moment';

Object.defineProperty(Vue.prototype, '$moment', { value: moment });

const columns = [
    { 
        title: 'Symbol', 
        width: 170, 
        key: 'symbol', 
        fixed: 'left',
        scopedSlots: { customRender: 'symbol' }, 
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
    { title: 'Volume', dataIndex: 'volume', key: '4', width: 80 },
    { title: 'Close', dataIndex: 'close', key: '5', width: 80 },
    { title: 'High', dataIndex: 'high', key: '6', width: 80 },
    { title: 'Low', dataIndex: 'low', key: '7' },
    {
        title: 'Status',
        key: '8',
        fixed: 'right',
        width: 100,
        //scopedSlots: { customRender: 'status' },
        customCell: function (record) {            
            return {
                style: {
                    'background-color': record.order ? 'red' : 'white'
                }
            };
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
    props: {
        lotsLinked: {
            default: true,
            type: Boolean
        },
        dirLinked: {
            default: true,
            type: Boolean
        },
    },
    data () {
        /*eslint-disable */            
        return {
            pending: false,
            columns,
            //data: [],
            value: null,
            lots1: null,
            lots2: null,
            dir1: null,
            dir2: null,
            dirs: [
                {value: 0, label: 'Up'},
                {value: 1, label: 'Down'},
            ],
        }
    },
    computed: {
        ...mapGetters('symbols', {
            currentItem: 'getCurItem',
            data: 'getMktData',         //get market data for symbols
            selectedItems: 'getSelectedItems'
        })
    },
    watch: {
        /* used when getMktData returns a promise
        getMktData(promise) {
            promise.then(result => {
                console.log(result);
                //this.data = result
            });
        }*/
    },
    methods: {
        order() {
            this.pending = !this.pending;
            console.log(this.pending);
        },
        cancel(contract) {
            console.log(contract);
        },
        onChange() {

        },
        swap() {

        },
        clear(event) {
            console.log(event);
        },
        onSelect(id, item) {
            
        },
        onLotsChange(val, id) {
            //console.log(val);
            //console.log(id);
        },
        onDirChange(val, id) {
            //console.log(val);
            //console.log(id);
        }
    }
}
</script>