// 定义Module会导致无法使用文件系统
// var Module = {
//     initialized: false
// }

Module.onRuntimeInitialized = function() {
  console.log('onRuntimeInitialized');
  Module.initialized = true
}

Module.onRuntimeFailed = function() {
  Module.initialized = false;
}

function addFailCb(callback) {
  let prev_callback = Module.onRuntimeFailed;
  Module.onRuntimeFailed = function () {
    prev_callback();
    callback();
  }
}

function addInitializationCb(callback) {
  let prev_callback = Module.onRuntimeInitialized
  Module.onRuntimeInitialized = function() {
    prev_callback()
    callback()
  }
}

function isInitialized() {
  return Module.initialized
}