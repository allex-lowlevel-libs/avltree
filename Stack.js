function createStack(doublelinkedlistbase, inherit) {
  'use strict';
  var ListItemCtor = doublelinkedlistbase.Item,
    ListMixin = doublelinkedlistbase.Mixin;

  function TreeBranchItem (content) {
    ListItemCtor.call(this, content);
  }
  inherit(TreeBranchItem, ListItemCtor);

  function TreeBranchStack(){
    ListMixin.call(this);
  }
  ListMixin.addMethods(TreeBranchStack);

  TreeBranchStack.prototype.addToFront = function(content){
    checkForTreeNode(content);
    var newItem = new TreeBranchItem(content);
    this.assureForController();
    this.controller.addToFront(newItem);
  };

  TreeBranchStack.prototype.addToBack = function(content){
    checkForTreeNode(content);
    this.assureForController();
    var newItem = new TreeBranchItem(content);
    this.controller.addToBack(newItem);
  };
  TreeBranchStack.prototype.push = TreeBranchStack.prototype.addToBack;

  TreeBranchStack.prototype.shift = function(){
    var ret, head;
    if (!this.head) {
      return;
    }
    ret = this.head.content;
    checkForTreeNode(ret);
    this.assureForController();
    head = this.head;
    this.controller.remove(this.head);
    head.destroy();
    return ret;
  };

  TreeBranchStack.prototype.addAsPrevTo = function (content, prevtarget) {
    this.assureForController();
    this.controller.addAsPrevTo(new TreeBranchItem(content), prevtarget);
  };

  TreeBranchStack.prototype.findOne = function(criterionfunction){
    var item = this.firstItemToSatisfy(criterionfunction);
    if(item){
      return item.content;
    }else{
      return;
    }
  };

  function checkForTreeNode(ret) {
    if (!ret.hasOwnProperty('left')) {
      console.trace();
      console.error(ret);
      process.exit(0);
    }
  }
  return TreeBranchStack;
}

module.exports = createStack;
