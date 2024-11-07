(function() {
    function updateTexts() {
        document.getElementById('dropText').textContent = i18n.t('upload.dropzone');
    }

    // update texts when language changes
    window.addEventListener('textsUpdated', updateTexts);

    // initial update
    updateTexts();

    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const progress = document.getElementById('progress');

    // handle drag and drop events
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        
        const items = e.dataTransfer.items;
        const files = [];
        
        // recursively get all files from directory
        async function getAllFiles(entry) {
            if (entry.isFile) {
                const file = await new Promise((resolve) => entry.file(resolve));
                files.push({
                    path: entry.fullPath,
                    file: file
                });
            } else if (entry.isDirectory) {
                const reader = entry.createReader();
                const entries = await new Promise((resolve) => {
                    reader.readEntries(resolve);
                });
                await Promise.all(entries.map(entry => getAllFiles(entry)));
            }
        }

        // process all dropped items
        await Promise.all(
            Array.from(items).map(item => {
                const entry = item.webkitGetAsEntry();
                if (entry) {
                    return getAllFiles(entry);
                }
            })
        );

        await compressAndUpload(files);
    });

    // handle click to select files
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', async () => {
        const files = Array.from(fileInput.files).map(file => ({
            path: file.webkitRelativePath,
            file: file
        }));
        await compressAndUpload(files);
    });

    // compress files into a zip archive
    async function compressFiles(files) {
        const rootDir = files[0]?.path.split('/')[1] || 'upload';
        
        // create zip archive
        const zip = new JSZip();
        files.forEach(({path, file}) => {
            zip.file(path.replace(/^\//, ''), file);
        });

        // generate zip blob with progress
        const content = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: {
                level: 9
            }
        }, (metadata) => {
            progress.textContent = `Compression progress: ${metadata.percent.toFixed(2)}%`;
        });

        return {
            content,
            rootDir
        };
    }

    // upload zip file to server
    async function uploadArchive(content, rootDir) {
        const formData = new FormData();
        formData.append('archive', content, `${rootDir}.zip`);

        progress.textContent = i18n.t('upload.uploading');
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Upload failed');
        return response;
    }

    // main process function
    async function compressAndUpload(files) {
        try {
            progress.textContent = i18n.t('upload.compressing');
            const { content, rootDir } = await compressFiles(files);
            await uploadArchive(content, rootDir);
            progress.textContent = i18n.t('upload.success');
        } catch (error) {
            progress.textContent = i18n.t('upload.failed', { error: error.message });
        }
    }
})(); 