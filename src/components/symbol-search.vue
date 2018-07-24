<style>
    /* group header */
    #outer {
        display: flex;
        flex-direction: column;
    }
    #group {
        display: flex;
        flex-direction: row;
        background-color: rgb(211, 148, 65)
    }
    #group span {
        font-size: 100%;
        font-weight: bold;
        flex: 0 0 auto;
        margin-right: 3px;
        margin-left: 3px;
        padding: 1px;
    }
    #group hr {
        margin-top: 11px; 
    }
    .beginhr {
        width: 10px; 
        margin-right: 3px;    
        flex: 0 0 auto;  
    }
    .endhr {
        flex: 1 1 auto;
    }
    /* group header */

    .container {
        position: relative;
        display: flex;
        width: 193px;
    }
    .search {
        width: 193px;
        height: 100%;
    }
    .spin {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1999;
        border-radius: 4px;
        background-color: rgba(255, 255, 255, 0.7);
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        padding: 12px;
        padding-bottom: 0px;
        padding-top: 4px;
    }
    .label {
        --label-color: white;
        --font-color: black;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
        background-color: var(--label-color);        
        color: var(--font-color);
        border-radius: 4px;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 10px;
        border-style: solid;
        border-width: thin;
        border-color: lightgray;
    }
    .symbol-no-found {
        display: flex;
        align-items: center;
        color: red;
        padding: 3px;
        padding-left: 10px;
        background: rgb(240, 192, 130)
    }
    .div-submenu {
        display: flex;
        width: 100%;
        flex-direction: row;
        align-content: center;
        align-items: center;
        justify-content: space-between;
    }

    #nav {
        list-style:none inside;
        margin:0;
        padding:0;
        text-align:left;
    }

    #nav li {
        display:block;
        width: 100%;
        padding-left: 20px;
        padding-right: 5px;
        position:relative;
        float:left;
        line-height: 25px;
        background: rgb(240, 192, 130); /* menu background color */
    }        
    
    #nav li:hover {background:#4b4bad;} /* highlights current hovered list item and the parent list items when hovering over sub menues */



    /*--- Sublist Styles ---*/
    #nav ul {
        position:absolute;
        padding:0;
        left:0;     
        display:none; /* hides sublists */
    }
    #nav ul li {
        width: 100px;
        color: #000;
    }
    #nav li:hover ul ul {display:none;} /* hides sub-sublists */

    #nav li:hover ul {
        --width: 248px;
        display:block;
        margin-left:var(--width);
        margin-top:-25px;
        } /* shows sublist on hover */

    #nav li li:hover ul {
        display:block; /* shows sub-sublist on hover */
        margin-left:248px; /* this should be the same width as the parent list item */
        margin-top:-25px; /* aligns top of sub menu with top of list item */
    }
</style>
<template>
    <div v-on-clickaway="away">
        <div @click="onClick" class="container" :style="disabled">
            <a-input-search ref="sbox"
                :placeholder="placeholder" 
                class='search'
                @focus="onfocus" 
                @blur="onblur"
                @search="search"
                @keydown.esc="closeDropdown"
                v-model="sValue"
                />
            <div class="spin" v-show="this.loading"><a-spin size="small" /></div>            
            <div v-show="!isEditing" class="label" :style="label_color">
                <slot name="label">
                    <span>
                        <b>{{this.selectedItem ? this.selectedItem.secType == 'CASH' ? 
                            this.selectedItem.tradingClass : this.selectedItem.symbol : ''}} </b>
                        <span style="color:lightgrey">{{!this.selectedItem ? this.placeholder : ''}}</span>
                        <span style="font-size:90%">
                            {{this.selectedItem && this.selectedItem.contractMonth ? 
                            moment(this.selectedItem.lastTradeDateOrContractMonth, 'YYYYMMDD').format("MMMDD'YY") + ' @' +
                            this.selectedItem.exchange : this.selectedItem ? ' @' + 
                            (selectedItem.primaryExchange ? selectedItem.primaryExchange : selectedItem.exchange) : ''}}</span>
                    </span>
                </slot>
            </div>
        </div>
        
        <vue-context :width="dropdownWidth" ref="menu">
            <div>
            <div v-show="!symbolFound" class="symbol-no-found">
                {{data(id)}}
            </div>
            <div v-show="symbolFound" v-for="item in data(id)" :key="item.conId" id="outer">
                <div @click.stop="doNothing(null)" id="group">
                    <hr class='beginhr' />
                    <span>{{item.longName + ' - ' + (item.primaryExchange ? item.primaryExchange : item.exchange)}}</span>
                    <hr class="endhr" />
                </div>
                <ul id="nav">
                    <li v-for="si in item.types" :key="si.conId"
                        @click="(e) => si.contractMonths ? doNothing(e) : onItemClick(si)">
                        <div class="div-submenu" >
                            <span>{{si.secTypeLong}}</span> 
                            <!--span v-if="si.contractMonths.length>0">&raquo;</span-->
                            <icon name='right-triangle' scale="2" v-if="si.contractMonths"/>
                        </div>                    
                        <ul v-if="si.contractMonths" :style="ul_width">
                            <li v-for="ssi in si.contractMonths" 
                                :key="ssi.conId"
                                @click="(e)=> {onItemClick(ssi); handleChildrenClick(e)} "
                                >
                                {{moment(ssi.lastTradeDateOrContractMonth, "YYYYMMDD").format("MMMYYYY")}}
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            </div>
        </vue-context>
    </div>    
</template>

<script>

import { mapState, mapActions, mapGetters } from 'vuex';
import { VueContext } from 'vue-context';
import { directive as onClickaway } from 'vue-clickaway';
import * as moment from 'moment';

export default {
    directives: {
        onClickaway: onClickaway,
    },
    components: {
        VueContext
    },
    props: {
        placeholder: {
            default: '',
            type: String
        },
        id: {
            default: '',
        },
        disabled: {
            default: false,
            type: Boolean
        }
    },
    data () {
        //moment();
        return {        
            //data: this.props.data,
            sValue: '', //searchbox value
            isEditing: false,
            showLabel: this.label,
            selectedItem: null, //contract
            loading: false,
            isAway: false,  //lose focus
        };
    },    
    computed: {
        symbolFound: function() {
            if (typeof this.data(this.id) == 'string') 
                return false;
            else
                return true;
        },
        dropdownWidth: function() {
            if (typeof this.data(this.id) == 'string') 
                return 200;
            else
                return 400;
        },
        //used for submenu left offset  
        ul_width: function() {
            return '--width:' + (this.dropdownWidth - 2) + 'px';
        },
        label_color: function() {
            return '--label-color: ' + (this.disabled ? '#F5F5F5' : 'white') + ';' +
                '--font-color: ' + (this.disabled ? '#bfbfbf' : 'black');
        },
        ...mapState('symbols', {
            
        }),
        ...mapGetters('symbols', {
            currentItem: 'getCurItem',
            data: 'getData', //get all symbols' details from search result
        })
    },
    methods: {
        ...mapActions('symbols', [
            'reqContractDetails',
            'reqMktData',
            'cancelMktData'
        ]),
        moment: moment,
        handleChildrenClick(e) {
            //add this props to distinguish from parent click 
            e.fromChild = true;
        },
        doNothing(e) {
            //if propgate from the child, will be ignored
            if (!e.fromChild)
                e.stopPropagation();
        },
        onClick() { 
            if (!this.disabled) {
                this.isEditing = true;
                this.isAway= false;
                this.$refs.sbox.focus();
            }           
        },
        closeDropdown() {
            this.$refs.menu.close();
        },
        clear() {                    
            if (this.sValue) {
                this.sValue = '';            
                this.cancelMktData({selectedItem: {id: this.id, value: this.selectedItem}});
                this.selectedItem = null;
            }            
        },
        away() {
            //click outside
            this.isEditing = false;
            this.isAway = true;
            this.loading = false;
            this.closeDropdown();
        },
        onItemClick(item) {
            this.$emit('select', item);
            this.selectedItem = item;
            this.isEditing = false;
            this.closeDropdown();
            //console.log(item);
            this.reqMktData({contract: item, selectedItem: {id: this.id, value: item}});            
        },
        onfocus(e) {
            //console.log(e);
            e.target.select();
            this.isEditing = true;
        },
        onblur() {
            
        },
        async search(val) {
            if (val) {
                this.loading = true;
                await this.reqContractDetails({id: this.id, code: val});
                if (!this.isAway) {
                    this.$refs.menu.open();
                }            
                this.loading = false;
            } else {
                this.cancelMktData({selectedItem: {id: this.id, value: this.selectedItem}});
                this.selectedItem = null;
            }                        
        }
    }
};
</script>
