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
              <div v-if="info.interviewRoomList.length>0&&info.interviewRoomList[0].startTime" class="topTime">空闲面试间：{{info.interviewRoomList[0].interviewTime}}</div>
              <div v-else class="selectedTime"><div v-if="info.interviewDate">面试日期：{{info.interviewDate}}</div></div>
            </div>
          </div>
          <!-- <img v-if="info.hasDelivered" class="iconImg" src="@/assets/img/greyMore.png" alt="" @click="selectCompany()">
          <img v-else class="iconImg" src="@/assets/img/greenMore.png" alt="" @click="selectCompany()"> -->
        </div>
        <span class="industry companyDesc"  >{{info.industry}}</span>
        <span class="companyScale companyDesc" >{{info.companyScale}}</span>
        <span class="companyType companyDesc" >{{info.companyType}}</span>       
        <div class="line"></div>
        <span class="interviewJob">面试岗位：</span>
        <!-- <div style="display:inline-block"> -->
          <span class="job" v-for="(caseInfo,jobIndex) in info.caseInfoList" :key="jobIndex">
            <span class="circle"></span>
            {{caseInfo.caseName}}
          </span>
        <!-- </div> -->
        <div class="unselectedBts" v-if="!info.hasDelivered">
          <van-button  round type="info" block>投递申请</van-button>
        </div>
        <div class="selectedBts" v-else>
          <van-button  round type="info" block>已投递</van-button>
        </div>
      </div>
    </van-cell-group>   
  </div>
</template>

<script>
// import { Cell, CellGroup } from 'vant';
export default {
  name:'card',
  data() {
    return {
      detailList:['互联网','5000人以上','5000人以上'],
      jobList:['产品经理','开发经理','客户经理'],
      selected:false
    };
    
  },
  props:{
    info:{}
  },
  methods:{
    selectCompany(){
      this.selected = !this.selected
    }
  }
}
</script>

<style lang='less' scope>
.van-cell-group{
  border-radius: 8px;
  box-shadow: 0px 10px 20px 2px rgba(0, 0, 0, 0.03);
}
.companyInterviewDesc{
  padding:20px 20px 14px 20px;
  margin-bottom: 10px;
  // width: 295px;
  // height: 147px;
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
        margin-bottom: 5px;
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;

      }
      .topTime{
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #00CE8C;
      }
      .selectedTime{
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #9EA5BB;
      }

    }
    
  }
  .companyDesc{
    display: inline-block;
    padding:6px 6px;
    // margin-left: -5px;
    // margin-right: 5px;
    background: #F8FAFD;
    border-radius: 3px;
    font-size:12px;
    -webkit-transform:scale(0.84);
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #9EA5BB;
  }
  .industry{
    margin-left: -5px;
  }
  .companyScale{
    // margin-left: -5px;
  }
  .companyType{
    // margin-left: -5px;
  }
  .line{
    width: 295px;
    height: 1px;
    background: #E8E8F3;
    margin-top: 5px;
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
  }
  .job{
    // display: inline-block;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #5A6073;
    margin-right: 14px;
    
    .circle{
      display: inline-block;
      width: 5px;
      height: 5px;
      border-radius:5px ;
      background: #2953FF;
      // margin-left: 14px;
      margin-right: 5px;
      margin-bottom: 2px;
      line-height: 5px;
    }
  }

  .van-button{
    margin-top: 14px;
    width: 295px;
    height: 28px; 
    border-radius: 14px;
    // background-color: #2953FF;
    .van-button__text{
      width: 48px;
      height: 17px;
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: #FFFFFF;
      line-height: 17px;
    }
  }
  
  .unselectedBts{
     .van-button{
      background-color: #2953FF;
    }
    .van-button--info{
      // background-color: #9EA5BB;
      border: 1px solid #2953FF;
    }
  }
  .selectedBts{
   .van-button{
      background-color: #9EA5BB;
    }
    .van-button--info{
      // background-color: #9EA5BB;
      border: 1px solid #9EA5BB;
    }
  }

}

</style>