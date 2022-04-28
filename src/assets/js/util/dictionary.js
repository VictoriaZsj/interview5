import ApiJS from "@/assets/js/common/api.js";

export default {
  //翻译字典数据列表
  getTranslate(strDictName) {
    return ApiJS.requestApi("suppliers/dict/translate/query", {
      dictName: strDictName
    });
  },
  //翻译多值字典数据列表，strDictname用逗号隔开
  getMulTranslate(strDictName) {
    return ApiJS.requestApi("suppliers/dict/translate/querymult", {
      dictName: strDictName
    });
  },
  //翻译表数据列表
  getTranslateList(strDictName) {
    return ApiJS.requestApi("suppliers/dict/translate/querylist", {
      dictName: strDictName
    });
  },
  // 我司主体的查询
  getTranslateCompany() {
    return ApiJS.requestApi("suppliers/dict/translate/query/company", {});
  }
};
