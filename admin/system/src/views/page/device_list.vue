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
                    设备列表
                </h4>
                 <Row>
                        <Input v-model="searchConName3" placeholder="请输入MAC搜搜..." style="width: 200px" />
                        <span @click="handleSearch3" style="margin: 0 10px;"><Button type="primary" icon="search">搜索</Button></span>
                        
                    </Row>
                <Row>
                    <Col span="24">
                        <Table :columns="columnsCsv" :data="csvData" size="small" ref="tableCsv"></Table>
                        <div class="paging">
                            <Page :total="total" :page-size="count" show-elevator @on-change="getChangePage"></Page>
                        </div>
                    </Col>

          
                </Row>
            </Card>
        </Row>
  
    </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
export default {
    name: 'exportable-table',
    data () {
        return {
            searchConName3: '',
            columnsCsv:  [
                    {
                        type: 'selection',
                        width:30,
                    },
                    {
                        title: 'MAC',
                        key: 'mac',
                        width:150,
                    },
                    {
                        title: '名称',
                        key: 'name',
                        width:150,
                    },
                    {
                        title: '状态',
                        key: 'is_online',
                        render:function(h,params){
                            if(this.row.is_online==1){
                                return h('div','在线');
                            }
                            return h('div','离线');
                        },
                         width:80,
                    },
                    {
                        title: '型号',
                        key: 'product_name',
                        width:150,
                    },
                    {
                        title: '版本',
                        key: 'version',
                         width:100,
                    },
                    {
                        title: 'WIFI类型',
                        key: 'wifi_type',
                         render:function(h,params){
                            if(this.row.wifi_type==1){
                                return h('div','3165');
                            }
                            return h('div','default');
                        },
                        width:100,
                    },
                    {
                        title: '经度',
                        key: 'lan',
                        width:50,
                    },
                     {
                        title: '纬度',
                        key: 'lon',
                        width:50,
                    },
                    {
                        title: 'PM2.5',
                        key: 'pm25',
                        sortable:true,
                        width:100,
                    },
                     {
                        title: 'PM10',
                        key: 'pm10',
                        sortable:true,
                        width:100,
                    },
                    {
                        title: 'CO2',
                        key: 'co2',
                        width:80,
                    },
                    {
                        title: 'TVOC',
                        key: 'tvoc',
                        width:80,
                    },
                    {
                        title: '温度',
                        key: 'temp',
                        width:80,
                    },
                    {
                        title: '湿度',
                        key: 'humi',
                        width:80,
                    },
                     {
                        title: '创建时间',
                        key: 'create_time',
                        render:function(h,params){
                            return h('div',moment(this.row.create_time*1000).format('YYYY-MM-DD:HH:mm'));
                        }
                    },
                    {
                        title: '最后上传',
                        key: 'time',
                         render:function(h,params){
                             var date = '-';
                             if(this.row.time!=null && this.row.time.length>0){
                                 date = moment(this.row.time*1000).format('YYYY-MM-DD:HH:mm');
                             }
                            return h('div',date);
                        }
                    }
                    
                ],
            csvData: [],
            count:15,
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
            axios.post('./../admin/get_device_count',{
                        
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
          axios.post('./../admin/get_device_list',{
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
