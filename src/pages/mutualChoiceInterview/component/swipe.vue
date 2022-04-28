<template>
    <van-swipe :loop="false" :width="257" style="height: 230px;" :show-indicators='false'>
      <van-swipe-item v-for="(item,index) in roomList" :key="index" @click.native="toRoom(item.roomInfo)">
        <div class="itemSwipe">
          <img class="topImg" v-if="item.roomInfo.coverUrl" :src="item.roomInfo.coverUrl " alt="">
          <img class="topImg" v-else src= '@/assets/img/interviewImg.jpg'  alt="">
          <span class="time">{{item.roomInfo.roomName}}</span>
          <!-- <div v-if="isWaiting" class="detail"><span class="hot">火热进行中</span><van-icon name="contact" /><span class="interviewers">当前等候人数：16</span></div> -->
          <div v-if="item.roomInfo.status==='03'" class="detail"><img class="hot" src="@/assets/img/hot.png" alt=""><van-icon name="contact" /><span class="interviewers">当前等候人数：{{item.roomInfo.jobseekerNum}}</span></div>
          <div v-else class="interviewDetail">面试时间：{{item.roomInfo.startTime}} - {{item.roomInfo.endTimeHHmmdd}}</div>
          <div class="desc">
            <img class="headPortrait" v-if="item.roomInfo.companyLogo" :src="item.roomInfo.companyLogo" alt="">
            <img class="headPortrait" v-else src= '@/assets/img/companyLogo.png' alt="">
            <!-- <img class="headPortrait"  src= '@/assets/img/interviewImg.jpg' alt=""> -->
            <span class="name">{{item.roomInfo.companyName}}</span>
          </div>
        </div>
        
      </van-swipe-item>

    </van-swipe>
</template>

<script>
import {selectRoomList} from '../api/mutualChoiceInterview.js'
export default {
  name:'swipe',
  data() {
    return {
       isWaiting:true,
       roomList:[],
    };
  },
   mounted(){
     console.log(this.$route.query.schoolid)
    this.handleSelectRoomList()
  },
  methods:{
     toRoom(item){
      console.log('44:111',item)
      this.$router.push({path:'/mutual_interviewRoom',query:{roomId:item.id}})
    },
     handleSelectRoomList(){
      // console.log('handleSelectRoomList:')
        selectRoomList(
          {
            "industry": "",
            "startTime": "",
            "schPkid": this.$route.query.schoolid,
          }
        ).then((res) => {
              if (res.code == 0) {
                console.log(res,'res');
                this.roomList=res.data
                this.roomList.forEach((item,index)=>{
                  item.roomInfo.startTime=item.roomInfo.startTime.substring(0,16)
                  item.roomInfo.endTimeHHmmdd=item.roomInfo.endTimeHHmmdd.substring(0,5)
                })
              } else {

              }
            })
            .catch((err) => {
              
            });
    },
  }
};
</script>

<style lang='less' scoped>
.itemSwipe{
  background: #FFFFFF;
  width: 237px;
  height: 230px;
  border-radius:3px;
}
.topImg{
  width: 237px;
  height: 133px;
  border-radius: 3px;
  background-color: pink;
}
.time{
  display: inline-block;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
  color: #191C27;
  margin-top:5px; 
  margin-left:10px; 
}
.detail{
  display: flex;
  align-items: center;
  margin-top:6px;
  margin-left: 10px;
  .hot{
    // display: inline-block;
    margin-right: 8px;
  }
  .interviewers{
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #5A6073;
    margin-left: 6px;
  }
}
.interviewDetail{
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #5A6073;
  margin:8px 0 9px 10px;
}
.desc{
  display: flex;
  align-items: center;
   margin-top: 6px;
  .headPortrait{
    margin-left: 12px;
    width: 14px;
    height: 14px;
    background-color: pink;
  }
  .name{
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #9EA5BB;
    margin-left: 8px;
  }

}

.job{
  margin-top: 11px;
  margin-left: 10px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #9EA5BB;
}

  .van-swipe{
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.06);
    background: #f7f7f7;
      .van-swipe__track{
      .van-swipe-item{
      background: #f7f7f7;
      border-radius: 3px; 
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);
      }
  }
  
  }


</style>
