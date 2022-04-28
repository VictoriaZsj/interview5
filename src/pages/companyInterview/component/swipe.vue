<template>
  <!-- <div class='swipe'> -->
    <van-swipe :loop="false" :width="257" style="height: 210px;" :show-indicators='false'>
      <van-swipe-item v-for="(item,index) in info" :key="index" @click.native="toRoom(item.roomInfo)">
         <div class="itemSwipe">
        <img class="topImg" v-if="item.roomInfo.coverUrl" :src="item.roomInfo.coverUrl " alt="">
        <img class="topImg" v-else src= '@/assets/img/interviewImg.jpg'  alt="">
        <span class="time">{{item.roomInfo.startTime}}-{{item.roomInfo.endTimeHHmmdd}}</span>
            <div class="interviewers">
           <div class="desc" v-if="item.roomInfo.interviewerList.length>0">
            <img class="headPortrait" v-if="item.roomInfo.interviewerList.length>0&&item.roomInfo.interviewerList[0].avatar" :src='item.roomInfo.interviewerList[0].avatar' alt="">
            <img class="headPortrait" v-else src="@/assets/img/interviewerImg.png" alt="">
            <span class="name">{{item.roomInfo.interviewerList[0].interviewerName}}</span>
          </div>
         
          <div class="desc" v-if="item.roomInfo.interviewerList.length>1">
            <img class="headPortrait" v-if="item.roomInfo.interviewerList.length>1&&item.roomInfo.interviewerList[1].avatar" :src='item.roomInfo.interviewerList[1].avatar' alt="">
            <img class="headPortrait" v-else src='@/assets/img/interviewerImg.png' alt="">
            <span class="name">{{item.roomInfo.interviewerList[1].interviewerName}}</span>
          </div>
        </div>

        <!-- <div class="item" v-if="interviewerList.length>0">
                    <img :src='mainAvatar' alt="">
                    <div>
                      <div class="name">{{interviewerList[0].interviewerName}}</div>
                      <div class="faceDirectly">主面</div>
                    </div>                 
                </div>
                <div class="item" v-if="interviewerList.length>1">
                  <img :src='mainAvatar2'  alt="">
                    <div>
                      <div class="name">{{interviewerList[1].interviewerName}}</div>
                    </div> 
                </div>
        -->
        <div class="job">
          <span v-if="item.roomInfo.caseInfoList.length>0" >{{item.roomInfo.caseInfoList[0].caseName }}</span>
          <span v-if="item.roomInfo.caseInfoList.length>1" >{{ '、'+item.roomInfo.caseInfoList[1].caseName}}</span>
          <span v-if="item.roomInfo.caseInfoList.length>2" >{{ '、'+item.roomInfo.caseInfoList[2].caseName }}</span>
        </div>

            
          </div>
       
      </van-swipe-item>
      <!-- <van-swipe-item>2</van-swipe-item>
      <van-swipe-item>3</van-swipe-item>
      <van-swipe-item>4</van-swipe-item> -->
    </van-swipe>
  <!-- </div> -->
</template>

<script>

export default {
  name:'swipe',
  data() {
    return {
      list:[],
      
    };
  },
  props:{
    info:{
        default:[],
        type:Array
    }
  },
  //   computed:{
  //   mainAvatar(){
  //     if(this.info.interviewerList.length>0&&this.interviewerList[0].avatar){
  //       return this.interviewerList[0].avatar
  //     }else{
  //         return "../../assets/img/company.png"
  //     }
  //   },
  //   mainAvatar2(){
  //     if(this.interviewerList.length>1&&this.interviewerList[1].avatar){
  //       return this.interviewerList[1].avatar
  //     }else{
  //         return "../../assets/img/company.png"
  //     }
  //   }
  // },
  watch:{
        info(val){
            val.forEach((a,b) => {
              a.roomInfo.startTime=a.roomInfo.startTime.substring(0,16)
              a.roomInfo.endTimeHHmmdd=a.roomInfo.endTimeHHmmdd.substring(0,5)
              
            });
        },
    },
  methods:{
    toRoom(item){
      this.$emit('clickItem',item)
    }
  }
};
</script>

<style lang='less' scoped>
.topImg{
  width: 237px;
  height: 133px;
  border-radius: 3px;
  background-color: pink;
}
.time{
  // width: 137px;
  padding:0 8px;
  margin-right: 12px;
  height: 24px;
  background: #000000;
  border-radius: 2px;
  opacity: 0.6;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 24px;
  position:absolute ; 
  top:0;
  right: 0; 
  text-align: center;
}
.itemSwipe{
  background: #FFFFFF;
  width: 237px;
  height: 210px;
  border-radius:3px;
  // box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.06);
}
.interviewers{
  display: flex;
  
}
.desc{
  display: flex;
  align-items: center;
  // margin-top: 7px;
  // width: 100px;
  .headPortrait{
    margin-left: 12px;
    width: 20px;
    height: 20px;
  }
  .name{
    margin-left: 10px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #191C27;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    width: 72px;
  }

}

.job{
  margin-top: 7px;
  margin-left: 10px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #9EA5BB;
  display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    width: 217px;
    // height: 12px;
}

//  .van-swipe{
//       .van-swipe-item{
//         margin-right:10px;
//         // background: skyblue;
//         box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.06);
//         border-radius: 3px;
//         background: #fff;

      
//    }
  
//   }

   .van-swipe{
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);
     background: #fefefe;
      .van-swipe__track{
      .van-swipe-item{
      background: #fefefe;
      border-radius: 3px; 
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);
      }
  }
  
  }


</style>
