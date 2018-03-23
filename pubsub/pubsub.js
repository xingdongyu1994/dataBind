window.onload = function() {
  var Pubsub = {}  //定义个发布者
  Pubsub.list = [] //存放队列
  //增加订阅
  Pubsub.subscrib = function(key, callback){
    if(!this.list[key]) {
      this.list[key] = []
    }
    this.list[key].push(callback)
  }
  //增加发布
  Pubsub.publish = function() {
    var key  = Array.prototype.shift.call(arguments) //得到key 
    var callbacks = this.list[key]
    if(!callbacks){
      return this
    }
    for(var i = 0,callback; callback = callbacks[i++];) {
      callback.apply(this,arguments)
    }
    return this
  }

  var Pubsubind = (function() {
    //keyup change 事件处理
    function  pageEvetHand(e) {
      var target = e.target
      var fullpropsname = target.getAttribute('t-binding')
      console.log("监听事件",fullpropsname)
      if(fullpropsname) {
        // 发送这个事件
        Pubsub.publish('ui-update-event',target.value)
      }
    }
    // keyup change 监听
    document.addEventListener('keydown',pageEvetHand)
    document.addEventListener('keyup',pageEvetHand)
    document.addEventListener('change',pageEvetHand)
    // //模型监听到数据
    Pubsub.subscrib('model-update-event',function( propvalue) {
      var elements = document.querySelectorAll('[t-binding="user.name"]')
      // console.log("法国红酒看",elements)
      for(var i=0; i<elements.length; i++) {
        var elementtype = elements[i].tagName.toLowerCase()
        if(elementtype === 'input') {
          elements[i].value = propvalue
        } else {
          elements[i].innerHTML = propvalue
        }
      }
    })
    return {
      // 模型来监听
      initUi :function(){
         var self = this
        //  self.modelName = modelName
        //  console.log("模型来订阅",self)
         Pubsub.subscrib('ui-update-event',function(value){
            self.updateModelinfo(value)
         })
         return this
      },
      updateModelinfo: function (propvalue){
        var self = this
        // console.log("了看脚后跟范德萨",self)
        // eval(this.modelName)['name'] = propvalue
        //模型监听到开始 发布信息
        // self.showInfoDate(propvalue)
        Pubsub.publish('model-update-event',propvalue)
      },
      initModel: function(initdata) {
        for(prop in initdata) {
          this.updateModelinfo(initdata[prop])
        }
      }
    }
  })()





  var pubsubind = Pubsubind.initUi()
  console.log("很过分的撒",pubsubind)
  //模型来改变数据
  pubsubind.initModel({
    'user.name':222222
  })

}