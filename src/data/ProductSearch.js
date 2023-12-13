export default class ProductSearch{
    constructor(item){
    const {label, thumb, tags, id, price} = item;

    this.id = id;
    this.images = [thumb];
    this.name = label;
    this.price = price;
    this.sale_price = price;

    this.on_sale = false;

    this.average_rating = 0;
    this.rating_count = 0;
    this.attributes = item.options  ? item.options.map( (option) => ({name : option.name, options: option.values})) : [];
    this.variants = item.variants;
    this.tags = tags;
    // console.log('item', item);
    // console.log(this);

    // console.log('item.selectedVariant', item.selectedVariant);
    // console.log('this.options',item, this.attributes, this.options);
  }
}