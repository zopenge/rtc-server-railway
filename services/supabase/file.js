const supabase = require('./index');
const { v4: uuidv4 } = require('uuid');

const fileService = {
    // check if supabase is enabled
    isEnabled: () => supabase.isEnabled(),

    // create file record with user reference
    async createFile(fileInfo, userId) {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }

        try {
            const { data, error } = await supabase.getClient()
                .from('files')
                .insert([{
                    id: uuidv4(),
                    user_id: userId,
                    original_name: fileInfo.originalName,
                    mime_type: fileInfo.mimeType,
                    size: fileInfo.size,
                    content: fileInfo.buffer,
                    uploaded_at: fileInfo.uploadedAt
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('File storage error:', error);
            throw new Error('File storage failed: ' + error.message);
        }
    },

    // get files by user id
    async getFilesByUser(userId) {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }

        const { data, error } = await supabase.getClient()
            .from('files')
            .select('*')
            .eq('user_id', userId)
            .order('uploaded_at', { ascending: false });

        if (error) throw error;
        return data;
    }
};

module.exports = fileService; 