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
      this.controller.destroy();
      this.controller = null;
    };

    function contentGetter(content,node){
      return content;
    }
    AvlTree.prototype.purge = function(){
      var name;
      while(name === this.traverseConditionally(contentGetter)){
        this.remove(name);
      }
    };

    AvlTree.prototype.count= function(){
      return this.count;
    }

    AvlTree.prototype.empty = function(){
      return this.count== 0;
    };

    AvlTree.prototype.add = function(){ //arguments are to be fed into nodefactory
      var newItem = nodefactory.apply(null,arguments);//new nodector(content);
      this.controller.add(newItem);
      this.count++;
      return newItem;
    };

    AvlTree.prototype.decCount = function(){
      this.count--;
    };

    AvlTree.prototype.remove = function(item){
      if (!this.root){
        return null;
      }
      return this.controller.remove(item);
    };

    AvlTree.prototype.find = function(content){
      return this.controller.find(content);
    };

    AvlTree.prototype.findOne = function(criterionfunction){
      var item = this.firstItemToSatisfy(criterionfunction);
      if(item){
        return item.content;
      }
    };

    AvlTree.prototype.firstItemToSatisfyPreOrder = function(func){
      return this.controller.firstItemToSatisfyPreOrder(func,this.root);
    };

    AvlTree.prototype.firstItemToSatisfy = function(func){
      return this.controller.firstItemToSatisfyInOrder(func,this.root);
    };

    AvlTree.prototype.firstItemToSatisfyPostOrder = function(func){
      return this.controller.firstItemToSatisfyPostOrder(func,this.root);
    };

    AvlTree.prototype.lastItemToSatisfyPreOrder = function(func){
      return this.controller.lastItemToSatisfyPreOrder(func,this.root,null);
    };

    AvlTree.prototype.lastItemToSatisfy = function(func){
      return this.controller.lastItemToSatisfyInOrder(func,this.root,null);
    };

    AvlTree.prototype.lastItemToSatisfyPostOrder = function(func){
      return this.controller.lastItemToSatisfyPostOrder(func,this.root,null);
    };

    AvlTree.prototype.traverseInOrder = function(func){
      this.controller.traverseInOrder(func,this.root,0);
    }

    AvlTree.prototype.traverse = AvlTree.prototype.traverseInOrder;

    AvlTree.prototype.traversePreOrder= function(func){
      this.controller.traversePreOrder(func,this.root,0);
    }

    AvlTree.prototype.traversePostOrder= function(func){
      this.controller.traversePostOrder(func,this.root,0);
    }

    AvlTree.prototype.traverseInOrderConditionally = function(func){
      return this.controller.traverseInOrderConditionally(func,this.root,0);
    }

    AvlTree.prototype.traverseConditionally = AvlTree.prototype.traverseInOrderConditionally;

    AvlTree.prototype.traversePreOrderConditionally= function(func){
      return this.controller.traversePreOrderConditionally(func,this.root,0);
    }

    AvlTree.prototype.traversePostOrderConditionally= function(func){
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

    function drainer(arry,countobj,content){
      arry[countobj.count] = content;
      countobj.count++;
    }

    AvlTree.prototype.drain = function(){
      var ret = new Array(this.length),countobj={count:0};
      this.traverse(drainer.bind(null,ret,countobj));
      this.purge();
      return ret;
    };
    return AvlTree;
  }
}
module.exports = createTreeFactory;
