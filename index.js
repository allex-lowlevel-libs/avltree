function createAvlTree (dlistbase, inherit) {
  return {
    treeFactory: require('./treefactorycreator')(dlistbase, inherit),
    Node: require('./Node')
  }
}

module.exports = createAvlTree;
