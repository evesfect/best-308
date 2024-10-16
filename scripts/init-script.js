db = db.getSiblingDB("e-commerce");

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
    role: "customer"
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
    category: "shirt",
    price: 39.99,
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
});

db.product.insertOne({
    _id: ObjectId("222c6359345678f123456789"),
    name: "straight fit jean",
    description: "A straight fit pant made from a blend of linen and cotton. It features front pockets, back patch pockets, and a front zipper with a button closure",
    category: "jean",
    price: 79.99,
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
    }
});

db.product.insertOne({
    _id: ObjectId("322c6359345678f123456789"),
    name: "faux suede bomber jacket",
    description: "Regular fit bomber jacket made of faux suede fabric, padded on the inside. Features a ribbed elastic collar, long sleeves, welt pockets at the hip and an inside pocket detail. Ribbed trims. Zip-up front.",
    category: "jacket",
    price: 59.99,
    total_stock: {
        "S": 15,
        "M": 10,
        "L": 12
    },
    available_stock: {
        "S": 14,
        "M": 9,
        "L": 11
    }
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

db.product.insertOne({
    _id: ObjectId("322c6359345678f123456790"),
    name: "cotton crew neck t-shirt",
    description: "Classic fit t-shirt made from soft, breathable cotton. Features a crew neckline and short sleeves.",
    category: "t-shirt",
    price: "19.99",
    total_stock: {
        "S": 25,
        "M": 30,
        "L": 20
    },
    available_stock: {
        "S": 23,
        "M": 29,
        "L": 18
    }
});

db.product.insertOne({
    _id: ObjectId("322c6359345678f123456791"),
    name: "slim fit denim jeans",
    description: "Slim fit jeans crafted from stretchable denim fabric. Features a classic 5-pocket design and zip fly with button closure.",
    category: "jeans",
    price: "49.99",
    total_stock: {
        "S": 10,
        "M": 15,
        "L": 12
    },
    available_stock: {
        "S": 9,
        "M": 14,
        "L": 11
    }
});

db.product.insertOne({
    _id: ObjectId("322c6359345678f123456792"),
    name: "wool blend overcoat",
    description: "Elegant overcoat made from a wool blend. Features a notched lapel, button closure, and two front pockets.",
    category: "coat",
    price: "120.00",
    total_stock: {
        "S": 8,
        "M": 6,
        "L": 10
    },
    available_stock: {
        "S": 7,
        "M": 6,
        "L": 9
    }
});

db.product.insertOne({
    _id: ObjectId("322c6359345678f123456793"),
    name: "athletic running shorts",
    description: "Breathable and lightweight running shorts with an elastic waistband and inner lining for comfort. Features a zip pocket at the back.",
    category: "shorts",
    price: "29.99",
    total_stock: {
        "S": 12,
        "M": 18,
        "L": 20
    },
    available_stock: {
        "S": 12,
        "M": 16,
        "L": 19
    }
});

db.product.insertOne({
    _id: ObjectId("322c6359345678f123456794"),
    name: "leather biker jacket",
    description: "Genuine leather biker jacket featuring a classic asymmetrical zip closure, zippered cuffs, and multiple pockets.",
    category: "jacket",
    price: "199.99",
    total_stock: {
        "S": 8,
        "M": 12,
        "L": 6
    },
    available_stock: {
        "S": 7,
        "M": 11,
        "L": 6
    }
});

db.product.insertOne({
    _id: ObjectId("322c6359345678f123456795"),
    name: "cotton cargo pants",
    description: "Relaxed fit cargo pants made from durable cotton. Features multiple pockets, a drawstring waist, and elastic cuffs.",
    category: "pants",
    price: "45.99",
    total_stock: {
        "S": 15,
        "M": 18,
        "L": 14
    },
    available_stock: {
        "S": 13,
        "M": 16,
        "L": 13
    }
});

db.product.insertOne({
    _id: ObjectId("322c6359345678f123456796"),
    name: "linen button-down shirt",
    description: "Lightweight linen shirt with a button-down front. Features a spread collar and long sleeves.",
    category: "shirt",
    price: "39.99",
    total_stock: {
        "S": 10,
        "M": 20,
        "L": 18
    },
    available_stock: {
        "S": 9,
        "M": 18,
        "L": 16
    }
});

db.product.insertOne({
    _id: ObjectId("322c6359345678f123456797"),
    name: "knit sweater",
    description: "Cozy knit sweater featuring a round neckline and ribbed trims. Made from soft acrylic wool blend.",
    category: "sweater",
    price: "34.99",
    total_stock: {
        "S": 12,
        "M": 14,
        "L": 10
    },
    available_stock: {
        "S": 11,
        "M": 12,
        "L": 9
    }
});

db.product.insertOne({
    _id: ObjectId("322c6359345678f123456798"),
    name: "puffer vest",
    description: "Water-resistant puffer vest with lightweight insulation. Features a zip-up front and two side pockets.",
    category: "vest",
    price: "59.99",
    total_stock: {
        "S": 5,
        "M": 8,
        "L": 7
    },
    available_stock: {
        "S": 4,
        "M": 7,
        "L": 6
    }
});

db.product.insertOne({
    _id: ObjectId("322c6359345678f123456799"),
    name: "graphic print hoodie",
    description: "Relaxed fit hoodie with a front kangaroo pocket and graphic print on the back. Made from a cotton-poly blend.",
    category: "hoodie",
    price: "49.99",
    total_stock: {
        "S": 20,
        "M": 25,
        "L": 30
    },
    available_stock: {
        "S": 19,
        "M": 24,
        "L": 29
    }
});


