class FileService {
    constructor({ database }) {
        this.db = database;
    }

    async createFile(fileInfo, userId) {
        try {
            const file = await this.db.files.create({
                originalName: fileInfo.originalName,
                mimeType: fileInfo.mimeType,
                size: fileInfo.size,
                content: fileInfo.buffer,
                userId: userId,
                uploadedAt: fileInfo.uploadedAt
            });

            return {
                id: file.id,
                original_name: file.originalName,
                mime_type: file.mimeType,
                size: file.size,
                uploaded_at: file.uploadedAt
            };
        } catch (error) {
            console.error('Failed to create file:', error);
            throw new Error('Failed to store file');
        }
    }

    async getFile(fileId, userId) {
        const file = await this.db.files.findOne({
            where: {
                id: fileId,
                userId: userId
            }
        });

        if (!file) {
            throw new Error('File not found');
        }

        return file;
    }

    async deleteFile(fileId, userId) {
        const result = await this.db.files.destroy({
            where: {
                id: fileId,
                userId: userId
            }
        });

        if (!result) {
            throw new Error('File not found or not authorized');
        }

        return true;
    }
}

module.exports = FileService; 