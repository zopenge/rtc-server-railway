window.ResourceManager = {
    /**
     * Import resource from file
     * @param {Object} editor - Editor instance that defines resource handling
     * @returns {Promise} Imported resource data
     */
    async importResource(editor) {
        if (!editor.getResourceConfig) {
            throw new Error('Editor must implement getResourceConfig()');
        }

        const config = editor.getResourceConfig();
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = config.extensions.join(',');
        
        return new Promise((resolve, reject) => {
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) {
                    reject(new Error('No file selected'));
                    return;
                }

                try {
                    // Use editor's import handler
                    const result = await editor.importHandler(file);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };
            input.click();
        });
    },

    /**
     * Export resource to file
     * @param {Object} editor - Editor instance that defines resource handling
     * @param {Object} data - Resource data to export
     * @param {string} filename - Target filename
     */
    async exportResource(editor, data, filename) {
        if (!editor.exportHandler) {
            throw new Error('Editor must implement exportHandler()');
        }

        try {
            await editor.exportHandler(data, filename);
        } catch (error) {
            console.error('Export failed:', error);
            throw error;
        }
    }
}; 