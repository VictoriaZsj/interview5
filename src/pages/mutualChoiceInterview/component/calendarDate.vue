<template>
    <div class="calendar" >
      <div class="calendarDate">{{monthLetter}}.{{currentYear}}</div>
      <div class="calendarContainer">
        <div class="leftBtn" @click="handleDayBack"></div>
          <div  class='itemDay' v-for='(dateItem,index) in showDateArr' :key='index' @click="chooseDay(dateItem,index)">
           <div class='dateDay' :class="{checkedDay:dateItem.dateValue==flag}" >{{dateItem.date}}</div> 
            <div class="circle" v-show='dateItem.hasRoom'></div>
          </div>
        <div class="rightBtn" @click="handleDayPrev(false)"></div>
      </div>
      
    </div>
</template>

<script>
const month_enum=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] ;

export default {
  name:'name',
  data() {
    return {
      dateList:[],
      hasInterviewDateList:[],
      monthLetter:'',
      yearByMonthArr:[],
      yearByDayArr:[],
      arrFirstDayIndex:'',
      showDateArr:[],
      currentYear:'',
      currentMonth:'',
      flag:1,
      startIndex:'',
      endIndex:'',
      yearType:''
    };
  },
  props:{
      today:{

      },
      year:{

      },
      month:{

      },
      hasRoomList:[]
  },
  watch:{
    // year(val){
    //   this.currentYear=this.val
    // },
    // month(val){
    //   this.currentMonth=this.val
    // }
  },
  mounted(){
     this.currentYear=this.year
     this.currentMonth=this.month
     this.initCalendarArr()
  },
  methods:{
   initCalendarArr(){
        this.yearType=this.currentYear/4==0?'闰':'平'
        let dateIndex=1;
        for(let i=0;i<12;i++){
        let lastDay
        if(i==3||i==5||i==8||i==10){//4，6，9，11月
            lastDay=30
        }else if(i==1){//2月
            if(this.yearType=='闰'){
            lastDay=29
            }else{
            lastDay=28
            }
        }else{
            lastDay=31
        }
        let arr=[];
        for(let j=1;j<=lastDay;j++){
            arr.push({
                index_of_year:dateIndex++,
                date:j
            })
            this.yearByDayArr.push({
              month_of_date:i,
              date:j
            
            })
        }
        let obj={
            month:i,
            arr:arr,
            lastDay:lastDay 
        }
        this.yearByMonthArr.push(obj);//全年月份数组
        }
        console.log('this.yearByMonthArr:',this.yearByMonthArr)
        console.log('this.yearByDayArr:',this.yearByDayArr)//全年日期数组

        this.initCalendar()
   },
   initCalendar(){
     this.yearByMonthArr.some((item,index)=>{
       if(this.currentMonth==item.month){
        this.monthLetter=month_enum[this.currentMonth];
        item.arr.some(i=>{
          if(i.date==this.today){
            this.startIndex=i.index_of_year;
            // this.yearByDayArr[this.startIndex]='今天';
            
            return true
          }
        })
        return true
       }
     })
     this.handleDayPrev(true); 
     
  },
  chooseDay(dateItem,dateIndex){
      this.flag=dateItem.dateValue
      this.$emit('chooseDay',dateItem.dateValue)
  },
  
  handleDayPrev(init){
    
    this.showDateArr=[];
    if(this.endIndex){
       this.flag=null
       this.startIndex=this.endIndex;//初始化时不执行这
    }
     this.endIndex=this.startIndex+7
     if((this.yearType=='平'&&this.endIndex>=365)||(this.yearType=='闰'&&this.endIndex>=366)){
       return //当年到头
     }
     this.showDateArr=this.yearByDayArr.slice(this.startIndex,this.endIndex) 
    
    //  this.showDateArr.forEach((date,index)=>{
    //    this.dateList.push({
    //           value:date,
    //           _value:date,
    //           checked:index,
    //      })
    //  })

   

    let other=false
    if((this.showDateArr[0].date==1&&this.showDateArr[6].date==7)){
       other=true
     } 
    //月份显示
     if(this.showDateArr[6].date<this.showDateArr[0].date||other){
       this.currentMonth=this.currentMonth+1;
       this.monthLetter=month_enum[this.currentMonth];
     }

     
     this.$nextTick(()=>{
       this.showDateArr.forEach(i=>{
         if(i.month_of_date+1<10){
           var _month='0'+(parseInt(i.month_of_date)+1)
          };
          this.$set(i,'dateValue',this.currentYear+'-'+_month+'-'+i.date)
          this.$set(i,'hasRoom',false)
          if(this.hasRoomList.length){
            if(this.hasRoomList.indexOf(i.dateValue)!=-1){
               i.hasRoom=true
            }
          }
    })
  })
     
      
    //  if(init==true){
       
    //     this.flag=this.currentYear+'-'+_month+'-'+'今天'
    //  }
    console.log('showDateArr:',this.showDateArr)  
    console.log('dateList:',this.dateList)  
  },
  handleDayBack(){
    this.flag=null

    this.showDateArr=[];
    
     this.startIndex=this.startIndex-7;
     if(this.startIndex<=0){
       return  //当年到底
     }
     this.endIndex=this.startIndex+7

     this.showDateArr=this.yearByDayArr.slice(this.startIndex,this.endIndex) 
     
  
  
     let other=false
     if((this.showDateArr[0].date==22&&this.showDateArr[6].date==28)||(this.showDateArr[0].date==23&&this.showDateArr[6].date==29)
     ||(this.showDateArr[0].date==24&&this.showDateArr[6].date==30)||(this.showDateArr[0].date==25&&this.showDateArr[6].date==31)){
       other=true
     }   
     if(this.showDateArr[0].date>this.showDateArr[6].date||other){
       this.currentMonth=this.currentMonth-1;
       this.monthLetter=month_enum[this.currentMonth];
     }

     
     
      this.showDateArr.forEach(i=>{
          if(i.month_of_date+1<10){
           var _month='0'+(parseInt(i.month_of_date)+1)
          };
          this.$set(i,'dateValue',this.currentYear+'-'+_month+'-'+i.date)
          if(this.hasRoomList.length){
            if(this.hasRoomList.indexOf(i.dateValue)!=-1){
              i.hasRoom=true
            }
          }
    })
    console.log('showDateArr:',this.showDateArr)  
  }
  }
};
</script>

<style lang='less' scoped>
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
          // justify-content: space-between;
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
           margin-bottom: 3px;
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

</style>
