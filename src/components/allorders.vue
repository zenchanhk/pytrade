<style scoped>
    .tbl {
        margin-right: 10px;
    }
</style>

<template>
<div>
    <a-table class="tbl" :columns="columns" :dataSource="data" :scroll="{ x: 1500, y: 300 }" size="small" >
        <a slot="action" slot-scope="text" href="#">action</a>
        
    </a-table>
    <a-button @click="onClick">test</a-button>
    <a-input-search ref='test' v-model="val" />
</div>
</template>

<script>

const columns = [
    { title: 'Column 1', dataIndex: 'address', key: '1', width: 100,
        customCell: function (record) {
            console.log(record);
            return {
                style: {
                    'background-color': 'lightgreen'
                }
            };
        }
    }
];


const data = [];
for (let i = 0; i < 10; i++) {
    data.push({
        key: i,
        name: `Edrward ${i}`,
        age: 32,
        address: `London Park no. ${i}`,
    });
}

export default {
    name: 'all-orders',    
    components: {
    },
    data () {
                    
        return {
            columns,
            data,
            val: '123'
        };
    },
    methods: {
        onClick() {
            //this.$refs.test.value='test';
            this.val = 'HelloWorld.vue';
        },
    }
};
</script>