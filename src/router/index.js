import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)
//双选会
import mutualChoiceInterview from '@/pages/mutualChoiceInterview/index.vue'
import mutualChoiceDetail from '@/pages/mutualChoiceInterview/mutualChoiceDetail.vue'
import mutual_interviewRoom from '@/pages/mutualChoiceInterview/mutual_interviewRoom.vue'
import mutual_activity from '@/pages/mutualChoiceInterview/mutual_activity.vue'
import mutual_emailInviteConfirm from '@/pages/mutualChoiceInterview/mutual_emailInviteConfirm.vue'

//直面职位展示
import companyInterview from '@/pages/companyInterview/index.vue'
import companyDetail from '@/pages/companyInterview/companyDetail.vue'
import interviewRoom from '@/pages/companyInterview/interviewRoom.vue'
//消息推送
import messageInterview from '@/pages/messageInterview/index.vue'
//邮件确认
import emailInviteConfirm from '@/pages/emailInviteConfirm/index.vue'

export default new Router({
  routes: [
    
    //直面职位展示列表
    {
      path: '/companyInterview',
      name: 'companyInterview',
      component: companyInterview,
      meta:['名企直面']

    },
    {
      path: '/companyDetail',
      name: 'companyDetail',
      component: companyDetail,
      meta:['名企直面']

    },
    {
      path: '/interviewRoom',
      name: 'interviewRoom',
      component: interviewRoom,
      meta:['名企直面']

    },
      //邮件邀请函确认窗口
      {
        path: '/emailInviteConfirm',
        name: 'emailInviteConfirm',
        component: emailInviteConfirm,
        meta:['名企直面']

      },
  
    //双选会职位展示列表
    {
      path: '/mutualChoiceInterview',
      name: 'mutualChoiceInterview',
      component: mutualChoiceInterview,
      meta:['双选会']

    },
 
    {
      path: '/mutual_interviewRoom',
      name: 'mutual_interviewRoom',
      component: mutual_interviewRoom,
      meta:['双选会']

    },
    {
      path: '/mutualChoiceDetail',
      name: 'mutualChoiceDetail',
      component: mutualChoiceDetail,
      meta:['双选会']

    },
    {
      path: '/mutual_activity',
      name: 'mutual_activity',
      component: mutual_activity,
      meta:['双选会']
    },
    //（直面/双选会）面试消息确认窗口
    
     {
      path: '/messageInterview',
      name: 'messageInterview',
      component: messageInterview,
      meta:['名企直面']
    },
    
      //邮件邀请函确认窗口
      {
        path: '/mutual_emailInviteConfirm',
        name: 'mutual_emailInviteConfirm',
        component: mutual_emailInviteConfirm,
        meta:['双选会']

      },
    
  ]
})
