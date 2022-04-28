<!-- 岗位卡片组件-->
<template>
<div>
  <div class='postCard' @click="showJobDetail(info.ehireJobId,info.ehireId)">
      <p class="item item1">
          <span class="job">{{info.caseName}}</span>
          <span class="salary">{{info.salaryDemand}}</span>
      </p>
      <p class="item item2" v-if="label.length>0">
          <span v-for="(item,index) in label" :key="index">{{item}}</span>
          <!-- <span>短发短</span> -->
      </p>
      <!-- <p class="item item3"> -->
          <!-- <span class="company">{{companyName}}</span> -->
          <!-- <span>1000-9999人</span> -->
      <!-- </p> -->
      <p class="item item4">
          <!-- <span class="source">外资（欧美）</span> -->
          <span class="address">{{info.jobArea}}</span>
      </p> 
  </div>
   <van-popup v-model="show" position="bottom" :style="{ height: '70%' }" close-on-click-overlay>
        <div class="jobContent" v-show='jobDetail'>
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
            <van-button  round type="primary" block  @click="handleApply1">投递申请</van-button>
        </div>
    </van-popup>
  <br>
  </div>
</template>

<script>
import { Toast } from 'vant';
import {getPositionInfoByEhireJobId,getPrd} from '../api/companyInterview.js'
export default {
  name:'postCard',
  data() {
    return {
        show:false,
        jobDetail:{},
        jobId:''
     
    }
  },
  props:{
      info:{
          default:{},
          type:Object
      },
      companyName:{
          default:'',
          type:String
      }
      // ctmId:{
      //     default:'',
      //     type:String
      // }
  },
    computed:{
        label(){
            if(this.info.jobKeyWord&&this.info.jobKeyWord.length){
                          return  this.info.jobKeyWord.split(' ');
            }else{
                return []
            }
        }
  },
  watch:{
       
  },
   methods:{
      showJobDetail(ehireJobId,ehireId){
       this.show = true
       this.jobId = ehireJobId
       this.ctmId = ehireId
       this.handleGetPositionInfoByEhireJobId(ehireJobId)
      //  console.log(id,"1111");
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
      async handleApply1(){
        // this.checkedItem
        console.log('this.checkedItem:',this.jobId)
         let res= await this._getPrd()
         if(res.data){ 
          // ctmid//会员id
          //   jobid//职位id
          //   prd,//投递来源--01-直面，02-双选会
          //   backurl:window.location.href,
          //   retjson:''//是否返回json数据

          //线上地址：
          let openUrl=`https://xym.51job.com/personal/personal_applyjob.aspx?ctmid=${this.ctmId}&jobid=${this.jobId}&prd=xyb_01&prp=&cd=&cp=&ruid=&backurl=${window.location.href}`
          // 开发测试地址
          // let openUrl=`http://sh-dev-176.51job.com/eHirePlusWebApp/htdocs/personal/personal_applyjob.aspx?ctmid=${this.ctmId}&jobid=${this.jobId}&prd=xyb_01&prp=&cd=&cp=&ruid=&backurl=${window.location.href}`
          console.log(openUrl)
          // window.location.href(openUrl)
          // window.location.href=openUrl
          window.location=openUrl
          }else{
           return
         }
     },
     _getPrd(){
      return  getPrd({
         accountid:localStorage.getItem('accountId')||'',
         caseid:this.info.jobId,
         sendtype:0,
         source:'01'
       })
     },
  }
};
</script>

<style lang='less' scoped>
    .postCard{
        height: 65px;
        padding: 15px 10px;
        background: #FFFFFF;
        box-shadow: -1px 2px 8px 4px #eee;
        border-radius: 4px;
        .item{
            margin:0;
            font-size: 15px;
            display: flex;
        }
        .item1{
            justify-content: space-between;
            margin-bottom: 11px;
            .job{
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191C27;
            }
            .salary{
                font-size: 14px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #2953FF;
            }
        }
        .item2{
            margin-bottom: 8px;
            margin-left: -3px;
            span{
                width: auto;
                height: 10px;
                background: rgba(41, 83, 255, 0.1);
                border-radius: 3px;
                font-size: 12px;
                transform:scale(0.875);
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #5A6073;
                padding:5px 10px;
                margin-right: 6px;
                line-height: 10px;
            }

        }

        // .item3{
        //     span{
        //         font-size: 12px;
        //         font-family: PingFangSC-Regular, PingFang SC;
        //         font-weight: 400;
        //         color: #5A6073;
        //     }
        //     .company{
        //         margin-right: 19px;
        //     }

        // }
        .item4{
            margin-top: 8px;
            justify-content: space-between;
            .source{
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #5A6073;
            }
            .address{
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #9EA5BB;
            }

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
        // display: flex;
        // align-items: center;
        // justify-content: center;
        }
        span{
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
</style>
