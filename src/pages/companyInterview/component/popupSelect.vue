<template>
  <div>
 
    <van-popup class="popUp" v-model="showPopup" :position="position" :style="{ height: '100%' }" >
        <div class="topTitle">
          <img class="backBlack" src="@/assets/img/backBlack.png" alt="" @click="goToBack">
          <div class="selectJobs">{{title}}</div>
        </div> 

        <div class="middle" v-if="selectType=='checkBox'">
          <div class="middle-top">
            <span class="selectedNum" >已选（{{hasSelectedArr.length}}/5）</span>
            <span class="clear" @click="clearAll">清空</span>
          </div>
          <div style="padding-bottom:20px">
             <span class="selectJob" v-for="(selectItem,selectIndex) in hasSelectedArr " :key="selectIndex">{{selectItem.value}}<span style="margin-left:6px" @click="toClearItem(selectItem,selectIndex)"> X</span></span>
          </div>
        </div>

      <div class="bottom" v-if="selectType=='checkBox'">
        <div :class="item.flag ? 'selectedJob jobItem' : 'unSelectJob jobItem'" v-for="(item,index) in list " :key="index" @click="toSelectCheckBox(item,index)">{{item.value}}</div>
      </div>

      <div class="bottom" v-if="selectType=='single'">
        <div :class="item.flag=='checked' ? 'selectedJob jobItem' : 'unSelectJob jobItem'" v-for="(item,index) in list " :key="index" @click="toSelectSingle(item,index)">{{item.value}}</div>
      </div>  

       <div class="bottomBtn" >
         <van-button  round type="primary" block  @click="handleSave">保存</van-button>
     </div>
    </van-popup>
  </div>
</template>

<script>
export default {
    name:'popupSelect',
    data(){
        return{
            showPopup:false,
            hasSelectedArr:[],
            hasSelectedItem:{}

        }
    },
    props:{
        selectType:{
            default:'single',
            type:String
        },
        title:'',
        position:{
            default:'bottom',
            type:String
        },
         show:{
            default:'false',
            type: Boolean,
        },
        list:[],
    },
    watch:{
        show(val){
            this.showPopup=val
        },
        list(val){
           
        }
    },
    methods:{
        // 多选
        toSelectCheckBox(item,index){
            if(this.list.length < 5){
                item.flag =!item.flag
            }else{
                item.flag = false         
            }
            if(item.flag){
                this.hasSelectedArr.push(item);
                this.hasSelectedArr =Array.from(new Set(this.hasSelectedArr)) 
            }else{
                this.hasSelectedArr.forEach((a,b)=>{
                if(a.value=== item.value){
                this.hasSelectedArr.splice(b,1);
                }
                })
            }      
        },
        //单选
        toSelectSingle(item,index){
          this.list.forEach(i=>{
            if(i.flag){
              i.flag=''
            }
          });
          item.flag ='checked';
          this.hasSelectedItem=item;
        },
        //保存
        handleSave(){
            if(this.selectType=='single'){
                this.$emit('handleSave',this.hasSelectedItem)
            }else if(this.selectType=='checkBox'){
                this.$emit('handleSave',this.hasSelectedArr)
            }
        },
        //返回
        goToBack(){
            this.showPopup=false;
            this.$emit('handleShow',this.showPopup)
        },  
         // 清除
        clearAll(){
        if(this.selectType=='single'){
            this.hasSelectedItem={};
            this.list.forEach(item=>{
                item.flag =null
            })
        }else if(this.selectType=='checkBox'){
            this.hasSelectedArr = [];
            this.list.forEach(item=>{
                item.flag =false
            })
        }
      
    },
    
    // 单个删除
    toClearJob(selectItem,selectIndex){
      this.hasSelectedArr.forEach((item,index)=>{
        if(item === selectItem){
          this.hasSelectedArr.splice(index,1);
        }
      })
      this.list.forEach((a,b)=>{
        if(a.value === selectItem){
          a.flag=false
        }
      })
      
    },
    toClearItem(selectItem,selectIndex){
      console.log(66)
      this.list.forEach((item,index)=>{
            if(item.value == selectItem){
            this.list.splice(index,1);
            }
        })
        this.hasSelectedArr.forEach((a,b)=>{
            if(a.value== selectItem.value){
              a.flag=false
              this.hasSelectedArr.splice(b,1);
            }
        })
      }
    },
}
</script>

<style lang='less' scoped>
    .popUp{
      
      .topTitle{
        padding:54px 0 30px 16px;
        display: flex;background-color:#fff;
        .backBlack{
          width: 12px;
          height: 24px;
        }
        .selectJobs{
          width: 70px;
          height: 20px;
          font-size: 17px;
          font-family: AppleSystemUIFont;
          color: #000000;
          line-height: 20px;
          margin-left: 125px;
        }
      }
      .middle{
        background-color:#fff;
        padding:0 20px 0; 
        .middle-top{
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          .selectedNum{
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
          }
          .clear{
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #9EA5BB;
          }
        }
        .noDataMiddle{
          height: 12px;
        }
        .selectJob{
          // height: 12px;
          display: inline-block;
          background: rgba(50, 93, 254, 0.1);
          border-radius: 2px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #2953FF;
          line-height: 12px;
          padding:8px 12px;
          margin-right: 12px;
          margin-top: 8px;
        }
      }
      .bottom{
        margin-bottom: 70px;
        .jobItem{
          width: 355px;
          height: 14px;
          // background: #2953FF;
          // opacity: 0.1;
          padding:15px 0 15px 20px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          // color: #5A6073;
          line-height: 14px;
        }
        .selectedJob{
          background: rgba(41, 83, 255, 0.1);
          color: #2953FF;
        }
        .unSelectJob{
          color: #5A6073;
        }
      }
      .bottomBtn{
        position: fixed; 
        left: 30px;     
        bottom: 20px;
        width: 315px;
        height: 42px; 
        .van-button--primary{
           background: #2953FF;
           border: 1px solid #2953FF
        }
        .van-button--round{
           border-radius: 26px;
        }
        .van-button__text{
          font-size: 18px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #FFFFFF;
        }
    }
     
      

    }
</style>