
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
    <div v-observe-visibility="visibilityChanged">   
        <div class="div">
            <hr class='beginhr' />
            <span><b>Link Settings</b></span>
            <hr class='endhr' />
        </div>
        <a-checkbox v-model="ll" >Lots Linked</a-checkbox>
        <a-checkbox v-model="dl" >Direction Linked</a-checkbox>
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
    import { mapGetters, mapActions } from 'vuex';
     
    export default {
        name: 'vue-settings', 

        data () {                    
            return {
                needAssign: true,
                ll: false,
                dl: false,
            };
        },
        mounted() {
            //this.ll = this.lotslinked;
            //this.dl = this.dirlinked;
        },
        computed: {
            ...mapGetters('settings', [
                'lotslinked',
                'dirlinked'
            ]),
        },
        methods: {
            ...mapActions('settings', [
                'asyncSave',
            ]),
            visibilityChanged(isVisible, entry) {
                // this will be trigger whenever the page being refreshed
                if (this.needAssign) {
                    this.ll = this.lotslinked;
                    this.dl = this.dirlinked;
                    this.needAssign = false;
                } 
                if (entry.intersectionRatio == 0) {
                    this.needAssign = true;
                }
                //console.log(isVisible);
                //console.log(entry);               
            },
            save: async function() {                
                var result = {
                    link: {
                        lotslinked: this.ll,
                        dirlinked: this.dl 
                    }                    
                };
                return new Promise((resolve, reject) => {
                    this.asyncSave({cfg: JSON.stringify(result)})
                        .then(result => resolve(result)).catch(error => reject(error));
                });
            },
            cancel() {
                
            }
        }

    };
</script>