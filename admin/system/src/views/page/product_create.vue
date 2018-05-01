<style lang="less" scoped>
    @import '../../styles/common.less';
    @import './components/table.less';

</style>

<template>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="产品名字" prop="name">
            <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
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
                formValidate: {
                    name: '',
                   
                },
                ruleValidate: {
                    name: [
                        { required: true, message: 'The name cannot be empty', trigger: 'blur' }
                    ]
                   
                }
            }
    },
    mounted(){
        
            //this.data2 = this.data.slice(this.beginIndex,this.endIndex);
        },
    methods: {

         handleSubmit (name) {
             var self = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        axios.post('./../admin/product_create',{
                            name:this.formValidate.name
                        }).then(function (response) {
                            console.log(response);
                            //self.total = response.total;
                            //this.$Message.success('Success!');
                            self.$router.push({
                                    name: 'product_list'
                                    });
                            
                        })
                        .catch(function (error) {
                        // self.$Message.error('连接服务器异常');
                        this.$Message.error('Fail!');
                        });
                        
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
    }
};
</script>
