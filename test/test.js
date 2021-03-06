var expect = require('chai').expect,
  Checks = require('allex_checkslowlevellib'),
  DListBase = require('allex_doublelinkedlistbaselowlevellib'),
  Inherit = require('allex_inheritlowlevellib')(Checks.isFunction,Checks.isString).inherit,
  Avl = require('..')(DListBase,Inherit),
  TreeFactory = Avl.treeFactory,
  Node = Avl.Node;

function plainCompare(a,b){
  if(a===b){
    return 0;
  }
  if(a>b){
    return -1;
  }
  return 1;
}

function simpleNodeFactory(content){
  return new Node(content);
}

describe('Basic \'AVL tree\' lib testing', function(){
  it('Basic structure tests', function(){
    var AvlTree = TreeFactory(plainCompare,simpleNodeFactory);
    var Tree = new AvlTree();
    var first = Tree.add(1);
    var second = Tree.add(2);
    var third = Tree.add(3);
    expect(second.left).to.be.equal(first);
    expect(second.right).to.be.equal(third);
    Tree.destroy();
  });
  it('Purge', function(){
    var AvlTree = TreeFactory(plainCompare,simpleNodeFactory);
    var Tree = new AvlTree();
    var first = Tree.add(1);
    var second = Tree.add(2);
    var third = Tree.add(3);
    Tree.purge();
    expect(Tree.empty()).to.be.true;
  });
});

describe('Testing AVL structure (+100000 elements). Adding/Traversing/Destroying.', function(){
  it('Advanced structure tests', function(){
    var AvlTree = TreeFactory(plainCompare,simpleNodeFactory);
    var Tree = new AvlTree();
    var i;
    for (i=0; i<100000; i++){
      Tree.add(i);
    }
    Tree.traverseConditionally(function(content,node){
      if (node.absHeightDiff > 1) throw new Error('Corruputed AVL tree');
    });
    Tree.destroy();
  });
});

describe('Testing AVL structure (+100000 elements, -50000 elements). Adding/Removing/Traversing/Destroying.', function(){
  it('Advanced structure tests', function(){
    var AvlTree = TreeFactory(plainCompare,simpleNodeFactory);
    var Tree = new AvlTree();
    var i,elem;
    for (i=0; i<100000; i++){
      Tree.add(i);
    }
    for (i=0; i<50000; i++){
      Tree.remove(i);
    }
    Tree.traverseConditionally(function(content,node){
      if (node.absHeightDiff > 1) throw new Error('Corruputed AVL tree');
    });
    Tree.destroy();
  });
});

describe('Testing find/findOne functions of AVL tree (+100000 elements, -50000 elements).', function(){
  it('Advanced structure tests', function(){
    var AvlTree = TreeFactory(plainCompare,simpleNodeFactory);
    var Tree = new AvlTree();
    var i,content;
    function higherThan(limit,content,item){
      if (content > limit){
        return true;
      }
      return false;
    }
    for (i=0; i<100000; i++){
      Tree.add(i);
    }
    for (i=0; i<50000; i++){
      Tree.remove(i);
    }
    expect(Tree.find(66666)).not.to.be.null;
    expect(Tree.find(33333)).to.be.null;
    content = Tree.findOne(higherThan.bind(null,66666));
    expect(content).to.be.equal(66667);
    Tree.destroy();
  });
});
