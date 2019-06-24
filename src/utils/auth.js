// 本地存储的加载封装
const localStorage = window.localStorage
const USER_KEY = 'user_info'

// export 用来导出，它支持导出多个成员
// 它的方式有个好吃就是：支持按需加载，需要谁才加载谁，打包的时候，对于没有使用的成员就不会打包该成员

// 获取
export function getUser () {
  return JSON.parse(localStorage.getItem(USER_KEY))
}

// 保存
export function saveUser (data) {
  localStorage.setItem(USER_KEY, JSON.stringify(data))
}

// 删除
export function removeUser () {
  localStorage.removeItem(USER_KEY)
}
