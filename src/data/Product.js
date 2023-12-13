export default class Product {
    constructor(item) {
        try {
            const {
                compareAtPrice
            } = item;

            return {
                ...item,
                name: item.title,
                average_rating: 0,
                rating_count: 0,
                attributes: item.options ? item.options.map((option) => ({
                    name: option.name,
                    options: option.values
                })) : []
            }

        } catch (error) {
            console.error(error)
        }
    }
}
