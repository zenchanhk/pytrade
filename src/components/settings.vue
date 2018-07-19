
<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #fcfeff;        
        border-radius: 4px;        
        
        flex-direction: column;
        min-height: 100vh;
        position: absolute;
    }
    
    .setting-div {
        display: flex;
        flex-direction: column;
        width: 200px;
        height: 95px;
    }
    .setting-subdiv {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-bottom: 5px;
        padding-top: 10px;
    }
    .div {
        display: flex;
        flex-direction: row;
        margin-bottom: 11px;
    }
    .beginhr {
        width: 10px; 
        margin-right: 3px; 
        margin-top: 10px;   
        flex: 0 0 auto;  
    }
    .endhr {
        margin-left: 3px;
        margin-top: 10px;
        flex: 1 1 auto;
    }
    .top-margin {
        margin-top: 15px;
    }
    
</style>

<template>    
    <div>   
        <div class="div">
            <hr class='beginhr' />
            <span><b>Link Settings</b></span>
            <hr class='endhr' />
        </div>
        <a-checkbox>Lots Linked</a-checkbox>
        <a-checkbox >Direction Linked</a-checkbox>
        <!--div class="div top-margin">
            <hr class='beginhr' />
            <span><b>IB Connection Settings</b></span>
            <hr class='endhr' />
        </div>
        <a-checkbox>Lots Linked</a-checkbox>
        <a-checkbox >Direction Linked</a-checkbox-->
    </div>      
</template>
<script>
    import { mapState, mapActions } from 'vuex';
     
    export default {
        name: 'vue-settings', 

        data () {                    
            return {
                confirmLoading: false,
                lots_linked: true,
                direction_linked: true,
            };
        },
        computed: {
            ...mapState('settings', {
            
            })
        },
        watch: {
            visible: function(val) {
                console.log(val);
            }
        },
        methods: {
            ...mapActions('status', [
                'asyncSave',
            ]),
            save: async function() {                
                var result = {
                    lotslinked: this.lots_linked,
                    dirlinked: this.direction_linked 
                };
                return new Promise((resolve, reject) => {
                    this.asyncSave({section: 'link', cfg: JSON.stringify(result)})
                        // eslint-disable-next-line
                        .then(result => resolve(true)).catch(error => reject(false));
                });
            },
            cancel() {
                
            }
        }

    };
</script>