let convertedBlob;

        // Function to display loading animation
        function showLoadingMessage(show) {
            document.getElementById('loadingMessage').style.display = show ? 'block' : 'none';
        }

        // Function to convert and download the image
        async function convertAndDownloadImage() {
            showLoadingMessage(true);

            const fileInput = document.getElementById('imageInput');
            const format = document.getElementById('formatSelect').value;

            if (!fileInput.files.length) {
                alert('Please upload an image first.');
                showLoadingMessage(false);
                return;
            }

            const file = fileInput.files[0];
            const image = new Image();

            const reader = new FileReader();
            reader.onload = function(event) {
                image.src = event.target.result;
            };
            reader.readAsDataURL(file);

            image.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0);

                canvas.toBlob((blob) => {
                    convertedBlob = blob;
                    const downloadLink = document.getElementById('downloadLink');
                    downloadLink.href = URL.createObjectURL(blob);
                    downloadLink.download = `converted.${format}`;
                    downloadLink.style.display = 'block';
                    downloadLink.textContent = 'Download Converted Image';
                    showLoadingMessage(false);
                }, `image/${format}`);
            };
        }

        // Function to upload to ImageBB and generate a direct link
        async function generateImageBBLink() {
            if (!convertedBlob) {
                alert('Please convert an image first.');
                return;
            }

            showLoadingMessage(true);

            const formData = new FormData();
            formData.append('image', convertedBlob);

            const apiKey = '2038e4dc8c24c117baa6f4b2dd8393c8';  // Replace with your ImageBB API key
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                const directLink = data.data.url;
                const directLinkElement = document.getElementById('directLink');
                directLinkElement.style.display = 'block';
                directLinkElement.innerHTML = `Direct Link: <a href="${directLink}" target="_blank">${directLink}</a>`;
                showLoadingMessage(false);
            } else {
                alert('Failed to upload image to ImageBB');
                showLoadingMessage(false);
            }
        }