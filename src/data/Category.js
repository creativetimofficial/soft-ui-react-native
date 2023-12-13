export default class Category {
  constructor(item) {
    const { title, image } = item;

    return {
      ...item,
      image: image != null && image.src,
      name: title
    }
  }
}
