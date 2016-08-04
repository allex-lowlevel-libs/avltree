function createAvlTreeControllerFactory(Stack) {
  'use strict';
  return function createAvlTreeController(compare){
    //TODO check if compare is a function??
    function AvlTreeController(myTree){
      this.tree = myTree;
    }

    AvlTreeController.prototype.destroy = function(){
      this.tree = null;
    };

    AvlTreeController.prototype.remove = function(content){
      if (typeof content !== 'number' && !content){
        return false;
      }
      var prevStack = this.prevStackToEqual(content);
      if(!prevStack){
        return false;
      }
      var leaf = prevStack.shift()||null;
      var oldHeight = 0;
      var higher = null;
      var newHeight = 0;
      var high,middle,low;
      var balanceInd = false;
      var ret;
      //1. case - No children
      if (leaf.left === null && leaf.right === null){
        higher = prevStack.shift()||null;
        if (higher === null){
          this.tree.root = null;
          this.tree.decCount();
          ret = leaf.returnOnRemove();
          leaf.destroy();
          prevStack.destroy();
          return ret;
        }else{
          oldHeight = higher.higherSubtree();
          if (higher.left === leaf){
            higher.left = null;
            higher.leftCount--;
            high = higher;
            middle = higher.right;
            if (!!middle){
              low = middle.higherSubtreeRootLeft();
            }else{
              low = null;
            }
          }else{
            higher.right = null;
            higher.rightCount--;
            high = higher;
            middle = higher.left;
            if (!!middle){
              low = middle.higherSubtreeRootRight();
            }else{
              low = null;
            }
          }
          newHeight = higher.higherSubtree();
          balanceInd = balanceInd || (higher.absHeightDiff() === 2);
        }
      }else{
        if (leaf.left === null || leaf.right === null){
          higher = prevStack.shift()||null;
          if (higher !== null){
            oldHeight = higher.higherSubtree();
          }
          //2.1 case - 1 child - Left
          if (leaf.left !== null && leaf.right === null){
            if (higher !== null){
              if (higher.left === leaf){
                higher.left = leaf.left;
                higher.leftCount--;
                high = higher;
                middle = higher.right;
                if (!!middle){
                  low = middle.higherSubtreeRootLeft();
                }else{
                  low = null;
                }
              }else{
                higher.right = leaf.left;
                higher.rightCount--;
                high = higher;
                middle = higher.left;
                if (!!middle){
                  low = middle.higherSubtreeRootRight();
                }else{
                  low = null;
                }
              }
              newHeight = higher.higherSubtree();
              balanceInd = balanceInd || (higher.absHeightDiff() === 2);
            }else{
              this.tree.root = leaf.left;
              newHeight = 0;
            }
          }else{
            //2.2 case - 1 child - Right
            if (leaf.left === null && leaf.right !== null){
              if (higher !== null){
                if (higher.left === leaf){
                  higher.left = leaf.right;
                  higher.leftCount--;
                  high = higher;
                  middle = higher.right;
                  if (!!middle){
                    low = middle.higherSubtreeRootLeft();
                  }else{
                    low = null;
                  }
                }else{
                  higher.right = leaf.right;
                  higher.rightCount--;
                  high = higher;
                  middle = higher.left;
                  if (!!middle){
                    low = middle.higherSubtreeRootRight();
                  }else{
                    low = null;
                  }
                }
                newHeight = higher.higherSubtree();
                balanceInd = balanceInd || (higher.absHeightDiff() === 2);
              }else{
                this.tree.root = leaf.right;
                newHeight = 0;
              }
            }
          }
        }else{
          //3 case - 2 children
          var leafParent = prevStack.head;
          leaf.right.findMin(prevStack);
          var max = prevStack.shift()||null;
          var maxParent = prevStack.shift()||null;
          if (maxParent === null){
            oldHeight = leaf.higherSubtree();
            max.left = leaf.left;
            max.leftCount = max.left.higherSubtree();
            high = max;
            middle = max.left;
            low = middle.higherSubtreeRootRight();
            balanceInd = balanceInd || (max.absHeightDiff() === 2);
            newHeight = leaf.higherSubtree();
          }else{
            oldHeight = maxParent.higherSubtree();
            if (maxParent.left === max){
              maxParent.left = max.right;
              maxParent.leftCount--;
              max.left = leaf.left;
              max.leftCount = max.left.higherSubtree();
              if (leaf.right !== max){
                max.right = leaf.right;
                max.rightCount = max.right.higherSubtree();
              }
              high = maxParent;
              middle = maxParent.right;
              if (!!middle){
                low = middle.higherSubtreeRootLeft();
              }else{
                low = null;
              }
              if (leafParent !== null){
                prevStack.addAsPrevTo(max, leafParent);
                //leafParent.insertBefore(max,prevStack);
                higher = leafParent.content;
                if (higher.left === leaf){
                  higher.left = max;
                }else{
                  higher.right = max;
                }
              }else{
                prevStack.addToBack(max);
              }
              balanceInd = balanceInd || (maxParent.absHeightDiff() === 2);
            }else{
              max.left = leaf.left;
              max.leftCount = max.left.higherSubtree();
              if (leaf.right !== max){
                max.right = leaf.right;
                max.rightCount = max.right.higherSubtree();
              }
              if (maxParent.left === leaf){
                maxParent.left = max;
                maxParent.leftCount = maxParent.left.higherSubtree();
              }else{
                maxParent.right = max;
                maxParent.rightCount = maxParent.right.higherSubtree();
              }
              high = max;
              middle = max.left;
              if (!!middle){
                low = middle.higherSubtreeRootRight();
              }else{
                low = null;
              }
              prevStack.addToFront(maxParent);
              balanceInd = balanceInd || (max.absHeightDiff() === 2) || (maxParent.absHeightDiff() === 2);
            }
            newHeight = maxParent.higherSubtree();
          }
          if (leaf === this.tree.root){
            this.tree.root = max;
          }
        }
      }
      this.tree.decCount();
      if (oldHeight !== newHeight || !!balanceInd){
        this.doBalanceRemove(high,middle,low,prevStack);
      }
      ret = leaf.returnOnRemove();
      leaf.destroy();
      prevStack.destroy();
      return ret;
    };

    AvlTreeController.prototype.add = function(newItem){
      if (!newItem){
        return;
      }
      var prevStack = this.prevStackToLeaf(newItem.content);
      var leaf = prevStack.shift()||null;
      if (leaf === null){
        this.tree.root = newItem;
        prevStack.destroy();
        return;
      }else{
        var res = compare(leaf.content,newItem.content);
        //newItem.up = leaf;
        if (res===0){
          console.trace();
          prevStack.destroy();
          throw new Error('Items must have unique content ' + JSON.stringify(content) + ' is not unique.');
        }
        if (res===-1){
          leaf.left = newItem;
          leaf.leftCount++;
        }else{
          leaf.right = newItem;
          leaf.rightCount++;
        }
      }
      var higher = prevStack.shift()||null;
      var bottom = newItem;
      if (leaf.leftCount !== leaf.rightCount){
        this.doBalanceAdd(higher,leaf,bottom,prevStack);
      }
      prevStack.destroy();
    };

    AvlTreeController.prototype.doBalanceAdd = function(higher,leaf,bottom,prevStack){
      var tmp;
      while (higher){
        var prnt = prevStack.shift()||null;
        if (higher.left === leaf){
          higher.leftCount = leaf.higherSubtree();
          if (higher.leftCount === higher.rightCount){
            break;
          }
          if (higher.leftCount - higher.rightCount === 2){
            if (leaf.leftCount - leaf.rightCount >= 0){
              higher.rotateLeftLeft(prnt,leaf);
              if (prnt === null){
                this.tree.root = leaf;
              }
              tmp = higher;
              higher = leaf;
              leaf = bottom;
              bottom = tmp;
            }else{
              higher.rotateLeftRight(prnt,leaf,bottom);
              if (prnt === null){
                this.tree.root = bottom;
              }
              tmp = higher;
              higher = bottom;
              leaf = bottom;
              bottom = tmp;
            }
          }
        }else{
          higher.rightCount = leaf.higherSubtree();
          if (higher.leftCount === higher.rightCount){
            break;
          }
          if (higher.leftCount - higher.rightCount === -2){
            if (leaf.leftCount - leaf.rightCount <= 0){
              higher.rotateRightRight(prnt,leaf);
              if (prnt === null){
                this.tree.root = leaf;
              }
              tmp = higher;
              higher = leaf;
              leaf = bottom;
              bottom = tmp;
            }else{
              higher.rotateRightLeft(prnt,leaf,bottom);
              if (prnt === null){
                this.tree.root = bottom;
              }
              tmp = higher;
              higher = bottom;
              leaf = bottom;
              bottom = tmp;
            }
          }
        }
        bottom = leaf;
        leaf = higher;
        higher = prnt;
      }
    };

    AvlTreeController.prototype.doBalanceRemove = function(higher,leaf,bottom,prevStack){
      var tmp;
      while (higher){
        var prnt = prevStack.shift()||null;
        if (!!leaf){
          if (higher.right === leaf){
            higher.leftCount = !!higher.left ? higher.left.higherSubtree() : 0;
            if (higher.leftCount + 1 === higher.rightCount){
              break;
            }
            if (higher.leftCount - higher.rightCount === -2){
              if (leaf.leftCount - leaf.rightCount <= 0){
                higher.rotateRightRight(prnt,leaf);
                if (prnt === null){
                  this.tree.root = leaf;
                }
                tmp = higher;
                higher = leaf;
                leaf = bottom;
                bottom = tmp;
              }else{
                higher.rotateRightLeft(prnt,leaf,bottom);
                if (prnt === null){
                  this.tree.root = bottom;
                }
                tmp = higher;
                higher = bottom;
                leaf = bottom;
                bottom = tmp;
              }
            }
          }else{
            higher.rightCount = !!higher.right ? higher.right.higherSubtree() : 0;
            if (higher.leftCount === higher.rightCount + 1){
              break;
            }
            if (higher.leftCount - higher.rightCount === 2){
              if (leaf.leftCount - leaf.rightCount >= 0){
                higher.rotateLeftLeft(prnt,leaf);
                if (prnt === null){
                  this.tree.root = leaf;
                }
                tmp = higher;
                higher = leaf;
                leaf = bottom;
                bottom = tmp;
              }else{
                higher.rotateLeftRight(prnt,leaf,bottom);
                if (prnt === null){
                  this.tree.root = bottom;
                }
                tmp = higher;
                higher = bottom;
                leaf = bottom;
                bottom = tmp;
              }
            }
          }
        }
        if (!!prnt){
          if (prnt.left === higher){
            leaf = prnt.right;
            bottom = leaf.higherSubtreeRootLeft();
          }else{
            leaf = prnt.left;
            if (!(leaf && leaf.higherSubtreeRootRight)) {
              console.trace();
              console.log(prnt);
              process.exit(0);
            }
            bottom = leaf.higherSubtreeRootRight();
          }
        }
        higher = prnt;
      }
    };

    AvlTreeController.prototype.prevStackToLeaf = function(content){
      var curr = this.tree.root;
      var prevStack = new Stack();
      var res;
      while (curr !== null){
        res = compare(curr.content,content);
        if (res === 0){
          console.trace();
          prevStack.destroy();
          throw Error('Items must have unique content ' + JSON.stringify(content) + ' is not unique.');
        }
        prevStack.addToFront(curr);
        curr = curr.advance(res);
      }
      return prevStack;
    };

    AvlTreeController.prototype.prevStackToEqual = function(content){
      var curr = this.tree.root;
      var prevStack = new Stack();
      var res;
      while (curr !== null){
        prevStack.addToFront(curr);
        res = compare(curr.content,content);
        if (res === 0){
          return prevStack;
        }
        curr = curr.advance(res);
      }
      prevStack.destroy();
      /*
      console.trace();
      throw Error('Item with content ' + JSON.stringify(content) + ' does not exist.');
      */
      return;
    }

    AvlTreeController.prototype.find = function(content){
      var curr = this.tree.root;
      var res;
      while (curr){
        res = compare(curr.content,content);
        if (res === 0){
          return curr;
        }
        curr = curr.advance(res);
      }
      return null;
    };

    AvlTreeController.prototype.firstItemToSatisfyPreOrder = function(func, node){
      if (!node) return null;
      var check = node.apply(func);
      if ('boolean' !== typeof check){
        throw Error('func needs to return a boolean value');
      }
      if (!!check){
        return node.content;
      }
      var ret = this.firstItemToSatisfyPreOrder(func,node.left);
      if (!!ret) return ret;
      ret = this.firstItemToSatisfyPreOrder(func,node.right);
      if (!!ret) return ret;
    };

    AvlTreeController.prototype.firstItemToSatisfyInOrder = function(func, node){
      if (!node) return null;
      var ret = this.firstItemToSatisfyInOrder(func,node.left);
      if (!!ret) return ret;
      var check = node.apply(func);
      if ('boolean' !== typeof check){
        throw Error('func needs to return a boolean value');
      }
      if (!!check){
        return node.content;
      }
      ret = this.firstItemToSatisfyInOrder(func,node.right);
      if (!!ret) return ret;
    };

    AvlTreeController.prototype.firstItemToSatisfyPostOrder = function(func, node){
      if (!node) return null;
      var ret = this.firstItemToSatisfyPostOrder(func,node.left);
      if (!!ret) return ret;
      ret = this.firstItemToSatisfyPostOrder(func,node.right);
      if (!!ret) return ret;
      var check = node.apply(func);
      if ('boolean' !== typeof check){
        throw Error('func needs to return a boolean value');
      }
      if (!!check){
        return node.content;
      }
    };

    AvlTreeController.prototype.lastItemToSatisfyPreOrder = function(func,node,prev){
      if (!node) return null;
      var check = node.apply(func);
      if ('boolean' !== typeof check){
        throw Error('func needs to return a boolean value');
      }
      if (!check){
        return !!prev ? prev.content : null;
      }
      var ret = this.lastItemToSatisfyPreOrder(func,node.left,node);
      if (!!ret) return ret;
      ret = this.lastItemToSatisfyPreOrder(func,node.right,node);
      if (!!ret) return ret;
      return null;
    };

    AvlTreeController.prototype.lastItemToSatisfyInOrder = function(func,node,prev){
      if (!node) return null;
      var ret = this.lastItemToSatisfyInOrder(func,node.left,node);
      if (!!ret) return ret;
      var check = node.apply(func);
      if ('boolean' !== typeof check){
        throw Error('func needs to return a boolean value');
      }
      if (!check){
        return !!prev ? prev.content : null;
      }
      ret = this.lastItemToSatisfyInOrder(func,node.right,node);
      if (!!ret) return ret;
      return null;
    };

    AvlTreeController.prototype.lastItemToSatisfyPostOrder = function(func,node,prev){
      if (!node) return null;
      var ret = this.lastItemToSatisfyPostOrder(func,node.left,node);
      if (!!ret) return ret;
      ret = this.lastItemToSatisfyPostOrder(func,node.right,node);
      if (!!ret) return ret;
      var check = node.apply(func);
      if ('boolean' !== typeof check){
        throw Error('func needs to return a boolean value');
      }
      if (!check){
        return !!prev ? prev.content : null;
      }
      return null;
    };

    AvlTreeController.prototype.traversePreOrder = function(func, node, depth){
      if (!node) return;
      node.apply(func,depth);
      this.traversePreOrder(func,node.left,depth+1);
      this.traversePreOrder(func,node.right,depth+1);
    };
    AvlTreeController.prototype.traversePreOrderConditionally = function(func, node, depth){
      if (!node) return;
      var ret = node.apply(func,depth);
      if(typeof ret !== 'undefined'){
        return ret;
      }
      ret = this.traversePreOrderConditionally(func,node.left,depth+1);
      if(typeof ret !== 'undefined'){
        return ret;
      }
      return this.traversePreOrderConditionally(func,node.right,depth+1);
    };

    AvlTreeController.prototype.traverseInOrder = function(func, node, depth){
      if (!node) return;
      this.traverseInOrder(func,node.left,depth+1);
      node.apply(func,depth);
      this.traverseInOrder(func,node.right,depth+1);
    };

    AvlTreeController.prototype.traverseInOrderConditionally = function(func, node, depth){
      if (!node) return;
      var ret = this.traverseInOrderConditionally(func,node.left,depth+1);
      if(typeof ret !== 'undefined'){
        return ret;
      }
      ret = node.apply(func,depth);
      if(typeof ret !== 'undefined'){
        return ret;
      }
      return this.traverseInOrderConditionally(func,node.right,depth+1);
    };

    AvlTreeController.prototype.traversePostOrder = function(func, node, depth){
      if (!node) return;
      this.traversePostOrder(func,node.left,depth+1);
      this.traversePostOrder(func,node.right,depth+1);
      node.apply(func,depth);
    };
    
    AvlTreeController.prototype.traversePostOrderConditionally = function(func, node, depth){
      if (!node) return;
      var ret = this.traversePostOrderConditionally(func,node.left,depth+1);
      if(typeof ret !== 'undefined'){
        return ret;
      }
      ret = this.traversePostOrderConditionally(func,node.right,depth+1);
      if(typeof ret !== 'undefined'){
        return ret;
      }
      return node.apply(func,depth);
    };
    return AvlTreeController;
  }
}

module.exports = createAvlTreeControllerFactory;
