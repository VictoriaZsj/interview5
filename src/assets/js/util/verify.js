
export const emptyArr = (rule, value, callback ) => {
  // console.log(888888)
  if (value.length === 0) {
    // console.log('1213213')
    callback(new Error('此项为必填项'));
  } else {
    // console.log('221213213')
    callback();
  }
};