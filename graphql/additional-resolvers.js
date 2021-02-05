const resolvers = {
    MyProduct: {
        brand: async (root, args, { ProductApi }) => {
            return await ProductApi.api.getBrandById({id: root.brandId});
        },
        manufacturer: async (root, args, { ProductApi }) => {
            return await ProductApi.api.getManufacturerById({id: root.manufacturerId});
        },
        category: async (root, args, { ProductApi }) => {
            return await ProductApi.api.getCategoryById({id: root.categoryId});
        },
        images: async (root, args, { ProductApi }) => {
            return await Promise.all(root.imageIds.map(id => ProductApi.api.getImageById({id: id})));
        },
    }
};

module.exports = { resolvers };