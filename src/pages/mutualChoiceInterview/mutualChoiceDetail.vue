
<template>
  <div class='mutualChoiceDetail'>
    <!-- <van-sticky> -->
       <!-- <div class="headNav">
        <van-icon name="arrow-left" class="iconLeft"  @click='handleRoute'/>
        <span>公司详情</span>
      </div> -->
      <div style="background: #FEFEFF;padding: 6px 20px;">
        <div class="topDetail">
          <div class="title">
              <img class="left" v-if="companyInfo.companyLogo" :src="companyInfo.companyLogo" />
               <img class="left" v-else  src="@/assets/img/companyLogo.png" alt="">
              <div class="right">
                  <div class="companyName">{{companyInfo.companyName}}</div>
                  <div class="companyDesc">{{companyInfo.industryTag+'· '}}{{companyInfo.companyScale+' · '}}{{companyInfo.companyType}}</div>
                  <!-- <div class="companyDesc">{{companyInfo.companyType}}</div> -->
              </div>
          </div>
          <div class="time" v-if="companyInfo.interviewDate">面试时段： {{companyInfo.interviewDate}}</div>
          <div class="detail"  v-if="introductoryVal">
            <div :class="['content', expande ? 'expande' : 'close']" ref="content">
                <!-- 深圳市腾讯计算机系统有限公司成立于1998年11月，由马化腾、张志东、许晨晔、陈一丹、曾李青五位创始人共同创立。 腾讯多元化的服务包括：社交和通信服务QQ及微信/WeChat深圳市腾讯计算机系统有限公司成立于1998年11月，由马化腾、张志东、许晨晔、陈一丹、曾李青五位创始人共同创立。 腾讯多元化的服务包括：社交和通信服务QQ及微信/WeChat…深圳市腾讯计算机系统有限公司成立于1998年11月，由马化 -->
                {{introductoryVal}}
            </div>
            <div
                class="expande-button-wrap"
                v-if="needShowExpande"
            >
                <div class="expande-button" @click="expandeClick" v-if="!expande">
                    <div class="expandeBts">展开<van-icon name="arrow-down" style="margin-left:4px"/></div> 
                </div>
                <div class="expande-button" @click="expandeClick" v-else>
                    <div class="closeBts">收起<van-icon name="arrow-up" style="margin-left:4px"/></div> 
                </div>
            </div>
          </div>
        </div>
    

      <div class="contentTitle">名企直面</div>
      <swipe ></swipe>
      <div class="middleTitle">热招职位</div>

      </div>
 
    <!-- </van-sticky>   -->
        <div style="margin: 6px 20px;">
          <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
              >
            <postCard v-for='(item,index) in caseInfoList' :info='item' :key='index' ></postCard>

          </van-list>
        </div>

    </div>
   
</template>

<script>
import {getCompanyInfo} from './api/mutualChoiceInterview.js'
import swipe from './component/swipe.vue'
import postCard from './component/postCard.vue'
export default {
  components: { swipe,postCard },
  name:'mutualChoiceDetail',
  data() {
    return {
        finished:false,
        loading:false,
        list:[{},{}],
        expande: true,
        needShowExpande: false,
        caseInfoList:[],
        companyInfo:{},
        roomList:[],
        total:0,
        ctmId:''
    }
  },
   computed:{
    introductoryVal(){
      let val=String(this.companyInfo.introductory);
      if(val.length>50){
        this.needShowExpande=true
        this.false=true
      }
      return val
    }
  },
  methods:{
    handleRoute(){
      this.$router.go(-1)
    },
    // C端获取企业详情
     async handleGetCompanyInfo(companyid){
        console.log('getCompanyInfo:')
        await  getCompanyInfo({
             "companyid":companyid
            }
          ).then((res) => {
                if (res.code == 0) {
                    console.log('getCompanyInfo:',res)
                    this.caseInfoList = res.data.caseInfoList;
                    this.companyInfo = res.data.companyInfo;
                    this.roomList = res.data.roomList;
                    this.total=res.data.caseInfoList.length;
                    this.ctmId= this.companyInfo.ctmId;
                    this.roomList.foreach((item,index)=>{
                    item.roomInfo.startTime=item.roomInfo.startTime.substring(0,16);
                    item.roomInfo.endTimeHHmmdd=item.roomInfo.endTimeHHmmdd.substring(0,5);
                  })

                } else {

                }
              })
              .catch((err) => {
                this.loading = false;
              });
              // 加载状态结束
              this.loading = false;
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
    },
     expandeClick() {
          console.log('expandeClick')
          this.expande = !this.expande
    } 
  },
  mounted() {
    console.log(this.$route.query)
    this.handleGetCompanyInfo(this.$route.query.companyid)
      this.$nextTick(() => {
          let lineHeight = 22
          if (this.$refs.content.offsetHeight > lineHeight * 3) {
              this.expande = false
              this.needShowExpande = true
          } else {
              this.expande = true
          }
      })
  },
};
</script>

<style lang='less' >
    .mutualChoiceDetail{
      .headNav{
        width: 343px;
        height: 16px;
        background-image:url(../../assets/img/headNav.png) ;
        background-size: cover;
        background-repeat:no-repeat;
        color: #FFFFFF;
        padding:60px 0 12px 32px;
        .iconLeft{
          width: 7px;
          height: 14px;
          margin-right: 113px;
        }
        span{
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          line-height: 16px;
        }
      }  
        
        .topDetail{
            .title{
                display: flex;
                align-items: center;
                height: auto;
                .left{
                  width: 57px;
                  height: 57px;
                }
                .right{
                  margin-left: 16px;
                  margin-top: 9px;
                  .companyName{
                      font-size: 18px;
                      font-family: PingFangSC-Medium, PingFang SC;
                      font-weight: bold;
                      color: #191C27;
                      margin-bottom: 5px !important;
                  }
                  .companyDesc{
                      font-size: 12px;
                      font-family: PingFangSC-Regular, PingFang SC;
                      font-weight: 400;
                      color: #5A6073;
                  }
                
                }
            }
             .detail{
                margin-top: 9px;
                width: 336px;
                // height: 60px;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #9EA5BB;
                line-height: 20px;
                // display: -webkit-box;
                // -webkit-box-orient: vertical;
                // -webkit-line-clamp: 3;
                // overflow: hidden;
                position: relative;
              }
              .expandeBts,.closeBts{
                width: 47px;
                height: 18px;
                background: #FFFFFF;
                // padding-left: 9px;
                border-radius: 2px;
                border: 1px solid #FFFFFF;
                font-size:12px;
                -webkit-transform:scale(0.84);
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #5A6073;
              }
              .expandeBts{
                position: absolute;
                right: 0;
                top: 38px;
              }
              .closeBts{
                position: absolute;
                right: 0;
                // top: 98px;
              }
              .expande {
                height: auto;
              }
              .close {
                height: 60px;
                overflow: hidden;
              }
            .time{
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #5A6073;
              margin-top: 10px;
              margin-bottom: 8px;
            }
        }
        .contentTitle,.middleTitle{
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: bold;
          color: #000000;
          line-height: 16px;
        }
        .contentTitle{
          margin-top: 17px;
          margin-bottom: 15px;
        }
        .middleTitle{
          margin-top: 20px;
          margin-bottom: 10px;
        }

    }
</style>
