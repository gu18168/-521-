function Marker() {
  this.dataStore = [],
  this.enqueue = enqueue,
  this.dequeue = dequeue,
  this.front = front,
  this.back = back,
  this.full = full,
  this.empty = empty,
  this.count = count,
  this.clear = clear
}

//入队
function enqueue(e) {
  this.dataStore.push(e);
}

//出队
function dequeue() {
  return this.dataStore.shift();
}

//取对首元素
function front() {
  return this.dataStore[0];
}

//取队尾元素
function back() {
  return this.dataStore[this.dataStore.length - 1];
}

//判断是否已满，最多10个
function full() {
  if (this.dataStore.length === 10) {
    return true;
  } else {
    return false;
  }
}

//判断是否为空
function empty() {
  if (this.dataStore.length === 0) {
    return true;
  } else {
    return false;
  }
}

function count() {
  return this.dataStore.length;
}

//清空队列
function clear() {
  this.dataStore = []
}

module.exports = {
  Marker: Marker
}
