
<template>
  <div class='companyInterview wrapper'>
    <img class="faceDirectlyImg" src="../../assets/img/faceDirectlyImg.png" alt="">
    <div class="topSearchBtn">
     <!-- <img class="back" src="@/assets/img/back.png" alt="" @click="handleGoBack"> -->
      <div class="topTitle">什么是名企直面？</div>
      <div class="topDesc">
        <div>
          还在为每个公司重复的测评烦恼？还在为不知哪天结束的流程发愁？还在为投递了无音讯难过？名企直面跳过简历笔试环节，申请成功直接面试，回复快，投递不再了无音讯。
        </div>      
      </div>
      <img class="cowImg" src="@/assets/img/cow.png" alt="">
    </div>
    <div class="bts">
      <div class="jobs"  @click="showPopupJob"><div class="jobTxt">{{selectJobList.length>0?searchObj.industry:"选择行业"}}</div><div class="triangle"></div></div>
      <div class="time"  @click="showPopupTime">{{selectTime?selectTime:"选择时间"}}<div class="triangle"></div></div>
    </div>
    <popup-select selectType='checkBox' title='选择行业' position='bottom' :show='showJobs' :list='jobList' @handleSave="handleSaveJob" @handleShow="handleShowJob('job')" ></popup-select>
    <popup-select selectType='single' title='选择时间' position='bottom' :show='showTime' :list='timeList' @handleSave="handleSaveTime" @handleShow="handleShowTime('time')"></popup-select>

    <div style="margin:0 20px 0;position:relative;z-index:2">
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
      <company-card v-for='(item,index) in list' :info='item' :key='index' @click.native="topDetail(item)"></company-card >
    </van-list>
    </div> 
  </div>
</template>

<script>
import {getAllIndustryList,getCompanyList} from './api/companyInterview.js'
import companyCard from './component/companyCard.vue';
import popupSelect from './component/popupSelect'
export default {
  components: { companyCard ,popupSelect},
  name:'companyInterview',
  data() {
    return {
      finished:false,
      loading:false,
      list:[],
      searchObj:{
            "accountId": 0,
            "currentPage": 1,
            "endTime": "",
            "industry": "",
            "pageSize": 10,
            "startTime": "",
            "timeType":"" //0-今天 1-近3天 2-近5天 3-近7天
      },
      //筛选行业
      showJobs:false,
      selectJobList:[],
      jobList:[],
      //筛选时间
      showTime:false,
      selectTime:'',
      page:1,
      size:10,
      total:0,
      timeList:[
         {
          flag:'',
          value:'今天',
          code:0
        },
         {
          flag:'',
          value:'近3天',
          code:1
        },
         {
          flag:'',
          value:'近5天',
          code:2
        },
         {
          flag:'',
          value:'近7天',
          code:3
        },
      ]
    };
  },
   beforeCreate () {
        document.querySelector('body').setAttribute('style', 'background-color:#F0F2F5')
    },
  mounted(){
    this.handleGetAllIndustryList();
    this.handleGetCompanyList(true);
  },
  methods:{
    // handleGoBack(){
    //       window.location = 'xiaoyuan://home/exitCurrentPage'

    // },
      topDetail(item){
        // console.log(this.$router)
        this.$router.push({path:'/companyDetail',query:{companyid:item.id}})
      },
      handleShowJob(){
        this.showJobs=false
      },
      handleShowTime(){
        this.showTime=false
      },
    //行业聚合列表
      handleGetAllIndustryList(){
          getAllIndustryList().then((res) => {
                if (res.code == 0) {
                  // console.log('handleGetAllIndustryList:',res)
                  let arr=[];
                  if(res.data&&res.data.length){
                    this.jobList=res.data.map(i=>{
                        return {
                          flag:false,
                          value:i
                        }
                  })
                    
                  // console.log(this.jobList)
                } else {

                }
              }
              })
              .catch((err) => {
                
              });
      },
      //C端获取企业列表
      async handleGetCompanyList(isRefresh){
        // console.log('getCompanyList:')
          this.loading = true;
          if(isRefresh){
              this.page=1;
              this.size=10;
          }
          await getCompanyList(
            {
              "accountId": localStorage.getItem('accountId')||'',
              "currentPage": this.page,
              "pageSize": this.size,
              "industry": this.searchObj.industry,
              "timeType": this.searchObj.timeType
              }
          ).then((res) => {
                if (res.code == 0) {
                  if(isRefresh){
                    this.list=res.data.list;
                  }else{
                    this.list=this.list.concat(res.data.list);
                  }
                  this.list.forEach((a,b)=>{
                    a.interviewRoomList[0].startTime=a.interviewRoomList[0].startTime.substring(0,16)
                    a.interviewRoomList[0].endTime=a.interviewRoomList[0].endTime.substring(10,16)
                  })
                  this.total=res.data.total;
                  this.pageNum=res.data.pageNum;
                  console.log('getCompanyList:',this.list)
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
        if (this.list.length >= this.total) {
          this.finished = true;
        }else{
          this.page= this.pageNum+1;
          this.handleGetCompanyList(false)
        }
      }, 1000);
    },
    handleSaveJob(val){
      // let arr=val.map(i=>{
      //        return i.value;
      //      })
      this.selectJobList=val.map(i=>{
             return i.value;
           })
          //  console.log('arr:',arr)
          if(this.selectJobList.length>0){
            this.searchObj.industry=this.selectJobList.join(',');
          }else{
            this.searchObj.industry=''
          }
          //  console.log('this.searchObj.industry:',this.searchObj.industry)
           this.showJobs=false
           this.handleGetCompanyList(true)
    },
    handleSaveTime(val){
      this.searchObj.timeType=val.code;
      this.selectTime=val.value
      this.showTime=false
      this.handleGetCompanyList(true)
    },
    
    // 弹出筛选行业/时间弹框
    showPopupJob(){
      this.showJobs=true
    },
    showPopupTime(){
      this.showTime=true
    }

  }
};
</script>

<style lang='less' scoped>
  .companyInterview{
    .faceDirectlyImg{
      width: 100vw;
      position: fixed;
      top: 0;
      z-index: 1;
      // height: 292px;
    }
    .scroll-list{
      // z-index: 999;
      margin: -95px 20px 0 20px;
      /deep/.van-dropdown-menu__bar{
        width: 170px;
        height: 24px;
        background-color: transparent;
        .van-dropdown-menu__item{
           width: 75px;
           height: 24px;
           background: #FFFFFF;
           border-radius: 14px;
           padding-right: 10px;
        }
        .van-dropdown-menu__item:first-child{
          margin-right: 10px;
        }
        .van-dropdown-menu__title{
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #2953FF;
        }
        .van-dropdown-menu__title::after {
          // width: 10px;
          // height: 6px;
          border-color: transparent transparent #2753FF #2753FF;
          // background: #2753FF;
          border-color:none !important;
        }
                
        
      }
    }
    .bts{
      margin: -75px 20px 12px 20px;
      display: flex;
      align-items: center;
       position: relative;
        z-index: 2;
      .jobTxt{
        width: 96px;
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical; 
        height:13px ;
        text-align: center;
      }
      // .timeTxt{
      //   width: 75px;
      // }
      // .jobTxt,.timeTxt{
      //    font-size: 12px;
      //   line-height: 12px;
      //   font-family: PingFangSC-Regular, PingFang SC;
      //   font-weight: 400;
      //   color: #2953FF; 
      // }
      .jobs,.time{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 10px;
        padding-top: 8px;
        padding-bottom: 6px;
        overflow: hidden;
        background: #FFFFFF;
        border-radius: 14px;
        font-size: 12px;
        line-height: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #2953FF; 
        .triangle{
          margin-top: -5px;
          // margin-left: 8px;
          border: 3.5px solid;
          border-color: transparent transparent #2953FF #2953FF;
          -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
        }
      }
      // .time{
      //   font-size: 12px;
      //   line-height: 12px;
      //   font-family: PingFangSC-Regular, PingFang SC;
      //   font-weight: 400;
      //   color: #2953FF; 
      //   width: 75px;
      // }
      .jobs{
        width: 128px;
        // display: -webkit-box;
      //   overflow: hidden;
      //   -webkit-line-clamp: 1;
      //   -webkit-box-orient: vertical;
        .triangle{
          margin-left: 5px;
        }
        margin-right: 12px;
      }
      
      .time{
        width: 75px;
        .triangle{
          margin-left: 8px;
        }
      }
    }
 
    .topSearchBtn{

      position: relative;
      z-index: 2;
      padding: 58px 20px 0;
      .back{
        width: 12px;
        height: 24px;
      }
      .topTitle{
        font-size: 20px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #FFFFFF;
        letter-spacing: 1px;
        margin-top: 20px;
        margin-bottom: 15px;
      }
      .topDesc{
        background: rgba(255, 255, 255, 0.1);
    
        div{
          padding:14px 20px 10px;
          font-size: 10px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #F8FAFD;
          line-height: 18px;
        }   
      }
      .cowImg{
        position: relative;
        z-index: 2;
        margin-top: -21px;
        margin-left: 230px;
      }
    }
  }
</style>
