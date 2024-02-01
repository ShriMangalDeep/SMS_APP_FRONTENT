import React, { useState, useEffect } from 'react';
import { Form, Input, Button, InputNumber, Select, Row, Col, message } from 'antd';
import imageCompression from 'browser-image-compression';
import AWS from 'aws-sdk';
import axios from 'axios';
const { TextArea } = Input;
const { Option } = Select;
const containsUnwantedSymbols = (value) => /[${};<>`]/.test(value);
const CreateNewPost = () => {
    const [form] = Form.useForm();
    const [originalMediaFiles, setOriginalMediaFiles] = useState([]);
    const [compressedImages, setCompressedImages] = useState([]);
    const [videoFiles, setVideoFiles] = useState([]);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    useEffect(() => {
        console.log(compressedImages.length);
        console.log(originalMediaFiles.length + videoFiles.length);
        const allFilesUploaded = originalMediaFiles.length ===  compressedImages.length + videoFiles.length;
        setIsSubmitDisabled(!allFilesUploaded);
    }, [originalMediaFiles, compressedImages, videoFiles]);

    const onFinish = async (values) => {
        try {
            const uploadedImageURLs = await uploadToS3(compressedImages, values.productName);
            const uploadedVideoURLs = await uploadToS3(videoFiles,  values.productName);

            const mediaURLs = [
                ...uploadedImageURLs.map((imageUrl) => ({
                    mediaType: 'image',
                    mediaURL: imageUrl.Location,
                })),
                ...uploadedVideoURLs.map((videoUrl) => ({
                    mediaType: 'video',
                    mediaURL: videoUrl.Location,
                })),
            ];

            const formData = {
                ...values,
                productMediaURLs: mediaURLs,
            };

            console.log('Final JSON Object:', formData);
            let finalData = await axios.post(process.env.REACT_APP_AWS_BACKEND_URL + '/createPost', formData, { header: { 'Content-Type': 'application/json' } });
            console.log("finalUpload =>", finalData);
            message.success('New Post Create Succesffully');
        } catch (error) {
            console.error('Error:', error);
            message.error('An error occurred while submitting the form. Please try again.');
        }
    };

    const handleMediaUpload = async (event) => {
        const files = event.target.files;
        const newOriginalMediaFiles = Array.from(files);

        setOriginalMediaFiles(newOriginalMediaFiles);
        const compressedFiles = await Promise.all(
            newOriginalMediaFiles.map(async (mediaFile) => {
                if (mediaFile.type.startsWith('image')) {
                    // Compress images
                    const options = { maxWidthOrHeight: 1920, useWebWorker: true };
                    const compressedFile = await imageCompression(mediaFile, options);
                    return compressedFile;
                } else {
                    // No need to compress videos
                    return mediaFile;
                }
            })
        );

        const compressedImages = compressedFiles.filter((file) => file.type.startsWith('image'));
        const videoFiles = compressedFiles.filter((file) => !file.type.startsWith('image'));

        setCompressedImages(compressedImages);
        setVideoFiles(videoFiles);
    };


    const handleClear = () => {
        form.resetFields();
        setOriginalMediaFiles([]);
        setCompressedImages([]);
        setIsSubmitDisabled(true);
    };

    const handleChatGPTClick = () => {
        const formData = form.getFieldsValue();
        formData['productDescription'] = ""
        const jsonString = JSON.stringify(formData, null, 2);
        const chatGPTMessage = `I want a product description not more than 50 words or 500 character count, should be simple and short and feel royal : ${jsonString}`;

        // Copy to clipboard
        navigator.clipboard.writeText(chatGPTMessage);

        // Display success message
        message.success('Form JSON data copied to clipboard.');
    };

    const uploadToS3 = async (files, productName) => {
        try {
            AWS.config.update({
                accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
                secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
                region: process.env.REACT_APP_AWS_REGION_KEY,
            });
    
            const s3 = new AWS.S3();
    
            const uploadedURLs = await Promise.all(
                files.map(async (file, index) => {
                    const isImage = file.type.startsWith('image');
                    const keyPrefix = isImage ? 'images' : 'videos';
    
                    // Get the file extension
                    const fileExtension = file.name.split('.').pop();
    
                    const params = {
                        Bucket: process.env.REACT_APP_AWS_S3_BUCKET_NAME,
                        Key: `${keyPrefix}/${Date.now()}-${productName.replace(/\s+/g, '_')}-${index}.${fileExtension}`,
                        Body: file,
                        ACL: 'public-read',
                        ContentType: file.type,
                    };
    
                    const { Location } = await s3.upload(params).promise();
                    return { Location, isImage }; // Return whether it's an image or video
                })
            );
    
            message.success('Files uploaded successfully');
            console.log(uploadedURLs)
            return uploadedURLs;
        } catch (error) {
            throw new Error('Error uploading files to S3: ' + error.message);
        }
    };
    


    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ productExtraCharges: 0 }}
        >
            <Form.Item label="Product Name" name="productName" rules={[{ required: true, message: 'Please enter product name' }, { validator: (_, value) => !containsUnwantedSymbols(value) ? Promise.resolve() : Promise.reject('Invalid characters in the field') }]}>
                <Input />
            </Form.Item>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                        label="Product Type"
                        name="productType"
                        rules={[
                            { required: true, message: 'Please select product type' },
                            {
                                type: 'enum',
                                enum: ['bengals', 'rings', 'tops', 'chains', 'bracelets', 'lagdis', 'big hars', 'balis', 'others'],
                                message: 'Invalid product type',
                            },
                            { validator: (_, value) => !containsUnwantedSymbols(value) ? Promise.resolve() : Promise.reject('Invalid characters in the field') },
                        ]}
                    >
                        <Select>
                            <Option value="bengals">Bengals</Option>
                            <Option value="rings">Rings</Option>
                            <Option value="tops">Tops</Option>
                            <Option value="chains">Chains</Option>
                            <Option value="bracelets">Bracelets</Option>
                            <Option value="lagdis">Lagdis</Option>
                            <Option value="big hars">Big Hars</Option>
                            <Option value="balis">Balis</Option>
                            <Option value="others">Others</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                        label="Product Metal Type"
                        name="productMetalType"
                        rules={[
                            { required: true, type: 'enum', enum: ['gold', 'silver', 'platinum', 'imitation', 'alloy'], message: 'Invalid metal type' },
                            { validator: (_, value) => !containsUnwantedSymbols(value) ? Promise.resolve() : Promise.reject('Invalid characters in the field') },
                        ]}
                    >
                        <Select>
                            <Option value="gold">Gold</Option>
                            <Option value="silver">Silver</Option>
                            <Option value="platinum">Platinum</Option>
                            <Option value="imitation">Imitation</Option>
                            <Option value="alloy">Alloy</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                        label="Product Weight"
                        name="productWeight"
                        rules={[
                            { required: true, type: 'number', min: 0, message: 'Please enter a valid weight' },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                        label="Product Labour"
                        name="productLabour"
                        rules={[
                            { required: true, type: 'number', min: 0, message: 'Please enter a valid labour value' },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                        label="Product Extra Charges"
                        name="productExtraCharges"
                        rules={[
                            { type: 'number', min: 0, message: 'Please enter a valid extra charge value' },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item label="Product Media" name="productMediaURLs" valuePropName="fileList">
                <input type="file" accept="image/*, video/*" onChange={handleMediaUpload} multiple />
                <div>
                    {compressedImages.map((file, index) => (
                        <img
                            key={index}
                            src={URL.createObjectURL(file)}
                            alt={`File ${index + 1}`}
                            style={{ width: '100px', height: '100px', marginRight: '8px', marginBottom: '8px' }}
                        />
                    ))}
                    {videoFiles.map((video, index) => (
                        <div key={index}>
                            <video controls width="100" height="100">
                                <source src={URL.createObjectURL(video)} type={video.type} />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ))}
                </div>
            </Form.Item>


            <Form.Item label="Product Description" name="productDescription" rules={[/* ... */]}>
                <Row>
                    <Col span={22}>
                        <TextArea rows={4} />
                    </Col>
                    <Col span={2} style={{ textAlign: 'right' }}>
                        <Button type="link" onClick={handleChatGPTClick}>
                            ChatGPT
                        </Button>
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" disabled={isSubmitDisabled}>
                    Submit
                </Button>
                <Button type="default" onClick={handleClear} style={{ marginLeft: '8px' }}>
                    Clear
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateNewPost;
