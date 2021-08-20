module.exports = {
  addControl(products, consignee, owner) {
    if (!products || !consignee || !owner) {
      return false;
    }
    return true;
  },
};
