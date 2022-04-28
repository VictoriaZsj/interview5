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
      恭喜您成功报名参加双选会直面，面试岗位：<span>{{info.talentinfo.casename}}</span>，请准时参加。
    </div>
    <div class="bts">
       <div class="acceptBtn" @click="showAcceptDialog">确认</div>
    </div>

    <!-- <div v-if="noRoom">
       <van-dialog 
        class="acceptNoRomeDialog"  
        message="双选会直面报名已满，谢谢参加~" 
        confirm-button-text="好的，谢谢" 
        v-model="isShowNoRoomDialog" 
        @confirm="noRoomDialogHandle" 
        v-cloak
      >
      </van-dialog>
    </div>  -->
  </div>

</template>

<script>
import {geth5TalentInfo} from './api/mutualChoiceInterview.js'
export default {
  name:'mutual_messageInterview',
  components: {
  },
  data() {
    return {
      isShowNoRoomDialog:false,//接受但是没有面试间
      name:'阮杰',
      // noRoom:true,
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
      TalentId:this.$route.query.TalentId||0,
      interviewId:this.$route.query.interviewId||0,
      checktoken:this.$route.query.checktoken||'',

    };
  },
  mounted(){
    this.TalentId=this.$route.query.TalentId;
    this.interviewId=this.$route.query.interviewId;
    this.checktoken=this.$route.query.checktoken;
    this.handleGeth5TalentInfo()
  },
    methods: {
    showAcceptDialog(){
      this.isShowNoRoomDialog =!this.isShowNoRoomDialog
    },
    // noRoomDialogHandle(){ 
    //   console.log("没有面试间");
    // }   
        //C端被邀请人面试详情
     handleGeth5TalentInfo(){
      console.log('geth5TalentInfo:')
        geth5TalentInfo({
            "checktoken": this.checktoken,
            "interviewId":Number(this.interviewId),
            "talentId":Number(this.TalentId) 
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
      bottom: 167px;
      display: flex;
      width: 100vw;
      align-items: center;
      justify-content: center;
      .acceptBtn{
        // position: absolute;
        // bottom:167px;
        // left: 36px;
        width: 295px;  
        height: 41px;
        background: #FFFFFF;
        border-radius: 28px;
        line-height: 41px;
        text-align: center;
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
        font-weight: bold;
        color: #000000;
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
      // width: 286px;
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
      .acceptBtn{
        // position: absolute;
        // bottom: 40px;
        // left: 490px;
        width: 295px;  
        height: 41px;
        background: #fff;
        border-radius: 28px;
        line-height: 41px;
        text-align: center;
        // margin: 10px auto 0;/
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
        font-weight: bold;
        color: #000000;
        text-align: left;
        line-height: 24px;
      }

    }

      
      
    
  }
}

</style>
