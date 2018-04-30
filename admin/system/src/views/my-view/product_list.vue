<style lang="less" scoped>
    @import '../../styles/common.less';
    @import './components/table.less';

</style>

<template>
    <div>
        <Row>
            <Card>
                <h4 slot="title">
                    <Icon type="android-archive"></Icon>
                    产品列表
                </h4>
           
                <Row>
                    <Col span="24">
                        <Table :columns="columnsCsv" :data="csvData" size="small" ref="tableCsv"></Table>
                        <div class="paging">
                            <Page :total="total" show-elevator @on-change="getChangePage"></Page>
                        </div>
                    </Col>

          
                </Row>
            </Card>
        </Row>
  
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'exportable-table',
    data () {
        return {
            searchConName3: '',
            columnsCsv:  [
                   
                    {
                        title: 'ID',
                        key: 'id'
                    },
                    {
                        title: '产品名称',
                        key: 'name'
                    },
                   
                ],
            csvData: [],
            count:30,
            total:600,
            beginIndex:0,
            endIndex:10

        };
    },
    mounted(){
        this.getTotal();
        this.getData(0,this.count);
            //this.data2 = this.data.slice(this.beginIndex,this.endIndex);
        },
    methods: {

        handleSearch3 () {
            //this.data3 = this.initTable3;
            //this.data3 = this.search(this.data3, {name: this.searchConName3});
        },
        // handleCreateDevice(){
        //     this.$router.push({
        //                 name: 'device_create'
        //             });
        // },
        getTotal(){
            var self = this;
            axios.post('./../admin/get_product_count',{
                        
                    }).then(function (response) {
                        console.log(response);
                        self.total = response.data.total;
                       
                        
                    })
                    .catch(function (error) {
                       // self.$Message.error('连接服务器异常');
                    });
        },
      getData(beginIndex,endIndex){
            var self = this;
          axios.post('./../admin/get_product_list',{
                        begin_index:beginIndex,
                        end_index:endIndex,
                    }).then(function (response) {
                        console.log(response);
                       // self.total = response.total;
                       self.csvData = response.data.list;
                        
                    })
                    .catch(function (error) {
                       // self.$Message.error('连接服务器异常');
                    });

              
            },
            getChangePage(page){
                console.log(page);
                var beginIndex = (page-1)*this.count;
                var endIndex = beginIndex + this.count;
                this.getData(beginIndex,endIndex);
                
            }
    }
};
</script>
