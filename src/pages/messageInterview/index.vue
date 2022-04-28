 <!--  -->
<template>
  <div class='messageInterview'>
 
    <!-- <div class="headNav">
        <van-icon name="arrow-left" class="iconLeft" @click="handleGoback"/>
        <span>名企直面</span>
      </div> -->
    <div class="topSearchBtn">
       <van-tabs @click="tabClick" v-model="tabStatus">
          <van-tab v-for="(item) in  statusList" :title="item.value" :key='item.code' :name="item.code"  >
          </van-tab>
      </van-tabs>
    </div>
    <!-- 消息组 -->
   <div class="refreshContent"> 
     <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功">   
        <div class="message_Box" v-for='(item,index) in messageList' :key='index'>
          <!-- 消息提示 -->
          <div class="tip"  v-if="item.flowstatus=='01'">
            <img src="@/assets/img/company.png" alt="" class="img">
            <div class="text">
                你有一封面试邀请函，请尽快确认哦～
            </div>   
          </div>
          <div class="tip" v-if="item.flowstatus=='96'">
            <img src="@/assets/img/company.png" alt="" class="img">
            <div class="text" >
                面试已开始，快进入面试间吧～
            </div>
          </div>
          
            <!-- 岗位状态 -->
          <div class="card">
            <div class="detail">   
                  <img v-if="item.companyInfo.companylogo" v-bind:src="item.companyInfo.companylogo" alt="" class="img">
                  <img v-else src="@/assets/img/companyLogo.png" alt="" class="img">
                <div class="interviewDesc">
                  <div style="display: flex;justify-content: space-between;">
                     <div class="companyName">{{item.companyInfo.companyname}}</div>
                     <div class="result" :class="{result1:item.flowstatus=='01', result2:item.flowstatus=='96',result3:item.flowstatus=='97'}">{{item.flowstatus|filterFlowstatus}}</div>
                     <!-- <div class="result1 result">待处理</div> -->
                     <!-- <div class="result2 result">{{item.flowstatus|filterFlowstatus}}</div> -->
                     <!-- <div class="result3 result">已结束</div> -->
                  </div>
                  <div class="interviewTime">面试时间：{{item.viewInfo.viewdate}}</div>
                  <div class="advantage">
                    <!-- <span>10年经验</span>
                    <span>BAT员工</span> -->
                  </div>
              </div>
            </div>
            <div class="post"> 
              <span class="jobInterview">面试岗位</span>
              <span class="jobName">{{item.casename}}</span>
            </div>
            <div v-if="item.flowstatus=='01'" class="status status1" >
              <div class="reject" @click="handleAcceptOrRefuse(0,item)">拒绝邀约</div>
              <div class="accept" @click="handleAcceptOrRefuse(1,item)">接受面试</div>
            </div>
            <div v-if="item.flowstatus=='96'" class="status status2" @click="gotoRoom(item.viewInfo)">
              <span>前往面试间</span>
            </div>
            <div v-if="item.flowstatus==='97'" class="status status3">
              <span>已接受</span>
            </div>
            <div v-if="item.flowstatus=='06'" class="status status3">
              <span>已拒绝</span>
            </div>
            <div v-if="item.flowstatus=='04'" class="status status3">
              <span>面试间已满</span>
            </div> 
          </div>
          <!-- 确定时间  -->
          <div class="confirmTime"  v-if="timeList.length&&item.hasAccept">
            <img src="@/assets/img/company.png" alt="" class="img">
            <div class="time">
              <div class="selectTimeTxt">已接受面试，请选择具体面试时间。</div> 
              <div class="selectTime">
                    <span class='timeItem' :class="{timeItemAct:i.selectedTimeIndex==checkFlag, timeItemUnAct:i.selectedTimeIndex!=checkFlag,hasTimeItem:i.selectedTimeIndex!=checkFlag&&item.hasTime}" v-for="(i,index) in timeList" :key="index" @click="selectInterviewTime(item,index)" ref="decChange">{{i.startTimeStr+'-'+i.endTimeStr}} </span>   
              </div>
              <van-button type="primary" block size="small" v-if="!item.hasTime" @click="handleUpJobTalentinterview(item)">确定</van-button>
              <van-button type="primary" block size="small" disabled v-else>已接受</van-button>
            </div>
          </div>
        </div>
     </van-pull-refresh>
    </div >
  </div>
  
</template>

<script>
import { Toast } from 'vant';
import {getinterviewList,upJobTalentinterview,jobTalentinterviewChange} from './api/messageInterview.js'
export default {
  name:'messageInterview',
  data() {
    return {
      tabStatus:'',//状态
      isLoading:false,
      timeList:[],
      selected:false,
      statusList:[
          {
            value:'全部',
            code:''
          },
          {
            value:'待处理',
            code:'01'
          },
          {
            value:'未开始',
            code:'97'
          },
          {
            value:'进行中',
            code:'96'
          },
          {
            value:'已拒绝',
            code:'06'
          },
          {
            value:'已结束',
            code:'98'
          }
        ],
      messageList:[],
      checkFlag:1
    };
  },
  filters:{
    //01-已邀约    04-已冲突   96-面试中  97- 待面试  98--面试时间已过
    filterFlowstatus(val){
      switch(val){
        case "01":
          return '待处理';
        case "04":
          return '已失效';
        case "06":
          return '已拒绝';
        case "96":
          return '进行中';
        case "97":
          return '未开始';
        case "98":
          return '已结束';        
      }
    }
  },
  methods:{
    gotoRoom(info){
      window.location=`xiaoyuan://home/openCloudInterviewRoomPage?interviewRoomId=${info.interviewid}&isInviteCode=${info.authorizecode?info.authorizecode:''}`
    },
    handleGoback(){
          window.location = 'xiaoyuan://home/exitCurrentPage'

    },
    tabClick (){
     console.log('88:',this.tabStatus) 
     this.handleGetinterviewList()
    },
        //获取邀约信息列表
    handleGetinterviewList(){
      // console.log('zhhhshdbbsdb:')
        getinterviewList({
          // "accountid": localStorage.getItem('accountId')||'51920261',
          "accountid": localStorage.getItem('accountId')||'',
          "currentPage": 1,
          "pageSize": 10,
          "status":this.tabStatus
        }).then((res) => {
              if (res.code == 0) {
                this.messageList=res.data.list
                this.messageList.forEach(i=>{
                  if(i.flowstatus=='01'){
                    this.$set(i,'hasAccept',false);
                    this.$set(i,'hasTime',false)
                  }
                })
              } else {

              }
            })
            .catch((err) => {
              
            });
    },
       //被邀约人修改面试时间
    handleUpJobTalentinterview(item){
      // console.log('zhhhshdbbsdb:',item)
      let checkedItem=this.timeList[this.checkFlag-1]
        upJobTalentinterview({
          "checkToken": item.checkToken,
          "endTime": checkedItem.endTime,
          "interviewId": item.viewInfo.interviewid,
          "startTime": checkedItem.startTime,
          "talentId": item.viewInfo.talentid
        }).then((res) => {
              if (res.code == 0) {
                item.hasTime=true
                Toast.success('修改成功')
               
              } else {

              }
            })
            .catch((err) => {
              
            });
    },
    handleAcceptOrRefuse(type,item){
      //被邀约人邀约
      jobTalentinterviewChange({
            "checkToken": item.checkToken,
            "interviewId":item.viewInfo.interviewid,
            "interviewtype": type,//0-拒绝，1-接受
            "memo": "",
            "talentId": item.viewInfo.talentid
          }).then((res) => {
                if (res.code == 0) {
                  console.log('接受或拒绝:',res)
                  if(type==1){
                    item.flowstatus='97';
                    if(res.data&&res.data.length>0){
                      this.timeList=res.data;
                      item.hasAccept=true;
                        this.timeList.forEach((i,index)=>{
                          this.$set(i,'selectedTimeIndex','')
                          this.$set(i,'endTimeStr','')
                          this.$set(i,'startTimeStr','')
                          i.startTimeStr=i.startTime.split(' ')[1].slice(0,5)
                          i.endTimeStr=i.endTime.split(' ')[1].slice(0,5)
                          i.selectedTimeIndex=index+1
                      })
                    }
                  }else if(type==0){
                    item.flowstatus='06';
                  }
                  
                } else {

                }
              })
              .catch((err) => {
                
              });
      },
    
    onRefresh() {
      setTimeout(() => {
        this.isLoading = false;
      }, 1000); 
    },
    selectInterviewTime(item,index){
     if(!item.hasTime){
       this.checkFlag=index+1;
     }
      
    },

 
    
  },
 beforeCreate () {
        document.querySelector('body').setAttribute('style', 'background-color: #F7F7F7;')
 },
  mounted(){
      this.handleGetinterviewList()
  }
};
</script>

<style lang='less' scoped>
.messageInterview{
    // padding-top: 24px;
    position: relative;
    background: #F7F7F7;
    .headNav{
      width: 358px;
      height: 20px;
      background: #ffffff;
      padding:54px 0 9px 17px;
      .iconLeft{
        width: 7px;
        height: 14px;
        // margin-top: 61px;
        // margin-left: 32px;
        margin-right: 127px;
        color: rgba(0, 0, 0, 0.9);
      }
      span{
        font-size: 17px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 17px;
        color: #000000;
      }
    } 
    .topSearchBtn{
      margin:12px 0 0 14px;
      /deep/.van-tabs--line .van-tabs__wrap{
        height: 26px;
      }
   
      /deep/.van-tabs__line{
        display: none;
      }
      /deep/.van-tab{
        // width: 55px;
        height: 26px;
        border-radius: 15px;
        // border: 1px solid #5A6073;
        background: #FFFFFF;
        margin-right: 10px;
        color: #5A6073;
      }
      /deep/.van-tab__text{
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
     }
      /deep/.van-tabs__nav{
        background-color: transparent;
      }
      /deep/.van-tabs__nav--line.van-tabs__nav--complete{
        padding-left:0 ;
        padding-bottom:0 ;
      }
      /deep/.van-tab--active{   
        background: #2953FF;
        border: 1px solid #2953FF;
        color: #FFFFFF;
      }
    }
 
  .refreshContent{
    padding-bottom: 100px;
    padding-top: 24px;
    .message_Box{
      padding: 0 16px 24px 15px;
      .tip{
          // background:#fff;
          height:68px;
          display: flex;
          .img{
            display: inline-block;
            width: 45px;
            height: 45px;
          }
          .text{
            margin-left: 10px;
            width: 209px;
            height: 68px;
            background: #FFFFFF;
            border-radius: 6px;
            padding-left: 19px;
            padding-right: 11px;
            display: flex;
            align-items: center;
          }
        }
        .card{
          width: 344px;
          height: auto;
          background: #FFFFFF;
          box-shadow: 0px 7px 14px 0px rgba(0, 0, 0, 0.06);
          border-radius: 8px;
          margin:24px 0;
            
            .detail{
              display: flex;
              border-bottom: 1px solid #d9d5d5;
              align-items: center;
              padding:24px 19px 12px 20px;
              .img{
                display: inline-block;
                width: 62px;
                height: 62px;
                margin-right: 20px;
              }
            }
            .interviewDesc{
              flex:1;
              .companyName{
                font-size: 16px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: bold;
                color: #191C27;
                display: -webkit-box;
                overflow: hidden;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                flex:1;
              }
              .result{
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                margin-top:3px;
                width: 50px;
                margin-left: 5px;
              }
              .result1{
                color: #2953FF; 
              }
              .result2{
                color: #00CE8C;
              }
              .result3{
                color: rgba(158, 165, 187, 1);
              }
              .interviewTime{
                // display: inline-block;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #5A6073;
                margin-top: 6px;
              }
              .advantage{
                // margin-top: 8px;
                span{
                  display: inline-block;
                  padding:5px 13px;
                  background: #F8FAFD;
                  border-radius: 3px;
                  font-size: 12px;
                  -webkit-transform:scale(0.84);
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #5A6073;
                  margin-right: 9px;
                  margin-top: 6px;
                  margin-left: -5px;

                }
              }

            }
            .post{
              display: flex;
              padding: 12px 20px;
              justify-content: space-between;
              .jobInterview{
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #9EA5BB;
              }
              .jobName{
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #5A6073;
              }
            }
            .status{
              width: 344px;
              height: 52px;

            }
            .status1{
              display: flex;
              .reject,.accept{
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: #FFFFFF;
                height: 52px;
                display: flex;
                justify-content: center;
                align-items: center;                  
              }
              .reject{
                border-radius: 0px 0px 0px 8px;
                width: 176px;
                background: #9EA5BB;  
                font-weight: 400;   
              }
              .accept{
                border-radius: 0px 0px 8px 0px;
                width: 168px;
                background: #2953FF;
                font-weight: 600;
              }
              
            }
            .status2,.status3{
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 0px 0px 8px 8px;
              font-size: 16px;
              font-family: PingFangSC-Semibold, PingFang SC;
              color: #FFFFFF;
            }
            .status2{
              background: #00CE8C;
              font-weight: 600;
            }
            .status3{
              background: #9EA5BB;
              font-weight: 400;
            }
               
          
        }
    
        .confirmTime{
          // background:#fff;
          display: flex;
          .img{
              display: inline-block;
              width: 45px;
              height: 45px;
            }
          
          .time{
            margin-left: 10px;
            width: 288px;
            // height: 196px;
            background: #FFFFFF;
            border-radius: 6px;
            .selectTimeTxt{
              width: 224px;
              height: 23px;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #000000;
              line-height: 23px;
              margin-top: 15px;
              margin-left: 20px;
            }
            .selectTime{
              margin:0 30px 28px 20px;
              // .selectTimeitem{
              //   display: inline-block;
                .timeItem{
                  display: inline-block;
                  border-radius: 2px;
                  margin-top: 16px;
                  line-height: 30px;
                  text-align: center;
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
                .hasTimeItem{
                  background: #9EA5BB;
                  font-size: 14px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: bold;
                  color:#fff;
                  width: 108px;
                  height: 28px;
                }
              // }
              // .selectTimeitem:nth-child(even){
              //   margin-left: 16px;
              // }  
              .timeItem:nth-child(even){
                margin-left: 16px;
              }  
            }
            .van-button--primary{
              width: 290px;
              height: 38px;
              background: #2953FF;
              border-radius: 0px 0px 8px 8px;
              border: 1px solid #2953FF
            }
            .van-button__text{
              font-size: 16px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #FFFFFF; 
            }
          }
        }
    }
   }
   
}
</style>
