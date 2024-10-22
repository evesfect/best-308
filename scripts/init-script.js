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
    price: "39.99",
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
    price: "79.99",
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
    price: "59.99",
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



