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
    const [originalImages, setOriginalImages] = useState([]);
    const [compressedImages, setCompressedImages] = useState([]);
    const [videoUrl, setVideoUrl] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    useEffect(() => {
        // Check if all images are compressed
        const allImagesCompressed = compressedImages.length === originalImages.length;
        setIsSubmitDisabled(!allImagesCompressed);
    }, [originalImages, compressedImages]);

    const onFinish = async (values) => {
        try {
            // Upload compressed images to S3
            const uploadedImageURLs = await uploadToS3(compressedImages,values.productName);

            const mediaURLs = [
                ...uploadedImageURLs.map((imageUrl) => ({
                    mediaType: 'image',
                    mediaURL: imageUrl,
                })),
            ];

            // Only include video if a URL is provided
            if (videoUrl.trim() !== '') {
                mediaURLs.push({
                    mediaType: 'video',
                    mediaURL: videoUrl.trim(),
                });
            }

            const jsonObject = {
                productName: values.productName,
                productType: values.productType,
                productDescription: values.productDescription,
                productPrice: values.productPrice,
                productWeight: values.productWeight,
                productLabour: values.productLabour,
                productMetalType: values.productMetalType,
                productExtraCharges: values.productExtraCharges,
                productMediaURLs: [
                    ...uploadedImageURLs.map((imageUrl) => ({
                        mediaType: 'image',
                        mediaURL: imageUrl,
                    }))
                ],
            };

            console.log('Final JSON Object:', jsonObject);
            let finalData = await axios.post('https://907edw5pi0.execute-api.eu-north-1.amazonaws.com/Dev/createPost', jsonObject, { header: { 'Content-Type': 'application/json' } });
            console.log("finalUpload =>", finalData);
            message.success('New Post Create Succesffully');
        } catch (error) {
            console.error('Error uploading images to S3:', error);
            message.error('An error occurred while uploading images. Please try again.');
        }
    };

    const handleImageUpload = async (event) => {
        const files = event.target.files;
        const newOriginalImages = Array.from(files);

        setOriginalImages(newOriginalImages);

        const options = {
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };

        try {
            const compressedFiles = await Promise.all(
                newOriginalImages.map(async (imageFile) => {
                    console.log(`Original File size: ${imageFile.size} MB`);
                    const compressedFile = await imageCompression(imageFile, options);
                    console.log(`Compressed File size: ${compressedFile.size} MB`);
                    return compressedFile;
                })
            );

            setCompressedImages(compressedFiles);
        } catch (error) {
            console.log(error);
        }
    };

    const handleVideoUrlChange = (event) => {
        setVideoUrl(event.target.value);
    };

    const handleClear = () => {
        form.resetFields();
        setOriginalImages([]);
        setCompressedImages([]);
        setVideoUrl('');
        setIsSubmitDisabled(true);
    };

    const uploadToS3 = async (files,productName) => {
        try {
            // Configure AWS SDK with your credentials and S3 bucket information
            AWS.config.update({
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
                region: process.env.AWS_REGION_KEY,
            });

            const s3 = new AWS.S3();

            // Upload each file to S3 and get the URL
            const uploadedURLs = await Promise.all(
                files.map(async (file) => {
                    const params = {
                        Bucket: 'postimages4',
                        Key: `images/${Date.now()}-${productName.replace(/\s+/g, '_')}`,
                        Body: file,
                        ACL: 'public-read',
                        ContentType: file.type,
                    };

                    const { Location } = await s3.upload(params).promise();
                    return Location;
                })
            );
            message.success('Successfully Uploaded Images.');
            return uploadedURLs;
        }
        catch (err) {
            message.error('An error occurred while uploading images. Please try again. Error Message '+err.message);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ productExtraCharges: 0 }}
        >
            <Form.Item label="Product Name" name="productName" rules={[{ required: true, message: 'Please enter product name' },{ validator: (_, value) => !containsUnwantedSymbols(value) ? Promise.resolve() : Promise.reject('Invalid characters in the field') }]}>
                <Input />
            </Form.Item>

            <Form.Item label="Product Description" name="productDescription" rules={[{ required: true, message: 'Please enter product description' },{ validator: (_, value) => !containsUnwantedSymbols(value) ? Promise.resolve() : Promise.reject('Invalid characters in the field') }]}>
                <TextArea rows={4} />
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
                            { required: true, type: 'enum', enum: ['gold', 'silver', 'platinum', 'imitation'], message: 'Invalid metal type' },
                            { validator: (_, value) => !containsUnwantedSymbols(value) ? Promise.resolve() : Promise.reject('Invalid characters in the field') },
                        ]}
                    >
                        <Select>
                            <Option value="gold">Gold</Option>
                            <Option value="silver">Silver</Option>
                            <Option value="platinum">Platinum</Option>
                            <Option value="imitation">Imitation</Option>
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
                <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                        label="Product Price"
                        name="productPrice"
                        rules={[
                            { required: true, type: 'number', min: 0, message: 'Please enter a valid price' },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item label="Product Media" name="productMediaURLs" valuePropName="fileList">
                <input type="file" accept="image/*" onChange={handleImageUpload} multiple />
                <div>
                    {compressedImages.map((compressedImage, index) => (
                        <img
                            key={index}
                            src={compressedImage && URL.createObjectURL(compressedImage)}
                            alt={`Compressed Image ${index + 1}`}
                            style={{ width: '100px', height: '100px', marginRight: '8px', marginBottom: '8px' }}
                        />
                    ))}
                </div>
            </Form.Item>

            <Form.Item label="Product Video URL" name="productVideoUrl">
                <Input placeholder="Optional: Provide a video URL" onChange={handleVideoUrlChange} />
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
