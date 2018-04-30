<style lang="less" scoped>
    @import '../../styles/common.less';
    @import './components/table.less';

</style>

<template>
        <Form ref="formValidate" :model="formValidate"  :label-width="80">
        <FormItem label="产品类型" prop="product_id">
            <Select v-model="formValidate.product_id" placeholder="请选择产品类型">
                <Option v-for="product in products" v-bind:value="product.id">
                    {{ product.name }}
                </Option>
            </Select>
        </FormItem>
       
        <FormItem label="WIFI类型" prop="wifi_type">
            <Select v-model="formValidate.wifi_type" placeholder="请选择WIFI类型">
                <Option value="1">3165</Option>
                
            </Select>
        </FormItem>
       
        <FormItem label="MAC 列表" prop="mac_list">
            <Input v-model="formValidate.mac_list" type="textarea" :autosize="{minRows: 20,maxRows: 2000000}" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
            <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
        </FormItem>
    </Form>
</template>

<script>
import axios from 'axios';
export default {
    name: 'exportable-table',
    data () {
       return {
            products:[],
            
                formValidate: {
                    product_id: 1,
                    wifi_type: "1",
                    mac_list: '',
                },
                ruleValidate: {
                    product_id: [
                        {  type: "number",  required: true, message: 'The product cannot be empty', trigger: 'change' }
                    ],
                    wifi_type: [
                        {  required: true, message: 'The wifi_type cannot be empty', trigger: 'change' }
                    ],
                    desc: [
                        { required: true, message: 'Please enter a MAC', trigger: 'blur' },
                        { type: 'string', min: 12, message: 'MAC no less than 12 words', trigger: 'blur' }
                    ]
                }
            }
    },
    mounted(){

        
        this.loadProduct();
            //this.data2 = this.data.slice(this.beginIndex,this.endIndex);
        },
    methods: {
        loadProduct(){
            var self =this;
            axios.post('./../admin/get_product_list',{
                        
                    }).then(function (response) {
                        console.log(response);
                        self.products = response.data.list;
                       
                        
                    })
                    .catch(function (error) {
                       // self.$Message.error('连接服务器异常');
                    });

        },
         handleSubmit (name) {
             //console.log(this.formValidate.mac_list);
                this.$refs[name].validate((valid) => {
                    var self = this;
                    axios.post('./../admin/device_create',{
                            product_id:this.formValidate.product_id,
                            wifi_type:this.formValidate.wifi_type,
                            mac_list:this.formValidate.mac_list,
                        }).then(function (response) {
                            console.log(response);
                            //self.total = response.total;
                            //this.$Message.success('Success!');
                            self.$router.push({
                                    name: 'device_list'
                                    });
                            
                        })
                        .catch(function (error) {
                        // self.$Message.error('连接服务器异常');
                        self.$Message.error('Fail!');
                        });


                    // if (valid) {
                    //     this.$Message.success('Success!');
                    // } else {
                    //     this.$Message.error('Fail!');
                    // }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
    }
};
</script>
