function createTreeFactory(dlistbase, inherit) {
  var controllerFactory = require('./controllerfactorycreator')(require('./Stack.js')(dlistbase, inherit));
  return function createTreeKlass(compare,nodefactory){
    var controllerctor = controllerFactory(compare);
    function AvlTree(){
      this.root = null;
      this.count = 0;
      this.controller = new controllerctor(this);
    }

    AvlTree.prototype.destroy = function(){
      this.purge();
      this.count = null;
      this.root = null;
      if (this.controller) {
        this.controller.destroy();
      }
      this.controller = null;
    };

    function contentGetter(content,node){
      return content;
    }
    AvlTree.prototype.purge = function(){
      var nodes = [], _ns = nodes;
      this.controller.traverseInOrder(function (n) {_ns.push(n);});
      _ns = null;
      nodes.forEach(function (node) {node.destroy();});
      nodes = null;
      this.root = null;
    };

    AvlTree.prototype.count = function(){
      return this.count;
    }

    AvlTree.prototype.empty = function(){
      return this.count === 0;
    };

    AvlTree.prototype.add = function(){ //arguments are to be fed into nodefactory
      if (!this.controller) {
        return null;
      }
      var newItem = nodefactory.apply(null,arguments);//new nodector(content);
      this.controller.add(newItem);
      this.count++;
      return newItem;
    };

    //TODO private?
    AvlTree.prototype.decCount = function(){
      this.count--;
    };

    AvlTree.prototype.remove = function(content){
      if (!this.controller) {
        return null;
      }
      return this.controller.remove(content);
    };

    AvlTree.prototype.find = function(content){
      if (!this.controller) {
        return null;
      }
      return this.controller.find(content);
    };

    AvlTree.prototype.findOne = function(criterionfunction){
      if ('function' !== typeof criterionfunction){
        throw new Error('First parameter \'criterionfunction\' is not a function');
      }
      return this.firstItemToSatisfy(criterionfunction);
    };

    AvlTree.prototype.firstItemToSatisfyPreOrder = function(func){
      if (!this.controller) {
        return null;
      }
      return this.controller.firstItemToSatisfyPreOrder(func,this.root);
    };

    AvlTree.prototype.firstItemToSatisfy = function(func){
      if (!this.controller) {
        return null;
      }
      return this.controller.firstItemToSatisfyInOrder(func,this.root);
    };

    AvlTree.prototype.firstItemToSatisfyPostOrder = function(func){
      if (!this.controller) {
        return null;
      }
      return this.controller.firstItemToSatisfyPostOrder(func,this.root);
    };

    AvlTree.prototype.lastItemToSatisfyPreOrder = function(func){
      if (!this.controller) {
        return null;
      }
      return this.controller.lastItemToSatisfyPreOrder(func,this.root,null);
    };

    AvlTree.prototype.lastItemToSatisfy = function(func){
      if (!this.controller) {
        return null;
      }
      return this.controller.lastItemToSatisfyInOrder(func,this.root,null);
    };

    AvlTree.prototype.lastItemToSatisfyPostOrder = function(func){
      if (!this.controller) {
        return null;
      }
      return this.controller.lastItemToSatisfyPostOrder(func,this.root,null);
    };

    AvlTree.prototype.traverseInOrder = function(func){
      if (!this.controller) {
        return;
      }
      this.controller.traverseInOrder(func,this.root,0);
    };

    AvlTree.prototype.traversePreOrder= function(func){
      if (!this.controller) {
        return;
      }
      this.controller.traversePreOrder(func,this.root,0);
    }

    AvlTree.prototype.traversePostOrder= function(func){
      if (!this.controller) {
        return;
      }
      this.controller.traversePostOrder(func,this.root,0);
    }

    AvlTree.prototype.traverseInOrderConditionally = function(func){
      if (!this.controller) {
        return;
      }
      return this.controller.traverseInOrderConditionally(func,this.root,0);
    }

    AvlTree.prototype.traversePreOrderConditionally= function(func){
      if (!this.controller) {
        return;
      }
      return this.controller.traversePreOrderConditionally(func,this.root,0);
    }

    AvlTree.prototype.traversePostOrderConditionally= function(func){
      if (!this.controller) {
        return;
      }
      return this.controller.traversePostOrderConditionally(func,this.root,0);
    }

    AvlTree.prototype.dumpToConsole = function(func){
      console.log('\n-----------------------------------------------------------------\n');
      this.traverseInOrder(func||consoleTree);
    };

    function consoleTree(content,item,level){
      var s = '';
      for(var i=0; i<level; i++){
        s += '\t';
      }
      console.log(s+item.contentToString()+' ('+level+')');
    }

    /*
    function drainer(arry,countobj,content){
      arry[countobj.count] = content;
      countobj.count++;
    }

    AvlTree.prototype.drain = function(){
      var ret = new Array(this.length),countobj={count:0},_ret = ret;
      this.traverse(drainer.bind(null,_ret,countobj));
      _ret = null;
      this.purge();
      return ret;
    };
    */
    return AvlTree;
  }
}
module.exports = createTreeFactory;
