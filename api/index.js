const express = require('express');
const app = express();
const port = 8080;
const products = [];
for (let i = 1; i <= 100; i++) {
    products.push({id: i, categoryId: i, brandId: i, manufacturerId: i, name: "Product " + i, imageIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]});
}
app.get( "/products", ( req, res ) => {
    res.send(products);
} );
app.get( "/manufacturers/:id", ( req, res ) => {
    res.send({id: req.params.id, name: "Manufacturer " + req.params.id});
} );
app.get( "/brands/:id", ( req, res ) => {
    res.send({id: req.params.id, name: "Brand " + req.params.id});
} );
app.get( "/categories/:id", ( req, res ) => {
    res.send({id: req.params.id, name: "Category " + req.params.id});
} );
app.get( "/images/:id", ( req, res ) => {
    res.send({id: req.params.id, url: "https://picsum.photos/id/" + req.params.id + "/info"});
} );
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );