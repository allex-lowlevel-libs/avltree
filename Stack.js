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
    if (!checkForTreeNode(content)) {
      return;
    }
    var newItem = new TreeBranchItem(content);
    this.assureForController();
    this.controller.addToFront(newItem);
  };

  TreeBranchStack.prototype.addToBack = function(content){
    var newItem;
    if (!checkForTreeNode(content)) {
      return;
    }
    if (!this.assureForController()) {
      return;
    }
    newItem = new TreeBranchItem(content);
    this.controller.addToBack(newItem);
  };
  TreeBranchStack.prototype.push = TreeBranchStack.prototype.addToBack;

  TreeBranchStack.prototype.shift = function(){
    var ret, head;
    if (!this.head) {
      return;
    }
    if (!this.assureForController()) {
      return;
    }
    ret = this.head.content;
    if (!checkForTreeNode(ret)) {
      return;
    }
    head = this.head;
    this.controller.remove(this.head);
    head.destroy();
    return ret;
  };

  TreeBranchStack.prototype.addAsPrevTo = function (content, prevtarget) {
    if (!this.assureForController()) {
      return;
    }
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
    if (!(ret && ret.hasOwnProperty('left'))) {
      console.trace();
      console.error(ret);
      return false;
    }
    return true;
  }
  return TreeBranchStack;
}

module.exports = createStack;
