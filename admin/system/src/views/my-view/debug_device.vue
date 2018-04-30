<style lang="less">
    @import '../../styles/common.less';
    @import './components/table.less';
</style>

<template>
<console-panel name="message"></console-panel> 
</template>

<script>
import * as table from './data/search';
import terminal from './components/vue.terminal';
export default {
    name: 'searchable-table',
    data () {
        return {
            searchConName1: '',
            searchConName2: '',
            searchConTel2: '',
            searchConName3: '',
            columns1: table.columns1,
            data1: [],
            initTable1: [],
            data2: [],
            initTable2: [],
            data3: [],
            initTable3: []
        };
    },
    methods: {
        init () {
            this.data1 = this.initTable1 = table.searchTable1;
            this.data2 = this.initTable2 = table.searchTable2;
            this.data3 = this.initTable3 = table.searchTable3;
        },
        search (data, argumentObj) {
            let res = data;
            let dataClone = data;
            for (let argu in argumentObj) {
                if (argumentObj[argu].length > 0) {
                    res = dataClone.filter(d => {
                        return d[argu].indexOf(argumentObj[argu]) > -1;
                    });
                    dataClone = res;
                }
            }
            return res;
        },
        handleSearch1 () {
            this.data1 = this.initTable1;
            this.data1 = this.search(this.data1, {name: this.searchConName1});
        },
        handleSearch2 () {
            this.data2 = this.initTable2;
            this.data2 = this.search(this.data2, {name: this.searchConName2, tel: this.searchConTel2});
        },
        handleSearch3 () {
            this.data3 = this.initTable3;
            this.data3 = this.search(this.data3, {name: this.searchConName3});
        },
        handleCancel3 () {
            this.data3 = this.initTable3;
        }
    },
    mounted () {
        this.init();
    }
};
</script>
