import fetch from '@/assets/js/http/http.js'


/**
 * C端获取行业聚合列表
 * @param {*} params
 */
 export function getAllIndustryList(params) {
    return fetch({
      url: '/company/getAllIndustryList',
      method: 'post',
      data: params
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