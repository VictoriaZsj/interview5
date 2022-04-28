

<template>
  <div class='mutualChoiceInterview wrapper'>
    <!-- <van-sticky> -->
    <!-- <img class="headNav" src="@/assets/img/headNav.png" alt=""> -->
    <div class="schoolDesc">
      <img class="schoolLogo" v-if="shcoolLogo" :src="shcoolLogo" alt="">
      <span>{{schoolname}}</span>
    </div>
    <!-- </van-sticky> -->
    <div class="top">
      <div class="doubleElection">直面双选会</div>
      <div class="more" @click="toMoreRoom()">查看更多<van-icon name="arrow" /></div>
    </div>
    <div style="margin-left:20px">
      <swipe ></swipe>
      <!-- <swipe @click.native="toRoom"></swipe> -->
    </div>

    
    <div class="companys">校园入驻企业</div>
    <div class="topSearchBtn">
       <van-tabs @click="chooseTab">
            <van-tab v-for="(tabItem,tabIndex) in tabList" :key='tabIndex' :title="tabItem" :name="tabItem" v-model="tabValue">
            </van-tab>    
       </van-tabs>
    </div>
    
    <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
        <div style="margin:0 20px">
          <company-card v-for='(item,index) in list' :key='index' :info='item' @click.native="toDetail(item)"></company-card >
        </div>
    </van-list>  
  </div>
</template>

<script>
import {getSchoolAllIndustryList,getCompanyList,getSchoolLogo} from './api/mutualChoiceInterview.js'
import companyCard from './component/companyCard.vue';
import swipe from './component/swipe.vue'

export default {
  
  components: { companyCard,swipe },
  name:'mutualChoiceInterview',
  data() {
    return {
      finished:false,
      loading:false,
      list:[],
      page:1,
      size:10,
      tabList:[],
      roomList:[],
      initIndustry:'',
      pageNum:1,
      tabValue:'',
      // schoolId:"9f054516-d0fd-4889-9e81-57cd579c7db9"
      schoolId:"",
      schoolname:'',
      shcoolLogo:''
    };
  },
  
  methods:{
     // 筛选
      chooseTab(name){
        // console.log(name);
        this.schoolId=this.$route.query.schoolid;
        if(name==='全部'){
          this.handleGetCompanyList('',true)
        }else{
          this.handleGetCompanyList(name,true)
        }
      },
     toDetail(item){
        console.log(this.$route)
       return this.$router.push({path:'/mutualChoiceDetail',query:{companyid:item.id}})
      },
     toMoreRoom(){
        console.log(this.$route)
       return this.$router.push({path:'/mutual_activity',query:{schoolid:this.$route.query.schoolid}})
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
          this.handleGetCompanyList(this.tabValue,false)
        }
      }, 1000);
    },
      //C端获取企业列表
     async handleGetCompanyList(industry,isRefresh){
       if(isRefresh){
              this.page=1;
              this.size=10;
          }
          // console.log('9999:',localStorage.getItem('accountId'))
        await  getCompanyList(
            {
              // "accountId": localStorage.getItem('accountId')||'51920285',
              "accountId": localStorage.getItem('accountId')||'',
              "currentPage": this.page,
              "pageSize": this.size,
              "industry": industry,
              }
          ).then((res) => {
                if (res.code == 0) {
                  if(isRefresh){
                    this.list=res.data.list;
                  }else{
                    this.list=this.list.concat(res.data.list);
                  }
                    this.total=res.data.total;
                    this.pageNum=res.data.pageNum;
                    console.log('getCompanyList:',this.list)

                    this.list.forEach((item,index)=>{
                    item.projectEndTime=item.projectEndTime.substring(0,16)
                    item.projectStartTime=item.projectStartTime.substring(0,16)
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
       //行业聚合列表
      handleGetSchoolAllIndustryList(){
          getSchoolAllIndustryList(
            {
              schoolId:this.$route.query.schoolid
            }
          ).then((res) => {
                if (res.code == 0) {
                  // console.log('handleGetSchoolAllIndustryList:',res)
                  this.tabList = ['全部'].concat(res.data)
                  console.log(this.tabList)
              }
              })
              .catch((err) => {
                
              });
      },
      //获取学校logo
      handleGetSchoolLogo(){
        getSchoolLogo(
          {
            schoolId:this.$route.query.schoolid
            // schoolId:'63f94049-35aa-4f91-8085-c37771292dce'
          }
        ).then((res)=>{
          if(res.code == 0){
            this.shcoolLogo = res.data
          }
        })
      },
      saveSchoolInfo(){
        if(this.$route.query){
          this.$store.commit('SETSCHOOL_INFO',{
          mutualSchoolId:this.$route.query.schoolid,
          mutualSchoolName:this.$route.query.schoolname
          })
        }
        
      }

  } ,
  beforeCreate () {
        document.querySelector('body').setAttribute('style', 'background-color:#F8FAFD')
    },
    beforeRouterEnter(to,from){
      console.log('zzzzjjjjj')
      this.saveSchoolInfo()
    },
   mounted(){
    this.handleGetSchoolLogo()
    this.handleGetSchoolAllIndustryList();
    this.handleGetCompanyList(this.tabValue,true)
    this.schoolname=this.$route.query.schoolname
  },
    
};
</script>

<style lang='less' scoped>
  .mutualChoiceInterview{
    width: 100vw;
    background: #F8FAFD;
    position: relative;
    // .headNav{
    //   width: 100%;
    // }
    .schoolDesc{
      display: flex;
      align-items: center;
      margin-left: 20px;
      margin-top: 10px;
      // position: absolute;
      // top: 56px;
      // left: 21px;
      .schoolLogo{
        width: 24px;
        height: 24px;
        // background-color: pink;
        margin-right: 6px;
      }
      span{
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #000;
      }
    }
    .top{
      margin: 13px 20px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .doubleElection{
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #191C27;
      }
      .more{
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #9EA5BB;
      }

    }
    .companys{
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: #191C27;
      margin-left: 20px;
      margin-top: 20px;
      margin-bottom: 12px;
    }
    .topSearchBtn{
      margin-left: 20px;
      margin-bottom:10px;
      /deep/.van-tabs--line .van-tabs__wrap{
        height: 21px;
      }
   
      /deep/.van-tabs__line{
        display: none;
      }
      /deep/.van-tab{
         width: 55px;
        flex:unset;
        -webkit-box-flex: unset;
        -webkit-flex: unset;
        height: 21px;
        border-radius: 11px;
        border: 1px solid #9EA5BB;
        margin-right: 10px;
        color: #9EA5BB;
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
              padding:24px 19px 12px 20px;
              .img{
              display: inline-block;
              width: 45px;
              height: 45px;
              margin-right: 20px;
              }
            }
            .interviewDesc{
              .companyName{
                font-size: 16px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: bold;
                color: #191C27;
              }
              .interviewTime{
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #5A6073;
                margin-top: 8px;
              }
              .advantage{
                margin-top: 8px;
                span{
                  padding:5px 13px;
                  background: #F8FAFD;
                  border-radius: 3px;
                  font-size: 10px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #5A6073;
                  margin-right: 9px;
                  margin-top: 8px;

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
  }
</style>
