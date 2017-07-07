function Queue() {
  this.dataStore = [],
  this.enqueue = enqueue,
  this.dequeue = dequeue,
  this.front = front,
  this.back = back,
  this.empty = empty
}

//入队
function enqueue(e) {
  this.dataStore.push(e);
}

//出队
function dequeue() {
  return this.dataStore.shift();
}

function front() {
  return this.dataStore[0];
}

//取最后一个元素
function back() {
  return this.dataStore[this.dataStore.length - 1];
}

//判断是否为空
function empty() {
  if (this.dataStore.length == 0) {
    return true;
  } else {
    return false;
  }
}

//返回元素个数
function count() {
  return this.dataStore.length;
}

module.exports = {
  Queue: Queue
}
