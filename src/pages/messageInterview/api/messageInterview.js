import fetch from '@/assets/js/http/http.js'


/**
 * 获取邀约信息列表
 * @param {*} params
 */
 export function getinterviewList(params) {
    return fetch({
      url: '/talent/getinterviewList',
      method: 'post',
      data: params
    });
  }
/**
 * 被邀约人修改面试时间
 *
 */
  export function upJobTalentinterview(params) {
    return fetch({
      url: '/talent/upJobTalentinterview',
      method: 'post',
      data: params
    });
  }  
  /**
 * 被邀约人邀约
 *
 */
  export function jobTalentinterviewChange(params) {
    return fetch({
      url: '/talent/jobTalentinterviewChange',
      method: 'post',
      data: params
    });
  }
