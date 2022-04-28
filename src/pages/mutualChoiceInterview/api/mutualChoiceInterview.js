import fetch from '@/assets/js/http/http.js'


  /**
 * h5端面试邀约获取人才信息
 *@param {*} params
 */
  export function geth5TalentInfo(params) {
    return fetch({
      url: '/talent/geth5TalentInfo',
      method: 'post',
      data: params
    });
  }  



/**
 * C端获取双选会行业聚合列表
 * @param {*} params
 */
 export function getSchoolAllIndustryList(params) {
    return fetch({
      url: '/company/getSchoolAllIndustryList',
      method: 'post',
      data: params,
      headers:{"Content-Type":"multipart/form-data"}
    });
  }
/**
 * C端获取企业详情
 *
 */
  export function getCompanyInfo(params) {
    let url ='/company/getCompanyInfo'
    console.log('url:',url)
    return fetch({
      url:url,
      method: 'post',
      data: params,
      headers:{"Content-Type":"multipart/form-data"}
    });
  }  
  /**
 * C端获取企业列表
 *
 */
  export function getCompanyList(params) {
    return fetch({
      url: '/company/getCompanyList',
      method: 'post',
      data: params
    });
  }
/**
 * C端获取双选会面试间列表
 *
 */
  export function selectRoomList(params) {
    return fetch({
      url: '/company/selectRoomList',
      method: 'post',
      data: params,
    });
  }  
  /**
 * C端查看面试间详情
 *
 */
   export function selectInterviewRoomDetailForC(params) {
    return fetch({
      url: '/company/selectInterviewRoomDetailForC',
      method: 'post',
      data: params,
      headers:{"Content-Type":"multipart/form-data"}
    });
  }  
/**
 * 根据ehireJobId获取职位信息
 *
 */
 export function getPositionInfoByEhireJobId(params) {
    return fetch({
      url: '/project/getPositionInfoByEhireJobId?ehireJobId='+`${params.ehireJobId}`,
      method: 'get'
    });
  }    
/**
 * 获取最近三周有面试的日期
 *
 */
 export function getHasInterviewDaysInThreeWeeks(params) {
    return fetch({
      url: '/company/getHasInterviewDaysInThreeWeeks',
      method: 'post',
      data: params,
      headers:{"Content-Type":"multipart/form-data"}
    });
  }    
  /**
 * 投递申请
 *
 */
   export function getPrd(params) {
    return fetch({
      url: '/account/addlog',
      method: 'post',
      data:params
    });
  } 
  /**
 * 投递申请
 *
 */
   export function getSchoolLogo(params) {
    return fetch({
      url: '/schoolManagement/getSchoolLogo',
      method: 'get',
      params:params
    });
  } 