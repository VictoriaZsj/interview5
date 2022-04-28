import fetch from '@/assets/js/http/http.js'

  /**
 * C端被邀请人邀请处理
 *@param {*} params
 */
  export function jobTalentinterviewChange(params) {
    return fetch({
      url: '/talent/jobTalentinterviewChange',
      method: 'post',
      data: params
    });
  }  
  /**
 * C端被邀请人修改面试时间
 *
 */
  export function upJobTalentinterview(params) {
    return fetch({
      url: '/talent/talent/upJobTalentinterview',
      method: 'post',
      data: params
    });
  }  
  /**
 * h5端获取人才信息
 *
 */
  export function geth5TalentInfo(params) {
    return fetch({
      url: '/talent/geth5TalentInfo',
      method: 'post',
      data: params
    });
  }  