import fs from 'fs';
import path from 'path';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';

const MONGO_URI = 'mongodb+srv://root:rpassword@cluster0.rz8bd.mongodb.net/e-commerce?retryWrites=true&w=majority';
const imageDirectory = path.join(__dirname, 'images');

// Set custom _id for each image manually
const productsWithImages = [
    { _id: new ObjectId("192c6359345678f123456789"), imageName: 'oxford_shirt.webp', mimeType: 'image/webp' },
    { _id: new ObjectId("292c6359345678f123456789"), imageName: 'straight_fit_jean.webp', mimeType: 'image/webp' },
    { _id: new ObjectId("392c6359345678f123456789"), imageName: 'faux_suede_bomber_jacket.jpg', mimeType: 'image/jpeg' },
    // Add more product-image mappings here with custom _id values
];

async function uploadImages() {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db('e-commerce');
    const bucket = new GridFSBucket(db, { bucketName: 'product_images' });

    for (const { _id, imageName, mimeType } of productsWithImages) {
        const imagePath = path.join(imageDirectory, imageName);

        if (!fs.existsSync(imagePath)) {
            console.warn(`Image file not found: ${imagePath}`);
            continue;
        }

        // Check if the file with this _id already exists in GridFS
        const existingFile = await bucket.find({ _id }).toArray();
        if (existingFile.length > 0) {
            console.log(`File with _id ${_id} already exists in GridFS. Skipping upload.`);
            continue;
        }

        // Upload the image to GridFS with a custom _id
        await new Promise<void>((resolve, reject) => {
            const uploadStream = bucket.openUploadStreamWithId(_id, imageName, {
                metadata: {
                    description: `Image with custom _id ${_id}`,
                    mimeType: mimeType,
                },
            });

            fs.createReadStream(imagePath)
                .pipe(uploadStream)
                .on('error', (error) => {
                    console.error(`Error uploading ${imageName}:`, error);
                    reject(error);
                })
                .on('finish', () => {
                    console.log(`Uploaded ${imageName} successfully with _id ${_id}.`);
                    resolve();
                });
        });
    }

    await client.close();
    console.log('All images uploaded successfully.');
}

uploadImages().catch(console.error);
