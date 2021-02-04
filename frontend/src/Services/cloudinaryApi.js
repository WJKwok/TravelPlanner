export const getPublicIdsOfUploadedImages = async (
	uploadedImgFiles,
	uploadedImageBlobToFile,
	fileDirectory
) => {
	if (!uploadedImgFiles.length) {
		return [];
	}

	const indexesToUpload = [];
	Object.keys(uploadedImageBlobToFile).forEach((img) => {
		if (uploadedImageBlobToFile[img].toUpload == true) {
			indexesToUpload.push(uploadedImageBlobToFile[img].index);
		}
	});

	const promises = [...uploadedImgFiles].reduce((result, imageFile, index) => {
		if (indexesToUpload.includes(index)) {
			const formData = new FormData();
			formData.append('file', imageFile);
			formData.append('upload_preset', 'mtmsf9hg');
			formData.append('folder', fileDirectory);

			result.push(
				fetch(
					`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/upload`,
					{
						method: 'POST',
						body: formData,
					}
				)
					.then((response) => response.json())
					.then((data) => data.public_id)
					.catch((err) => console.error(err))
			);
		}
		return result;
	}, []);

	return await Promise.all(promises);
};
