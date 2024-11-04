// File: src/app/api/images/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import connectionPromise, { gridFSBucket } from '@/lib/mongodb';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id || !ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 });
    }

    try {
        await connectionPromise;

        const imageId = new ObjectId(id);
        const all_ = await gridFSBucket.find().toArray();
        console.log(all_);
        const fileCursor = await gridFSBucket.find({ _id: imageId }).toArray();
        if (fileCursor.length === 0) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

        const file = fileCursor[0];
        const contentType = file.contentType || 'image/jpeg';

        const headers = new Headers();
        headers.set('Content-Type', contentType);

        const downloadStream = gridFSBucket.openDownloadStream(imageId);
        const stream = new ReadableStream({
            start(controller) {
                downloadStream.on('data', (chunk) => controller.enqueue(chunk));
                downloadStream.on('end', () => controller.close());
                downloadStream.on('error', (error) => {
                    console.error('Error fetching image:', error);
                    controller.error(error);
                });
            },
        });

        return new NextResponse(stream, { headers });
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }
}
