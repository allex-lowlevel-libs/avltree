function Node(content){
  this.left = null;
  this.right = null;
  this.leftCount = 0;
  this.rightCount = 0;
  this.content = content;
}

Node.prototype.destroy = function(){
  this.content = null;
  this.leftCount = null;
  this.rightCount = null;
  this.right = null;
  this.left = null;
};

Node.prototype.returnOnRemove = function(){
  return this.content;
};

Node.prototype.apply = function(func,depth){
  return func(this.content,this,depth);
};

Node.prototype.advance = function(val){
  if (val === -1){
    return this.left;
  }
  if (val === 1){
    return this.right;
  }
  throw new Error('Invalid value' + val + '. -1 for left, 1 for right.');
};

Node.prototype.higherSubtreeRootLeft = function(){
  return (this.leftCount >= this.rightCount) ? this.left : this.right;
  /*
  if (this.leftCount >= this.rightCount){
    return this.left;
  }else{
    return this.right;
  }
  */
}

Node.prototype.higherSubtreeRootRight = function(){
  return (this.rightCount >= this.leftCount) ? this.right : this.left;
  /*
  if (this.rightCount >= this.leftCount){
    return this.right;
  }else{
    return this.left;
  }
  */
}

Node.prototype.higherSubtree = function(){
  return (this.leftCount >= this.rightCount ? this.leftCount : this.rightCount) + 1;
};

Node.prototype.findMax = function(stack){
  var curr = this;
  stack.addToFront(curr);
  while (curr.right){
    curr = curr.right;
    stack.addToFront(curr);
  }
  return curr;
};

Node.prototype.findMin = function(stack){
  var curr = this;
  stack.addToFront(curr);
  while (curr.left){
    curr = curr.left;
    stack.addToFront(curr);
  }
  return curr;
};

Node.prototype.absHeightDiff = function(){
  return Math.abs(this.leftCount - this.rightCount);
};

Node.prototype.rotateLeftLeft = function(prnt,leaf){
  this.left = leaf.right;
  if (this.left !== null){
    this.leftCount = this.left.higherSubtree();
  }else{
    this.leftCount = 0;
  }
  if (leaf.right !== null){
    //leaf.right.up = this;
  }
  leaf.right = this;
  //leaf.up = prnt;
  //this.up = leaf;
  leaf.rightCount = leaf.right.higherSubtree();
  if (prnt !== null){
    if (prnt.left === this){
      prnt.left = leaf;
      prnt.leftCount = prnt.left.higherSubtree();
    }else{
      prnt.right = leaf;
      prnt.rightCount = prnt.right.higherSubtree();
    }
  }
};

Node.prototype.rotateLeftRight = function(prnt,leaf,bottom){
  leaf.right = bottom.left;
  if (leaf.right !== null){
    leaf.rightCount = leaf.right.higherSubtree();
  }else{
    leaf.rightCount = 0;
  }
  if (bottom.left !== null){
    //bottom.left.up = leaf;
  }
  bottom.left = leaf;
  bottom.leftCount = bottom.left.higherSubtree();
  this.left = bottom;
  this.leftCount = this.left.higherSubtree();
  //bottom.up = this;
  //leaf.up = bottom;
  this.rotateLeftLeft(prnt,bottom);
};

Node.prototype.rotateRightRight = function(prnt,leaf){
  this.right = leaf.left;
  if (this.right !== null){
    this.rightCount = this.right.higherSubtree();
  }else{
    this.rightCount = 0;
  }
  if (leaf.left !== null){
    //leaf.left.up = this;
  }
  leaf.left = this;
  //leaf.up = prnt;
  //this.up = leaf;
  leaf.leftCount = leaf.left.higherSubtree();
  if (prnt !== null){
    if (prnt.left === this){
      prnt.left = leaf;
      prnt.leftCount = prnt.left.higherSubtree();
    }else{
      prnt.right = leaf;
      prnt.rightCount = prnt.right.higherSubtree();
    }
  }
};

Node.prototype.rotateRightLeft = function(prnt,leaf,bottom){
  leaf.left = bottom.right;
  if (leaf.left !== null){
    leaf.leftCount = leaf.left.higherSubtree();
  }else{
    leaf.leftCount = 0;
  }
  if (bottom.right !== null){
    //bottom.right.up = leaf;
  }
  bottom.right = leaf;
  bottom.rightCount = bottom.right.higherSubtree();
  this.right = bottom;
  this.rightCount = this.right.higherSubtree();
  //bottom.up = this;
  //leaf.up = bottom;
  this.rotateRightRight(prnt,bottom);
};

Node.prototype.contentToString = function(){
  return this.content.toString();
};

module.exports = Node;
