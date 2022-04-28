<template>
  <div class='emailInviteConfirm'>
    <div class="companyName">
      {{info.companyInfo?info.companyInfo.companyName:''}}
    </div>
    <div class="interviewPeriod">
      面试时段： {{info.interviewInfo.startTime}} ~{{info.interviewInfo.endTime}}
       </div>
    <div class="interviewer">
      尊敬的{{info.talentinfo.resumename}}同学：
    </div>
    <div class="emailContent">
      感谢您报名参加名企直面活动，您投递的公司：{{info.companyInfo.companyName}}，职位：{{info.talentinfo.casename}}简历已通过筛选，请确认是否接受面试邀约！
    </div>
    <div class="bts">
      <div class="rejectBtn" @click="showRejectDialog">拒绝</div>
      <div class="acceptBtn" @click="showAcceptDialog">接受</div>
    </div>
    <van-dialog 
      class="rejectDialog" 
      confirm-button-text="没空参加" 
      confirm-button-color='color: #576B95;'
      cancel-button-text="不感兴趣" 
      message="已拒绝面试邀请，方便告诉我们原因吗？" 
      show-cancel-button 
      v-model="isShowRejectDialog" 
      @confirm="uninterestedHandle" 
      @cancel="noTimeHandle"
      close-on-click-overlay
      v-cloak
    >
    </van-dialog>
   
    <div>
      <div v-if="this.hasTimeList">
        <van-dialog 
          class="acceptDialog" 
          title="请选择具体面试时间" 
          v-model="isShowAcceptDialog" 
          @confirm="acceptDialogHandle" 
          close-on-click-overlay
          v-cloak
        >
          <div class="selectTime">
               <span class='timeItem' :class="{timeItemAct:item.selectedTimeIndex==checkFlag, timeItemUnAct:item.selectedTimeIndex!=checkFlag}" v-for="(item,index) in timeList" :key="index" @click="selectInterviewTime(item,index)" ref="decChange">{{item.time}} </span>   
          </div>
          <div class="line"></div>
        </van-dialog>
      </div>
 
       <div v-else>
        <van-dialog 
          class="acceptNoRomeDialog"  
          message="很遗憾，面试已满，快去看看其他名企直面吧~" 
          v-model="isShowNoRoomDialog" 
          @confirm="noRoomDialogHandle" 
          close-on-click-overlay
          v-cloak
        >
        </van-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {jobTalentinterviewChange,upJobTalentinterview,geth5TalentInfo} from './api/emailInviteConfirm.js'
export default {
  name:'emailInviteConfirm',
  components: {
  },
  data() {
    return {
      isShowRejectDialog: false,//拒绝
      isShowAcceptDialog:false,//接受选择时间
      isShowNoRoomDialog:false,//接受但是没有面试间
      name:'阮杰',
      // timeList:[{time:'2022-03-23 21:00:00'.substring(10,16)+ '-' +'2022-03-23 21:00:00'.substring(10,16),selectedTimeIndex:1,value:{
      //                   startTime:'2022-03-23 21:00:00',
      //                   endTime:'2022-03-23 21:00:00'
      //               }},{time:'2022-03-23 21:00:00'.substring(10,16)+ '-' +'2022-03-23 21:00:00'.substring(10,16),selectedTimeIndex:2,value:{
      //                   startTime:'2022-03-23 21:00:00',
      //                   endTime:'2022-03-23 21:00:00'
      //               }},{time:'2022-03-23 21:00:00'.substring(10,16)+ '-' +'2022-03-23 21:00:00'.substring(10,16),selectedTimeIndex:3,value:{
      //                   startTime:'2022-03-23 21:00:00',
      //                   endTime:'2022-03-23 21:00:00'
      //               }},{time:'2022-03-23 21:00:00'.substring(10,16)+ '-' +'2022-03-23 21:00:00'.substring(10,16),selectedTimeIndex:4,value:{
      //                   startTime:'2022-03-23 21:00:00',
      //                   endTime:'2022-03-23 21:00:00'
      //               }}],
     timeList:[],
     hasTimeList:false,
      selected:false,
      info:{
        companyInfo:{
        companyName:'',
        },
        interviewInfo:{
          startTime:'',
          endTime:''
        },
        talentinfo:{
          resumename:''
        }
      },
      // TalentId:38,
      // interviewId:21,
      // checktoken:'fa679e7b84b2c6fc7ce1af167d20970c',
      TalentId:this.$route.query.TalentId,
      interviewId:this.$route.query.interviewId,
      checktoken:this.$route.query.checktoken,
      index:0,
      item:{},
      checkFlag:1
    }
  },
 
    methods: {
      showRejectDialog(){
        this.isShowRejectDialog = !this.isShowRejectDialog
      },
      showAcceptDialog(){
        this.isShowAcceptDialog = !this.isShowAcceptDialog
        this.isShowNoRoomDialog =!this.isShowNoRoomDialog
        this.handleJobTalentinterviewChange(1)
      },
      // 拒绝按钮，不感兴趣
      noTimeHandle(){
        console.log('不感兴趣');
        this.handleJobTalentinterviewChange(2,'不感兴趣')
      },
      // 拒绝按钮，没空参加
      uninterestedHandle(){
        console.log('没空参加');
        this.handleJobTalentinterviewChange(2,'没空参加')
      },
      acceptDialogHandle(){
        console.log('确认',this.item);
        if(this.index!=0){
           this.handleUpJobTalentinterview(this.item.value.startTime,this.item.value.endTime)
        }
      },
      // 选择时间
      selectInterviewTime(item,index){
        this.checkFlag=index+1;
        this.selected = !this.selected
        console.log("您选择的事件时",index); 
        this.index = index
        this.item = item
      
    },
    noRoomDialogHandle(){ 
      console.log("没有面试间");
    },
    //C端被邀请人邀请处理
    handleJobTalentinterviewChange(interviewtype,memo){
      console.log('jobTalentinterviewChange:')
        jobTalentinterviewChange({
          "interviewtype":interviewtype,
          "memo":memo,
          "checkToken": this.checktoken,
          "interviewId":Number(this.interviewId),
          "talentId": Number(this.TalentId) 
          }
        ).then((res) => {
              if (res.code == 0) {
                console.log('jobTalentinterviewChange:',res)
                if(res.data){
                  this.hasTimeList = true
                    res.data.forEach((item,index)=>{
                    this.timeList.push({
                      time:item.startTime.substring(10,16)+'-'+item.endTime.substring(10,16),
                      value:{
                          startTime:item.startTime,
                          endTime:item.endTime
                      },
                      selectedTimeIndex:index+1
                    }) 
                    console.log(this.timeList,' this.timeList');
                  })
                }else{
                   this.hasTimeList = false
                }
              
              }else {

              }
            })
            .catch((err) => {
              
            });
    },
    //C端被邀请人修改面试时间
     handleUpJobTalentinterview(startTime,endTime){
      console.log('upJobTalentinterview:')
        upJobTalentinterview({
          "endTime": endTime,
          "startTime": startTime,
          "checkToken": this.checktoken,
          "interviewId": Number(this.interviewId),
          "talentId": Number(this.TalentId) 
          }
        ).then((res) => {
              if (res.code == 0) {
                console.log('upJobTalentinterview:',res)
              } else {

              }
            })
            .catch((err) => {
              
            });
    },
    //C端被邀请人面试详情
     handleGeth5TalentInfo(){
      console.log('geth5TalentInfo:')
        geth5TalentInfo({
          "checktoken": this.checktoken,
          "interviewId": Number(this.interviewId),
          "talentId": Number(this.TalentId) 
          }
        ).then((res) => {
              if (res.code == 0) {
                console.log('geth5TalentInfo:',res)
                this.info = res.data
                this.info.interviewInfo.startTime=this.info.interviewInfo.startTime.substring(0,16).replace(/\-/g,'.')
                this.info.interviewInfo.endTime = this.info.interviewInfo.endTime.substring(10,16)
              } else {

              }
            })
            .catch((err) => {
              
            });
    },
    
  },
   mounted(){
    this.TalentId=this.$route.query.TalentId;
    this.interviewId=this.$route.query.interviewId;
    this.checktoken=this.$route.query.checktoken;
    this.handleGeth5TalentInfo()
  }
  
  

};
</script>

<style lang='less' scoped>
@media screen and (max-width:991px){
  .emailInviteConfirm{
    width: 100vw;
    height: 100vh;  
    background-image:  url(../../assets/img/emailInvite.png);
    background-size:100% 100%;
    background-repeat:no-repeat;
    background-color: #FFFFFF;
    position: relative;
    .companyName{
      margin-left: 20px;
      margin-right: 20px;
      font-size: 24px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #2953FF;
      padding-top: 103px;
      text-align: center;
    }
    .interviewPeriod{
      width: 295px;
      height: 32px;
      padding-left: 15px;
      padding-right: 15px;
      // padding: 7px 22px;
      background: #2953FF;
      border-radius: 16px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 32px;
      text-align: center;
      margin: 10px auto 0;
    }
    .interviewer{
      // width: 112px;
      height: 14px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #5A6073;
      line-height: 14px;
      margin-top: 61px ;
      margin-left: 46px;
    }
    .emailContent{
      width: 286px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #5A6073;
      line-height: 26px;
      margin:30px auto 0;
    }
    .bts{
      position: absolute;
      bottom: 162px;
      display: flex;
      width: 100vw;
      align-items: center;
      justify-content: center;
      .rejectBtn{
        width: 136px;
        height: 41px;
        background: #999999;
        border-radius: 28px;
        line-height: 41px;
        text-align: center;
        // margin-left: 46px;
        margin-right: 14px;
      }
      .acceptBtn{
        width: 136px;
        height: 41px;
        background: #FFFFFF;
        border-radius: 28px;
        line-height: 41px;
        text-align: center;
      }   
    } 
    .rejectDialog{
      
        /deep/.van-dialog__message{
            width: 269px;
            height: 48px;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.8);
            line-height: 24px;
            text-align: left;
        }
        /deep/.van-button__text{
          font-size: 17px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: bold;
          letter-spacing: 1px;
        }
        /deep/.van-button--default{
          color: #000000;
        }
        /deep/.van-dialog__confirm{
          color: #576B95;
        }
        
        // /deep/.van-button__text:first-child{
        //   color: #000000;
        // }
        // /deep/.van-button__text:last-child{
        //   color: #576B95;
        // }
    }
    .acceptDialog{
      /deep/.van-dialog__header{
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #191C27;
      }
      /deep/.van-dialog__confirm{
        font-size: 17px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #576B95;
        letter-spacing: 1px;
      }
      .selectTime{
        margin:8px 34px 24px;
          .timeItem{
            display: inline-block;
            border-radius: 2px;
            margin-top: 16px;
            line-height: 30px;
            text-align: center;
            padding:4px;
          }
          .timeItemAct{
            width: 108px;
            height: 28px;
            background: rgba(41, 83, 255, 0.06);
            border-radius: 2px;
            border: 1px solid #2953FF;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #2953FF;
          }
          .timeItemUnAct{
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #5A6073;
            width: 108px;
            height: 28px;
            opacity: 0.6;
            border: 1px solid rgba(90, 96, 115, 0.3);
          }
        .timeItem:nth-child(even){
          margin-left: 16px;
        }  
      }
      .line{
        width: 100%;
        height: 1px;
        background: rgba(0, 0, 0, 0.1);
      }
      
    }
    .acceptNoRomeDialog{
      /deep/.van-dialog__confirm{
        font-size: 17px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #576B95;
        letter-spacing: 1px;
      }
      /deep/.van-dialog__message{
        font-size: 17px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.8);
        text-align: left;
        line-height: 24px;
      }

    }

      
      
    
  }
}
@media screen and (min-width:992px){
.emailInviteConfirm{
    width: 100vw;
    height: 100vh;  
    background-image:  url(../../assets/img/emailInvitePC.png);
    background-size:100% 100%;
    background-repeat:no-repeat;
    background-color: #FFFFFF;
    position: relative;
    .companyName{
      margin-left: 20px;
      margin-right: 20px;
      font-size: 24px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #2953FF;
      padding-top: 103px;
      text-align: center;
    }
    .interviewPeriod{
      width: 295px;
      height: 32px;
      padding-left: 15px;
      padding-right: 15px;
      // padding: 7px 22px;
      background: #2953FF;
      border-radius: 16px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 32px;
      text-align: center;
      margin: 10px auto 0;
    }
    .interviewer{
      // width: 112px;
      height: 18px;
      font-size: 18px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #000000;
      line-height: 18px;
      margin-top: 61px ;
      margin-left: 50px;
    }
    .emailContent{
      // width: 614px;
      font-size: 18px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #000000;
      line-height: 26px;
      margin-left: 85px;
      margin-right: 50px;
      margin-top: 25px;
    }
    .bts{
      position: absolute;
      bottom: 40px;
      display: flex;
      width: 100vw;
      align-items: center;
      justify-content: center;
      .rejectBtn{
        width: 136px;
        height: 41px;
        background: #999999;
        border-radius: 28px;
        line-height: 41px;
        text-align: center;
        // margin-left: 231px;
        margin-right: 14px;
      }
      .acceptBtn{
        width: 136px;
        height: 41px;
        background: #FFFFFF;
        border-radius: 28px;
        line-height: 41px;
        text-align: center;
      }   
    } 
    .rejectDialog{
        /deep/.van-dialog__message{
            width: 269px;
            height: 48px;
            font-size: 17px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.8);
            line-height: 24px;
            text-align: left;
        }
        /deep/.van-button__text{
          font-size: 17px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: bold;
          letter-spacing: 1px;
        }
        /deep/.van-button--default{
          color: #000000;
        }
        /deep/.van-dialog__confirm{
          color: #576B95;
        }
        
        // /deep/.van-button__text:first-child{
        //   color: #000000;
        // }
        // /deep/.van-button__text:last-child{
        //   color: #576B95;
        // }
    }
    .acceptDialog{
      /deep/.van-dialog__header{
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #191C27;
      }
      /deep/.van-dialog__confirm{
        font-size: 17px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #576B95;
        letter-spacing: 1px;
      }
      .selectTime{
        margin:8px 34px 24px;
          .timeItem{
            display: inline-block;
            border-radius: 2px;
            margin-top: 16px;
            line-height: 30px;
            text-align: center;
            padding:4px;
          }
          .timeItemAct{
            width: 108px;
            height: 28px;
            background: rgba(41, 83, 255, 0.06);
            border-radius: 2px;
            border: 1px solid #2953FF;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #2953FF;
          }
          .timeItemUnAct{
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #5A6073;
            width: 108px;
            height: 28px;
            opacity: 0.6;
            border: 1px solid rgba(90, 96, 115, 0.3);
          }
        .timeItem:nth-child(even){
          margin-left: 16px;
        }  
      }
      .line{
        width: 100%;
        height: 1px;
        background: rgba(0, 0, 0, 0.1);
      }
      
    }
    .acceptNoRomeDialog{
      /deep/.van-dialog__confirm{
        font-size: 17px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #576B95;
        letter-spacing: 1px;
      }
      /deep/.van-dialog__message{
        font-size: 17px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.8);
        text-align: left;
        line-height: 24px;
      }

    }

      
      
    
  }
}


</style>
