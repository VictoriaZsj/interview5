<!-- 公司卡片组件-->
<template>
<div>
  <van-cell-group>
   <div class="companyInterviewDesc">
    <div class="topDesc">
      <div style="display:flex;align-items:center">
        <img class="companyImg" v-if="info.companyLogo" :src="info.companyLogo" alt="">
        <img class="companyImg" v-else  src="@/assets/img/companyLogo.png" alt="">
        <div class="topContent">
          <div class="name">{{info.companyName}}</div>
          <!-- <span class="companyDesc" v-for="(detailItem,detailIndex) in detailList" :key="detailIndex">{{detailItem}}</span> -->
          <span class="companyDesc" >{{info.industry}}</span>
          <span class="companyDesc" >{{info.companyScale}}</span>
          <span class="companyDesc" >{{info.companyType}}</span>    
         </div>
      </div>
      <!-- <img  class="iconImg" src="@/assets/img/blueMore.png" alt=""> -->
    </div>
    <div class="line"></div>
    <div>
        <span class="interviewJob" >热招岗位：</span>
        <span class="job" v-for="(caseInfo,jobIndex) in info.caseInfoList" :key="jobIndex"><span class="circle"></span>{{caseInfo.caseName}}</span>
    </div>
    <div  class="time" v-if="info.interviewDate">面试时段： {{info.interviewDate}}</div>
  </div>
  </van-cell-group>
  
</div>
 

</template>

<script>
import { Cell, CellGroup } from 'vant';
export default {
  name:'card',
  data() {
    return {
      detailList:['互联网','5000人以上','5000人以上'],
      jobList:['产品经理','开发经理','客户经理'],

    };
  },
  props:{
    info:{}
  },

  methods:{
  }
}
</script>

<style lang='less' scope>
.companyInterviewDesc{
  padding:20px 20px 14px 20px;
  margin-bottom: 10px;
  // background: #FFFFFF;
  background: #FFFFFF;
  box-shadow: 0px 10px 20px 2px rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  .topDesc{
    display: flex;  
    justify-content: space-between;
    align-items: center;  
    margin-bottom: 8px;    
    .companyImg{
      width: 42px;
      height: 42px;
      border-radius: 3px;
      background-color: pink;
    }
    .iconImg{
      width: 20px;
      height: 20px;
    }
    .topContent{
      margin-left: 18px;
      .name{
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #191C27;
        margin-top: 3px;
        // margin-bottom: 5px;
      }
      .companyDesc{
        margin-left: -5px;
        display: inline-block;
        padding:6px 6px;
        background: #F8FAFD;
        border-radius: 3px;
        font-size: 12px;
        -webkit-transform: scale(0.83);
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color:  #9EA5BB;
      }
    }
    
  }

  .line{
    width: 295px;
    height: 1px;
    background: #E8E8F3;
    margin-top: 8px;
    margin-bottom: 10px;
  }
  .interviewJob{
    width: 60px;
    height: 12px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #5A6073;
    line-height: 12px;
    // margin-right:1px;
  }
  
  .job{
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #5A6073;
    margin-right: 14px;
    .circle{
      display: inline-block;
      width: 5px;
      height: 5px;
      background: #2953FF;
      margin-right: 5px;
      margin-bottom: 2px;
      border-radius: 5px;
      line-height: 5px;
    }
  }
  .time{
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #5A6073;
    margin-top: 8px;
  }
  

}

</style>