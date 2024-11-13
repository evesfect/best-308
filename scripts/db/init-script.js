db = db.getSiblingDB("e-commerce");

const currentdate = new Date();


db.createUser({
    user: "project-user",
    pwd: "308user",
    roles: [
        {
            role: "dbOwner",
            db: "e-commerce"
        }
    ]
});

db.user.insertOne({
    _id: ObjectId("112c6359345678f123456789"),
    username: "semih",
    email: "semih.dogan1@sabanciuniv.edu",
    password: "$2a$12$387ejKh.i5bp9yvPGP5REe4gbs/.rO/CtSRc2tDUhl/aWEbTgWkQa", //ruhi123
    role: "customer",
});

db.user.insertOne({
    _id: ObjectId("212c6359345678f123456789"),
    username: "ege",
    email: "ege.yurtsever@sabanciuniv.edu",
    password: "$2a$12$.IEn8URXSN7e5rJK1lC4zO72b3ASTbnnuruR3uU9eDjZUW8M0dgji", //scrummaster
    role: "product_manager"
})

db.user.insertOne({
    _id: ObjectId("312c6359345678f123456789"),
    username: "burak",
    email: "burak.ala@sabanciuniv.edu",
    password: "$2a$12$W7twF3dovlFND/5pCzrase/CLZOtKdxxqQpy.SJe51qY4GRF90r1e", //etikaramgurme
    role: "product_manager",
});

db.user.insertOne({
    _id: ObjectId("412c6359345678f123456789"),
    username: "pome",
    email: "baris.pome@sabanciuniv.edu",
    password: "$2a$12$I6EzLahje5dV2WNMzlaDe.oEtcpDgQi10he/jEf4kUbh/AnLQk5Im", //teatalks
    role: "sales_manager",
});

db.user.insertOne({
    _id: ObjectId("512c6359345678f123456789"),
    username: "tolga",
    email: "tolga.tektunali@sabanciuniv.edu",
    password: "$2a$12$zruDtXPYTJAWs4T/EcXol.hilG/4Z/ymO0SqWy5dB8KEwdUPL.mc.", //308tolga
    role: "admin"
})

db.user.insertOne({
    _id: ObjectId("612c6359345678f123456789"),
    username: "eren",
    email: "eeren@sabanciuniv.edu",
    password: "$2a$12$71AddlKXdl79mYWhIzxG7uwBIIcuTfcyf3EP5wH2PeK.vZx70qBFi", //308eren
    role: "customer"
})
db.product.insertOne({
    _id: ObjectId("122c6359345678f123456789"),
    name: "oxford shirt",
    description: "A boxy fit shirt made from tightly woven cotton fabric. It features long sleeves with buttoned cuffs, a collared neckline, and a patch pocket on the chest. The front is buttoned for closure.",
    sex: "unisex",
    category: "shirt",
    costPrice: 20.00,
    salePrice: 39.99,
    total_stock: {
        "XS": 5,
        "S": 25,
        "M": 25,
        "L": 25,
        "XL": 20
    },
    available_stock: {
        "XS": 2,
        "S": 25,
        "M": 24,
        "L": 24,
        "XL": 20
    },
    inStock: true,
    quantity: 96,
    imageId: "192c6359345678f123456789",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["white", "blue"]
});

db.product.insertOne({
    _id: ObjectId("222c6359345678f123456789"),
    name: "straight fit jean",
    description: "A straight fit pant made from a blend of linen and cotton. It features front pockets, back patch pockets, and a front zipper with a button closure.",
    sex: "unisex",
    category: "jean",
    costPrice: 50.00,
    salePrice: 79.99,
    total_stock: {
        "XS": 2,
        "S": 4,
        "M": 3,
        "L": 4,
        "XL": 1
    },
    available_stock: {
        "XS": 2,
        "S": 4,
        "M": 3,
        "L": 3,
        "XL": 0
    },
    inStock: true,
    quantity: 14,
    imageId: "292c6359345678f123456789",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["denim blue"]
});

db.product.insertOne({
    _id: ObjectId("322c6359345678f123456789"),
    name: "faux suede bomber jacket pome pome",
    description: "Regular fit bomber jacket made of faux suede fabric, padded on the inside. Features a ribbed elastic collar, long sleeves, welt pockets at the hip and an inside pocket detail. Ribbed trims. Zip-up front.",
    sex: "unisex",
    category: "jacket",
    costPrice: 35.00,
    salePrice: 59.99,
    total_stock: {
        "S": 15,
        "M": 10,
        "L": 12
    },
    available_stock: {
        "S": 14,
        "M": 9,
        "L": 11
    },
    inStock: true,
    quantity: 37,
    imageId: "392c6359345678f123456789",
    sizes: ["S", "M", "L"],
    colors: ["brown"]
});

db.product.insertOne({
    _id: ObjectId("322c6359345678f123456790"),
    name: "cotton crew neck t-shirt",
    description: "Classic fit t-shirt made from soft, breathable cotton. Features a crew neckline and short sleeves.",
    sex: "unisex",
    category: "t-shirt",
    costPrice: 10.00,
    salePrice: 19.99,
    total_stock: {
        "S": 25,
        "M": 30,
        "L": 20
    },
    available_stock: {
        "S": 23,
        "M": 29,
        "L": 18
    },
    inStock: true,
    quantity: 75,
    imageId: "492c6359345678f123456790",
    sizes: ["S", "M", "L"],
    colors: ["white", "black", "gray"]
});

db.product.insertOne({
    _id: ObjectId("322c6359345678f123456791"),
    name: "slim fit denim jeans",
    description: "Slim fit jeans crafted from stretchable denim fabric. Features a classic 5-pocket design and zip fly with button closure.",
    sex: "male",
    category: "jeans",
    costPrice: 30.00,
    salePrice: 49.99,
    total_stock: {
        "S": 10,
        "M": 15,
        "L": 12
    },
    available_stock: {
        "S": 9,
        "M": 14,
        "L": 11
    },
    inStock: true,
    quantity: 37,
    imageId: "592c6359345678f123456791",
    sizes: ["S", "M", "L"],
    colors: ["denim blue"]
});

db.product.insertOne({
    _id: ObjectId("322c6359345678f123456792"),
    name: "wool blend overcoat",
    description: "Elegant overcoat made from a wool blend. Features a notched lapel, button closure, and two front pockets.",
    sex: "unisex",
    category: "coat",
    costPrice: 80.00,
    salePrice: 120.00,
    total_stock: {
        "S": 8,
        "M": 6,
        "L": 10
    },
    available_stock: {
        "S": 7,
        "M": 6,
        "L": 9
    },
    inStock: true,
    quantity: 22,
    imageId: "692c6359345678f123456792",
    sizes: ["S", "M", "L"],
    colors: ["black", "gray"]
});

db.product.insertOne({
    _id: ObjectId("322c6359345678f123456793"),
    name: "athletic running shorts",
    description: "Breathable and lightweight running shorts with an elastic waistband and inner lining for comfort. Features a zip pocket at the back.",
    sex: "unisex",
    category: "shorts",
    costPrice: 15.00,
    salePrice: 29.99,
    total_stock: {
        "S": 12,
        "M": 18,
        "L": 20
    },
    available_stock: {
        "S": 12,
        "M": 16,
        "L": 19
    },
    inStock: true,
    quantity: 47,
    imageId: "792c6359345678f123456793",
    sizes: ["S", "M", "L"],
    colors: ["black", "blue"]
});

db.product.insertOne({
    _id: ObjectId("322c6359345678f123456794"),
    name: "leather biker jacket",
    description: "Genuine leather biker jacket featuring a classic asymmetrical zip closure, zippered cuffs, and multiple pockets.",
    sex: "male",
    category: "jacket",
    costPrice: 150.00,
    salePrice: 199.99,
    total_stock: {
        "S": 8,
        "M": 12,
        "L": 6
    },
    available_stock: {
        "S": 7,
        "M": 11,
        "L": 6
    },
    inStock: true,
    quantity: 24,
    imageId: "892c6359345678f123456794",
    sizes: ["S", "M", "L"],
    colors: ["black"]
});

db.product.insertOne({
    _id: ObjectId("322c6359345678f123456795"),
    name: "cotton cargo pants",
    description: "Relaxed fit cargo pants made from durable cotton. Features multiple pockets, a drawstring waist, and elastic cuffs.",
    sex: "unisex",
    category: "pants",
    costPrice: 30.00,
    salePrice: 45.99,
    total_stock: {
        "S": 15,
        "M": 18,
        "L": 14
    },
    available_stock: {
        "S": 13,
        "M": 16,
        "L": 13
    },
    inStock: true,
    quantity: 42,
    imageId: "992c6359345678f123456795",
    sizes: ["S", "M", "L"],
    colors: ["khaki", "olive"]
});

db.product.insertOne({
    _id: ObjectId("322c6359345678f123456796"),
    name: "linen button-down shirt",
    description: "Lightweight linen shirt with a button-down front. Features a spread collar and long sleeves.",
    sex: "unisex",
    category: "shirt",
    costPrice: 20.00,
    salePrice: 39.99,
    total_stock: {
        "S": 10,
        "M": 20,
        "L": 18
    },
    available_stock: {
        "S": 9,
        "M": 18,
        "L": 16
    },
    inStock: true,
    quantity: 43,
    imageId: "092c6359345678f123456796",
    sizes: ["S", "M", "L"],
    colors: ["white", "blue"]
});

db.product.insertOne({
    _id: ObjectId("322c6359345678f123456797"),
    name: "knit sweater",
    description: "Cozy knit sweater featuring a round neckline and ribbed trims. Made from soft acrylic wool blend.",
    sex: "unisex",
    category: "sweater",
    costPrice: 20.00,
    salePrice: 34.99,
    total_stock: {
        "S": 12,
        "M": 14,
        "L": 10
    },
    available_stock: {
        "S": 11,
        "M": 12,
        "L": 9
    },
    inStock: true,
    quantity: 32,
    imageId: "192c6359345678f123456797",
    sizes: ["S", "M", "L"],
    colors: ["gray", "navy"]
});

db.product.insertOne({
    _id: ObjectId("322c6359345678f123456798"),
    name: "puffer vest",
    description: "Water-resistant puffer vest with lightweight insulation. Features a zip-up front and two side pockets.",
    sex: "unisex",
    category: "vest",
    costPrice: 40.00,
    salePrice: 59.99,
    total_stock: {
        "S": 5,
        "M": 8,
        "L": 7
    },
    available_stock: {
        "S": 4,
        "M": 7,
        "L": 6
    },
    inStock: true,
    quantity: 17,
    imageId: "292c6359345678f123456798",
    sizes: ["S", "M", "L"],
    colors: ["black", "green"]
});

db.product.insertOne({
    _id: ObjectId("322c6359345678f123456799"),
    name: "graphic print hoodie",
    description: "Relaxed fit hoodie with a front kangaroo pocket and graphic print on the back. Made from a cotton-poly blend.",
    sex: "unisex",
    category: "hoodie",
    costPrice: 30.00,
    salePrice: 49.99,
    total_stock: {
        "S": 20,
        "M": 25,
        "L": 30
    },
    available_stock: {
        "S": 19,
        "M": 24,
        "L": 29
    },
    inStock: true,
    quantity: 73,
    imageId: "392c6359345678f123456799",
    sizes: ["S", "M", "L"],
    colors: ["black", "white"]
});





db.soldItem.insertOne({
    _id: ObjectId(),
    product_id: ObjectId("122c6359345678f123456789"),
    user_id: ObjectId("112c6359345678f123456789"),
    size: "XS"
});


db.soldItem.insertOne({
    _id: ObjectId(),
    product_id: ObjectId("122c6359345678f123456789"),
    user_id: ObjectId("212c6359345678f123456789"),
    size: "XS"
});

db.soldItem.insertOne({
    _id: ObjectId(),
    product_id: ObjectId("122c6359345678f123456789"),
    user_id: ObjectId("112c6359345678f123456789"),
    size: "XS"
});

db.soldItem.insertOne({
    _id: ObjectId(),
    product_id: ObjectId("122c6359345678f123456789"),
    user_id: ObjectId("112c6359345678f123456789"),
    size: "M"
});


db.soldItem.insertOne({
    _id: ObjectId(),
    product_id: ObjectId("122c6359345678f123456789"),
    user_id: ObjectId("212c6359345678f123456789"),
    size: "L"
});

db.soldItem.insertOne({
    _id: ObjectId(),
    product_id: ObjectId("222c6359345678f123456789"),
    user_id: ObjectId("212c6359345678f123456789"),
    size: "L"
});

db.soldItem.insertOne({
    _id: ObjectId(),
    product_id: ObjectId("222c6359345678f123456789"),
    user_id: ObjectId("212c6359345678f123456789"),
    size: "XL"
});

db.soldItem.insertOne({
    _id: ObjectId(),
    product_id: ObjectId("322c6359345678f123456789"),
    user_id: ObjectId("112c6359345678f123456789"),
    size: "S"
});

db.soldItem.insertOne({
    _id: ObjectId(),
    product_id: ObjectId("322c6359345678f123456789"),
    user_id: ObjectId("112c6359345678f123456789"),
    size: "M"
});

db.soldItem.insertOne({
    _id: ObjectId(),
    product_id: ObjectId("322c6359345678f123456789"),
    user_id: ObjectId("212c6359345678f123456789"),
    size: "L"
});


db.order.insertOne(
    {
        _id: ObjectId("322c6359345678f123456700")  ,
        products: {
          "122c6359345678f123456789": 2,
          "322c6359345678f123456789": 1
        },
        
        user_id: "112c6359345678f123456789",
        address: "Cumhuriyet Caddesi No: 19, Kat: 4, Daire: 12 Nişantaşi Mahallesi, Şişli 34363 İstanbul, Türkiye",
        completed: false,
        date:currentdate
  }
)

db.order.insertOne(
    {
        _id: ObjectId("322c6359345678f123456701")  ,
        products: {
          "222c6359345678f123456789": 1,
          "322c6359345678f123456790": 2
        },
        user_id: "212c6359345678f123456789",
        address: "İstasyon Caddesi No: 55, Daire: 7 Odunpazari Mahallesi, Odunpazari 26030 Eskişehir, Türkiye",
        completed: true,
        date:currentdate
    }
)

db.order.insertOne(
    {
        _id: ObjectId("322c6359345678f123456702") ,
        products: {
          "322c6359345678f123456791": 3
        },
        user_id: "312c6359345678f123456789",
        address: "Antalya Caddesi No: 14, Daire: 3 Lara Mahallesi, Muratpaşa 07100 Antalya, Türkiye",
        completed: false,
        date:currentdate
    }
)


db.order.insertOne(
    {
        _id: ObjectId("322c6359345678f123456703") ,
        products: {
          "322c6359345678f123456792": 1,
          "322c6359345678f123456793": 1
        },
        user_id: "412c6359345678f123456789",
        address: "Konak Sokak No: 22, Daire: 8 Konak Mahallesi, Konak 35250 İzmir, Türkiye",
        completed: true,
        date:currentdate
    }
)

db.order.insertOne(
    {
        _id: ObjectId("322c6359345678f123456704") ,
        products: {
        "322c6359345678f123456794": 2,
        "322c6359345678f123456795": 1
        },
        user_id: "512c6359345678f123456789",
        address: "Bağdat Caddesi No: 34, Daire: 5 Suadiye Mahallesi, Kadiköy 34740 İstanbul, Türkiye",
        completed : false,
        date:currentdate
    }
)

db.review.insertOne(
    {
        _id: ObjectId("223c6359345678f145676794"),
        comment: "Very good quality, worth the buy!",
        rating: 4,
        user_id:"512c6359345678f123456789",
        product_id:"322c6359345678f123456794"
    }
)
db.review.insertOne(
    {
        _id: ObjectId("223c6359345678f145676795"),
        comment: "Absolutely love the fit and feel of this shirt!",
        rating: 5,
        user_id: "112c6359345678f123456789",
        product_id: "122c6359345678f123456789"
    }
)

db.review.insertOne(
    {
        _id: ObjectId("223c6359345678f145676796"),
        comment: "Great value for money, highly recommend.",
        rating: 4,
        user_id: "212c6359345678f123456789",
        product_id: "322c6359345678f123456793"
    }
)

db.review.insertOne(
    {
        _id: ObjectId("223c6359345678f145676797"),
        comment: "Nice quality but sizing was slightly off.",
        rating: 3,
        user_id: "312c6359345678f123456789",
        product_id: "322c6359345678f123456790"
    }
)

db.review.insertOne(
    {
        _id: ObjectId("223c6359345678f145676798"),
        comment: "Very comfortable and stylish, would buy again.",
        rating: 5,
        user_id: "412c6359345678f123456789",
        product_id: "322c6359345678f123456791"
    }
)

db.review.insertOne(
    {
        _id: ObjectId("223c6359345678f145676799"),
        comment: "Good quality, but delivery took longer than expected.",
        rating: 2,
        user_id: "612c6359345678f123456789",
        product_id: "322c6359345678f123456792"
    }
)


db.review.insertOne({
    _id: ObjectId("223c6359345678f145676700"),
    comment: "Fantastic material and really comfortable!",
    rating: 5,
    user_id: "112c6359345678f123456789",
    product_id: "322c6359345678f123456790"
});

db.review.insertOne({
    _id: ObjectId("223c6359345678f145676701"),
    comment: "Nice design, but the fit is a bit loose.",
    rating: 3,
    user_id: "212c6359345678f123456789",
    product_id: "122c6359345678f123456789"
});

db.review.insertOne({
    _id: ObjectId("223c6359345678f145676702"),
    comment: "Love the color and style, goes well with anything!",
    rating: 4,
    user_id: "312c6359345678f123456789",
    product_id: "322c6359345678f123456791"
});

db.review.insertOne({
    _id: ObjectId("223c6359345678f145676703"),
    comment: "Not as expected, material feels cheap.",
    rating: 2,
    user_id: "412c6359345678f123456789",
    product_id: "322c6359345678f123456792"
});

db.review.insertOne({
    _id: ObjectId("223c6359345678f145676704"),
    comment: "Perfect for casual wear, very comfortable.",
    rating: 4,
    user_id: "512c6359345678f123456789",
    product_id: "322c6359345678f123456793"
});

db.review.insertOne({
    _id: ObjectId("223c6359345678f145676705"),
    comment: "Looks amazing but runs a size smaller than expected.",
    rating: 3,
    user_id: "612c6359345678f123456789",
    product_id: "322c6359345678f123456794"
});

db.review.insertOne({
    _id: ObjectId("223c6359345678f145676706"),
    comment: "Good value for the price, would recommend!",
    rating: 4,
    user_id: "112c6359345678f123456789",
    product_id: "322c6359345678f123456795"
});

db.review.insertOne({
    _id: ObjectId("223c6359345678f145676707"),
    comment: "Stylish and warm, perfect for the winter season.",
    rating: 5,
    user_id: "212c6359345678f123456789",
    product_id: "322c6359345678f123456796"
});

db.review.insertOne({
    _id: ObjectId("223c6359345678f145676708"),
    comment: "Fabric is a bit rough but otherwise good quality.",
    rating: 3,
    user_id: "312c6359345678f123456789",
    product_id: "322c6359345678f123456797"
});

db.review.insertOne({
    _id: ObjectId("223c6359345678f145676709"),
    comment: "Excellent fit and finish, very satisfied with this purchase.",
    rating: 5,
    user_id: "412c6359345678f123456789",
    product_id: "322c6359345678f123456798"
});


db.processedproduct.insertMany([
    {
        _id: ObjectId("622c6359345678f123456789"),
        name: "Classic Oxford Shirt",
        imageId: "192c6359345678f123456789",
        salePrice: 39.99,
        size: "M",
        color: "Blue",
        quantity: 1,
        updatedAt: new Date()
    },
    {
        _id: ObjectId("722c6359345678f123456789"),
        name: "Athletic Running Shorts",
        imageId: "292c6359345678f123456789",
        salePrice: 29.99,
        size: "L",
        color: "Black",
        quantity: 2,
        updatedAt: new Date()
    },
    {
        _id: ObjectId("822c6359345678f123456789"),
        name: "Puffer Vest",
        imageId: "392c6359345678f123456789",
        salePrice: 59.99,
        size: "M",
        color: "Green",
        quantity: 3,
        updatedAt: new Date()
    }
]);




db.shoppingcart.insertOne({
    _id: ObjectId("912c6359345678f123456789"),
    userId: ObjectId("412c6359345678f123456789"),
    items: [
        { processedProductId: ObjectId("622c6359345678f123456789") },
        { processedProductId: ObjectId("722c6359345678f123456789") },
        { processedProductId: ObjectId("822c6359345678f123456789") }
    ],
    updatedAt: new Date()
});








