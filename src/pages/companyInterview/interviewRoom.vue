<template>
  <div class='interviewRoom'>
    <van-sticky>
       <img class="topBanner" v-if="coverUrl" :src="coverUrl " alt="">
        <img class="topBanner" v-else src= '@/assets/img/interviewImg.jpg'  alt="">
        <div class="roomTitle">
            <div class="title">{{companyName+'2022名企直面'}}</div>
            <div class="interviewTime">面试时间：{{interviewTime}}</div>
            <div class="interviewer">
                <div class="item" v-if="interviewerList.length>0">
                    <img v-if="interviewerList[0].avatar" :src='interviewerList[0].avatar' alt="">
                    <img v-else src='../../assets/img/interviewerImg.png' alt="">
                    <!-- <img :src='mainAvatar' alt=""> -->
                    <div>
                      <div class="name">{{interviewerList[0].interviewerName}}</div>
                      <div class="faceDirectly">主面</div>
                    </div>                 
                </div>
                <div class="item" v-if="interviewerList.length>1">
                  <!-- <img v-bind:src='mainAvatar2'  alt=""> -->
                  <img v-if="interviewerList[1].avatar" :src='interviewerList[1].avatar'  alt="">
                  <img v-else src='../../assets/img/interviewerImg.png' alt="">
                    <div>
                      <div class="name">{{interviewerList[1].interviewerName}}</div>
                    </div> 
                </div>
            </div>
        </div>
        <div v-if="caseInfoList.length>0" style="padding:0 20px 15px" class="jobInterview">面试岗位</div>
    </van-sticky>
    <div style="padding:0 20px 0">     
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
        <div style="margin-bottom:70px">
           <div class="postItem"  v-for='(item,index) in caseInfoList' :key='index' :class="{isSecleted:checkedFlag==index+1, unSelected:checkedFlag!=index+1}">
              <div class="item">
                <div class="itemTop">
                  <div >
                    <div style="display:flex;align-items: flex-end;">
                        <div class="itemName">{{item.caseName}}</div>
                        <div class="itemDesc" @click="openDetail(item,index)">查看详情</div>
                      </div>             
                      <span class="itemAddress">{{item.jobArea+' · '+item.expRequirement+' · '+item.salaryDemand}}</span>
                    </div>
                  <img v-if="checkedFlag==index+1" src="@/assets/img/selected.png" alt="" @click="checkedFlag=''">
                  <img v-else  src="@/assets/img/select.png" alt="" @click="checkedFlag='';checkedFlag=index+1;checkedItem=item">
                </div> 
                <div class="itemLine"></div>
              </div>
              </div>
        </div>
      
        

     </van-list>
    </div>
     <div class="bottomBtn">
         <van-button  round type="primary" block  @click="handleApply">投递申请</van-button>
     </div>
     <van-popup v-model="show" position="bottom" :style="{ height: '70%' }">
       <div class="jobContent">
         <div class="j_detail">
           <span class="job">{{jobDetail.caseName}}</span>
           <span class="salary">{{jobDetail.salaryDemand}}</span>
         </div>
         <div class="interviewerDesc">
           <!-- <van-icon name="location-o" style="width:12px;height:12px"/> -->
           <img src="@/assets/img/place.png" alt="">
           <span>{{jobDetail.jobArea}}</span>
           <!-- <van-icon name="bag-o"  style="width:12px;height:12px"/> -->
           <img src="@/assets/img/bag.png" alt="">
           <span>{{jobDetail.expRequirement}}</span>
           <!-- <van-icon name="clock-o" style="width:12px;height:12px;margin-right:2px"/> -->
           <img src="@/assets/img/time.png" alt="">
           <span>{{jobDetail.ehireUpdateTime+'更新'}}</span>
         </div>
         
       </div>
       <div class="jobTitle">
         职位描述：
       </div>
       <div v-html="jobDetail.positionDesc" class="jobDesc">
          
       </div>
       <!-- <div class="jobDemand">
         职位要求：
       </div>
       <div class="demandDesc">
          1、本科及以上学历，3年以上互联网产品经验，有搜索、推荐、排序等策略相关的工作经验优先；
          2、有良好的自驱动能力，以目标为导向，抗压且责任心强，拥有良好的团队合作精神；
          3、 有较强的逻辑思维能力和数据分析能力，注重过程和结果，关注细节，对数据敏感，善于发现和挖掘数据价值。
       </div> -->
       <div class="bottomBtn">
          <van-button  round type="primary" block  @click="handleApply">投递申请</van-button>
       </div>
    </van-popup>

  </div>
</template>

<script>
import { Toast } from 'vant';
import {selectInterviewRoomDetailForC,getPositionInfoByEhireJobId,getPrd} from './api/companyInterview.js'

export default {
  name:'interviewRoom',
  components:{},
  data() {
    return {
        jobDetail:{},
         finished:false,
        loading:false,
        list:[{},{}],
        show: false,
        isSeleted:false,
        caseInfoList:[],
        interviewTime:'',
        interviewerList:[],
        companyName:'',
        lastItem:{},
        checkedItem:{},
        checkedFlag:'',
        total:0,
        coverUrl:''
    };
  },
  computed:{
    mainAvatar(){
      if(this.interviewerList.length>0&&this.interviewerList[0].avatar){
        return this.interviewerList[0].avatar
      }else{
          return "../../assets/img/interviewerImg.png"
      }
    },
    mainAvatar2(){
      if(this.interviewerList.length>1&&this.interviewerList[1].avatar){
        return this.interviewerList[1].avatar
      }else{
          return "../../assets/img/interviewerImg.png"
      }
    }
  },
   methods:{
      //面试间详情
      async handleSelectInterviewRoomDetailForC(roomId){
        console.log('selectInterviewRoomDetailForC:')
         await selectInterviewRoomDetailForC(
           {interviewRoomId:roomId}
          ).then((res) => {
                if (res.code == 0) {
                  console.log('selectInterviewRoomDetailForC:',res.data.interviewerList)
                  this.caseInfoList=res.data.caseInfoList;
                  this.caseInfoList&&this.caseInfoList.forEach(_=> {
                    this.$set(_,'checked',false)
                  });
                  // this.caseInfoList=this.caseInfoList.concat(this.caseInfoList)
                  this.interviewTime=res.data.date+" "+res.data.startTime+'~'+res.data.endTime;
                  this.companyName=res.data.companyName;
                  this.coverUrl=res.data.coverUrl;
                  this.interviewerList=res.data.interviewerList;
                  this.ctmId=res.data.ehireId
                  this.total=this.caseInfoList.length
                } else {

                }
              })
              .catch((err) => {
                
              });
               // 加载状态结束
              this.loading = false;

      },
       //根据ehireJobId获取职位信息
      handleGetPositionInfoByEhireJobId(ehireJobId){
        console.log('getPositionInfoByEhireJobId:')
          getPositionInfoByEhireJobId(
            {
              "ehireJobId":ehireJobId
            }
          ).then((res) => {
                if (res.code == 0) {
                  console.log('getPositionInfoByEhireJobId:',res)
                  this.jobDetail=res.data
                  this.jobDetail.ehireUpdateTime=this.jobDetail.ehireUpdateTime.substring(0,10)
                } else {

                }
              })
              .catch((err) => {
                
              });
      },
      //查看详情
     openDetail(item,index){
       this.checkedFlag=index+1;
       this.checkedItem=item;
       this.show = true;
       this.handleGetPositionInfoByEhireJobId(item.ehireJobId)  
     },
  
    async handleApply(){
        // this.checkedItem
        console.log('this.checkedItem:',this.checkedItem)
        if(this.checkedFlag){
          
         let res= await this._getPrd()
         if(res.data){       
          // ctmid//会员id
          //   jobid//职位id
          //   prd,//投递来源--01-直面，02-双选会
          //   backurl:window.location.href,
          //   retjson:''//是否返回json数据
          let url=encodeURI(window.location.href)
         
        //  线上地址：
         let openUrl=`https://xym.51job.com/personal/personal_applyjob.aspx?ctmid=${this.ctmId}&jobid=${this.checkedItem.ehireJobId}&prd=xyb_01&prp=&cd=&cp=&ruid=&backurl=${url}`
        //  开发测试地址：
        //  let openUrl=`http://sh-dev-176.51job.com/eHirePlusWebApp/htdocs/personal/personal_applyjob.aspx?ctmid=${this.ctmId}&jobid=${this.checkedItem.ehireJobId}&prd=xyb_01&prp=&cd=&cp=&ruid=&backurl=${window.location.href}`
         console.log(openUrl,'window.location')
        //  console.log(openUrl,'openUrl')
          // window.location.href(openUrl)
          // window.location.href=openUrl
         window.location=openUrl
         }else{
           return
         }
        }else{
          Toast.fail('请选择职位投递')
        }
        

     },
     _getPrd(){
      return  getPrd({
         accountid:localStorage.getItem('accountId')||'',
         caseid:this.checkedItem.jobId,
         interviewId:this.$route.query.roomId,
         sendtype:1,
         source:'01'
       })
     },
     onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
      
       
        // 数据全部加载完成
        if (this.caseInfoList.length >= this.total) {
          this.finished = true;
        }
      }, 1000);
    }
   
  },
  beforeCreate () {
        document.querySelector('body').setAttribute('style', 'background-color:#F8FAFD')
    },
  mounted(){
    console.log(this.$route.query)
    this.handleSelectInterviewRoomDetailForC(this.$route.query.roomId);
  }
};
</script>

<style lang='less' scoped>
.interviewRoom{
  background: #F8FAFD;
    .topBanner{
    width: 375px;
    height: 185px;
    background: rgb(142, 235, 230);
    // position: fixed;
    // top:0;
    }
    .roomTitle{
      // position: fixed;
      // top:185px;
      padding: 20px 20px 15px;
      background: #F8FAFD;
        .title{
            font-size: 20px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: bold;
            color: #000000;
            letter-spacing: 1px;
        }
        .interviewTime{
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
            margin:8px 0 20px;
        }
    }
    .jobInterview{
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: #191C27;
      background: #F8FAFD;
      // margin-bottom: 15px;
    }   
    .interviewer{
        display: flex;
        justify-content: flex-start;
        .item{
            width: 126px;
            height: 60px;
            margin-right:10px;
            background: #FFFFFF;
            box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.09);
            border-radius: 2px;
            border: 1px solid rgba(232, 235, 243, 0.6);
            display: flex;
            align-items: center;
            img{
              width: 36px;
              height: 36px;
              margin-left: 16px;
              margin-right: 10px;
            }
            .name{
              font-size: 14px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: bold;
              color: rgba(25, 28, 39, 0.85);
              display: -webkit-box;
              overflow: hidden;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
            }
            .faceDirectly{
              width: 39px;
              height: 18px;
              background: rgba(41, 83, 255, 0.1);
              border-radius: 2px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #2953FF;
              line-height: 18px;
              text-align: center;
              margin-top: 3px;
            }
        }
    }
    .isSecleted{
      background: rgba(39, 83, 255, 0.1);
      // opacity: 0.1;
      .itemName,.itemAddress{
        font-weight: bold;
      }
    }
    .unSelected{
      background: #FFFFFF;
      .itemName,.itemAddress{
        font-weight: 400;
      }
    }
    .postItem{     
        width: 335px;
        height: auto;
        border-radius: 3px;
        .item{
          padding:22px 15px 0;
          .itemTop{
            display: flex;
            align-items: center;
            justify-content: space-between;
            img{
              width: 16px;
              height: 16px;
            }
            .itemName{
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              // font-weight: 400;
              color: #191C27;
            }
            .itemDesc{
              // width:120%;
              font-size:12px;
              /* 利用放大缩小属性 */
              -webkit-transform: scale(0.83);
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #2953FF;
            }
            .itemAddress{
              display: inline-block;
              font-size: 12px;
              font-family: PingFangSC-Medium, PingFang SC;
              // font-weight: 400;
              color: #5A6073;
              margin-top: 6px;
            }

          }
          .itemLine{
            width: 305px;
            height: 1px;
            background: #E8E8F3;
            margin-top: 22px;
          }
        }
    }
    .postItemSelected{
      width: 335px;
      height: 75px;
      background:rgba(39, 83, 255, 0.1);
        .item{
          padding:12px 15px 0;
          .itemTop{
            display: flex;
            align-items: center;
            justify-content: space-between;
            img{
              width: 16px;
              height: 16px;
            }
            .itemName{
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: bold;
              color: #191C27;
            }
            .itemDesc{
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #2953FF;
            }
            .itemAddress{
              display: inline-block;
              font-size: 12px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: bold;
              color: #5A6073;
              margin-top: 6px;
            }
          }  
          .itemLine{
            width: 305px;
            height: 1px;
            background: #E8E8F3;
            margin-top: 15px;
            // margin-b0ttom: 9px;
            margin-bottom: 9px;
          }
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
    .jobContent{
      margin:24px 20px 20px;
      padding:20px 14px;
      background: #FFFFFF;
      box-shadow: 0px 12px 20px 0px rgba(0, 0, 0, 0.03);
      border-radius: 2px;
      .j_detail{
       display: flex;
       justify-content: space-between;
        .job{
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #000000;
        }
        .salary{
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: bold;
          color: #2753FF;
        }

      }
      .interviewerDesc{
        margin-top:15px; 
        display: flex;
        // justify-content: center;
        align-items: center;
        img{
          margin-right: 4px;
        }
        span{
          // margin-left: 4px;
          display: inline-block;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.6);
          // color: rgba(0, 0, 0, 0.03);
          margin-right: 18px;          
        }
      }     
    }
    .jobTitle,.jobDemand{
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: #191C27;
      margin-top: 20px;
      margin-left: 35px;
    }
    .jobDesc,.demandDesc{
      // width: 305px;
      height: auto;
      font-size: 12px;
      // transform:scale(0.875);
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #5A6073;
      line-height: 18px;
      margin:10px 35px 0 35px;
      line-height: 18px;
    }
    .demandDesc{
      margin-bottom: 20px;
    }
}
    

</style>
