import { NextRequest, NextResponse } from 'next/server';
import { gridFSBucket } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

async function findImageById(id: string) {
    if (!ObjectId.isValid(id)) {
        throw new Error('Invalid image ID');
    }

    const imageId = new ObjectId(id);
    const files = await gridFSBucket.find({ _id: imageId }).toArray();
    if (files.length === 0) {
        throw new Error('Image not found');
    }

    return files[0];
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const file = await findImageById(id);

        const contentType = file.contentType || 'image/jpeg';
        const headers = new Headers({ 'Content-Type': contentType });

        const downloadStream = gridFSBucket.openDownloadStream(file._id);
        const stream = new ReadableStream({
            start(controller) {
                downloadStream.on('data', (chunk) => controller.enqueue(chunk));
                downloadStream.on('end', () => controller.close());
                downloadStream.on('error', (error) => controller.error(error));
            },
        });

        return new NextResponse(stream, { headers });
    } catch (error) {
        const status = error.message === 'Image not found' ? 404 : 400;
        return NextResponse.json({ error: error.message }, { status });
    }
}