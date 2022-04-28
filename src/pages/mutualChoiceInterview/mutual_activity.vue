<template>
  <div class='mutual_activity'>
    <!-- <van-sticky> -->
    <!-- <img class="headNav" src="@/assets/img/headNav.png" alt=""> -->
    <div class="schoolDesc">
      <img class="schoolLogo"  v-if="shcoolLogo" :src="shcoolLogo" alt="">
      <span>{{schoolName}}</span>
    </div>
    <!-- </van-sticky> -->
    <calendarDate :year='year' :today='today' :month='month' :hasRoomList='hasInterviewDateList' @chooseDay='handleChooseDay'></calendarDate>
    
    <div class="topSearchBtn">
        <van-tabs  @click="chooseTab">
          <van-tab v-for="(tabItem,tabIndex) in tabList" :key='tabIndex' :title="tabItem" :name="tabItem" >
          </van-tab>
        </van-tabs>
    </div>
    <div class="content">
      <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
        <div class="activity" v-for='(item,index) in roomList' :key='index' @click="toRoom(item.roomInfo)" >
          <img class="img" v-if="item.roomInfo.coverUrl" :src="item.roomInfo.coverUrl " alt="">
          <img class="img" v-else src= '@/assets/img/interviewImg.jpg'  alt="">
          <!-- <img src="" alt="" class="img"> -->
          <div class="activityContent">
            <div class="detail">
              <div class="interviewName">{{item.roomInfo.roomName}}</div>
              <div class="companyDesc">
                <img v-if="item.roomInfo.companyLogo" :src="item.roomInfo.companyLogo">
                <img v-else src= '@/assets/img/companyLogo.png' >
                <span class="companyName">{{item.roomInfo.companyName}}</span>
              </div> 
            </div>
            <van-button type="info" round size="mini" @click="toRoom(item)">报名直面 <van-icon name="arrow"/></van-button>
          </div>
          <div class="time">{{item.roomInfo.startTime}}-{{item.roomInfo.endTimeHHmmdd}}</div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import calendarDate from './component/calendarDate.vue'
import swipeComp from './component/swipe.vue'
import {getSchoolAllIndustryList,selectRoomList,getHasInterviewDaysInThreeWeeks,getSchoolLogo} from './api/mutualChoiceInterview.js'
const date=new Date()
const today=date.getDate() 
const year=date.getFullYear() 
const month=date.getMonth()
export default {
  components:{swipeComp,calendarDate},
  name:'mutual_activity',
  data() {
    return {
      month:month,
      year:year,
      today:today,
      tabList:[],
      finished:false,
      loading:false,
      list:[{},{}],
      btnList:['互联网','互联网','互联网','互联网','互联网','互联网'],
      date: '',
      show: false,
      dateList:[
        
      ],
      flag:null,
      roomList:[],
      initIndustry:'',
      arrFirstDay:'',
      arrLastDay:'',
      hasInterviewDateList:[],
      schoolName:'',
      shcoolLogo:''
      

      
      // schoolId:"9f054516-d0fd-4889-9e81-57cd579c7db9"
    };
  },
  
  methods:{
    chooseDay(dateItem,dateIndex){
      this.flag=dateIndex+1
    },
    
     // 筛选
    chooseTab(name){
      // this.schoolId=this.$route.query.schoolId;
      if(name==='全部'){
        this.handleSelectRoomList('')
      }else{
        this.handleSelectRoomList(name)
      }
    },
     onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push({});
        }
        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成
        if (this.list.length >= 10) {
          this.finished = true;
        }
      }, 1000);
    },
    handleChooseDay(param){
      this.startTime=param
      console.log(param,'params');
      this.handleSelectRoomList()
    },
    
    // 面试间列表
    handleSelectRoomList(industry){
      // console.log('handleSelectRoomList:')
        selectRoomList(
      
          {
            "industry": industry,
            "date": this.startTime,
            // "schPkid": his.$route.query.schoolid||"9f054516-d0fd-4889-9e81-57cd579c7db9",
            "schPkid": this.$store.state.mutualSchoolId||"",
          }
        ).then((res) => {
              if (res.code == 0) {
                console.log(res,'res');
                this.roomList=res.data
                this.roomList.forEach((item,index)=>{
                  item.roomInfo.startTime=item.roomInfo.startTime.substring(0,16)
                  item.roomInfo.endTimeHHmmdd=item.roomInfo.endTimeHHmmdd.substring(0,5)
                })
                // console.log('selectInterviewRoomDetailForC:',res.data.interviewerList)
                // this.caseInfoList=res.data.caseInfoList;
                // this.caseInfoList&&this.caseInfoList.forEach(_=> {
                //   this.$set(_,'checked',false)

                // });
                // // this.caseInfoList=this.caseInfoList.concat(this.caseInfoList)
                // this.interviewTime=res.data.date+" "+res.data.startTime+'~'+res.data.endTime;
                
                // this.companyName=res.data.companyName;
                // this.coverUrl=res.data.coverUrl;
                
                // this.interviewerList=res.data.interviewerList;
              } else {

              }
            })
            .catch((err) => {
              
            });
    },
     //行业聚合列表
    handleGetSchoolAllIndustryList(){
        getSchoolAllIndustryList(
          {
            schoolId:this.$store.state.mutualSchoolId
          }
        ).then((res) => {
              if (res.code == 0) {
                // console.log('handleGetSchoolAllIndustryList:',res)
                this.tabList = res.data
                this.tabList = ['全部'].concat(res.data)
            }
            })
            .catch((err) => {
              
            });
    },
    // 获取最近三周有面试的日期
    handleGetHasInterviewDaysInThreeWeeks(){
      getHasInterviewDaysInThreeWeeks(
        {
          schoolId:this.$store.state.mutualSchoolId
        }
        ).then((res) => {
              if (res.code == 0) {
                // console.log('handleGetSchoolAllIndustryList:',res)
                // this.tabList = res.data
                // this.tabList = ['全部'].concat(res.data)
              console.log(res,'res');
              this.hasInterviewDateList=res.data
              // res.data.forEach((a,b)=>{
              //   this.hasInterviewDateList.push(a.substring(8,10))
              //   // console.log(a,'aaa');
              // })
             
              // console.log(this.hasInterviewDateList,'this.hasInterviewDateList');
          }
          })
          .catch((err) => {
            
          });
    },
     //获取学校logo
      handleGetSchoolLogo(){
        getSchoolLogo(
          {
            schoolId:this.$store.state.mutualSchoolId
            // schoolId:'63f94049-35aa-4f91-8085-c37771292dce'
          }
        ).then((res)=>{
          if(res.code == 0){
            this.shcoolLogo = res.data
          }
        })
      },
    toRoom(item){
      console.log('44:111',item)
      this.$router.push({path:'./mutual_interviewRoom',query:{roomId:item.id}})
    },
    
},
mounted(){
    this.handleGetSchoolLogo()
    this.handleGetSchoolAllIndustryList()
    this.handleSelectRoomList(this.initIndustry)
    this.handleGetHasInterviewDaysInThreeWeeks()
    this.schoolName = this.$store.state.mutualSchoolName

  },
  
  beforeCreate () {
      document.querySelector('body').setAttribute('style', 'background-color:#F8FAFD')
  }
}
</script>

<style lang='less' scoped>
  .mutual_activity{
    position: relative;
    background: #F8FAFD;
    .headNav{
      width: 100%;
    }
    .schoolDesc{
      // background-color: #fff;
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
    .calendar{
      width: 375px;
      height: 68px;
      background: #FFFFFF;
      border-radius: 2px;
      .calendarDate{
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #191B26;
        margin:9px 0 4px;
        text-align: center;
      }
      .calendarContainer{
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin:7px 17px 8px;
        .leftBtn{
          border: 4px solid;
          border-color: transparent transparent #9FA4B7 #9FA4B7;
          -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
          
        }
        .rightBtn{
          border: 4px solid;
          border-color: transparent transparent #9FA4B7 #9FA4B7;
          -webkit-transform: rotate(-135deg);
          transform: rotate(-135deg);
        }
        .leftBtn:hover,.rightBtn:hover{
          border-color: transparent transparent #2953FF #2953FF;
        }
        .itemDay{
          display: flex;
          height: 40px;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
        }
        .dateDay{
         text-align: center;
          width: 28px;
          height: 28px;
          border-radius: 28px;
          line-height: 28px;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: bold;
          color: #191B26;
          //  margin-bottom: 7px;
          &.checkedDay{
            background: #2953FF;
            color: #FFFFFF;
            font-weight: 400;
          }
          
        }
        .calendarContent{
          display: flex;
          flex-direction: column;
          align-items: center;
          // justify-content: center;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #191B26;
          
        }
        .circle{
         
          width: 4px;
          height: 4px;
          border-radius: 4px;
          background: #2953FF;
        }
      }
    }

    
    
     .topSearchBtn{
      margin: 14px 0 10px 20px;
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
    .content{
      padding: 0 20px;
      .activity{
      position: relative;
      margin-bottom: 10px;
      width: 335px;
      height: 246px;
      background: #FFFFFF;
      border-radius: 3px;
      .img{
        // background-color: aqua;
        width: 335px;
        height: 188px;
        border-radius: 3px;
        background-color: pink;
      }
      .activityContent{
        // margin-top: 10px;
        margin:10px 10px 11px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .detail{
          .interviewName{
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: bold;
            color: #191C27;
          }
          .companyDesc{
            display: flex;
            align-items: center;
            margin-top: 6px;
            img{
              width: 14px;
              height: 14px;
              background-color: pink;
              
            }
            .companyName{
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #9EA5BB;
              // margin-top: 5px;
              margin-left: 8px;
            }

          }


        }
        .van-button{
          width: 90px;
          height: 30px;
          background: #2753FF;
          border-radius: 16px;
          font-size: 12px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: bold;
          color: #FFFFFF;
        }
        .van-button--info{
          border: 1px solid #2753FF;
        }


      }
      .time{
        position: absolute;
        top: 0;
        right: 0;
        height: 24px;
        background: #000000;
        border-radius: 2px;
        opacity: 0.6;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 24px;
      }
    }

    }
    
  }
</style>
