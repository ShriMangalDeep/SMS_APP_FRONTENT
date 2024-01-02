import "antd/dist/antd.css";
import React, { useEffect, useRef, useState } from "react";
import { Button, List } from "antd";
import { useBillContext } from "../Context/Bill_Context";

// https://stackoverflow.com/questions/46943375/webcam-does-not-turn-off-when-leaving-react-component#
//https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos
export default function CameraFeed2() {
    const { billData, setBillData } = useBillContext();
    const videoRef = useRef(null);
    const canvaRef = useRef(null);
    const imageCapture = useRef(null);
    // const [photo, setPhoto] = useState(null);
    const [videoStream, setVideoStream] = useState();
    const [columns, setColumns] = useState([]);
    function drawCanvas(canvas, img) {
        canvas.width = getComputedStyle(canvas).width.split('px')[0];
        canvas.height = getComputedStyle(canvas).height.split('px')[0];
        let ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
        let x = (canvas.width - img.width * ratio) 
        let y = (canvas.height - img.height * ratio)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height,
            x, y, img.width * ratio, img.height * ratio);
    }
    function onGrabFrameButtonClick() {
        imageCapture.current.grabFrame()
            .then((imageBitmap) => {
                console.log(imageBitmap);
                const canvas = canvaRef.current;
                drawCanvas(canvas, imageBitmap);
                // setPhoto(canvas.toDataURL("image/png"));
                setBillData({...billData,image:canvas.toDataURL("image/png")});
            })
            .catch((error) => console.error(error));
    }
    async function startCamera(deviceId) {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                deviceId
            },
            audio: false
        });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setVideoStream(stream);
            const track = stream.getVideoTracks()[0];
            imageCapture.current = new ImageCapture(track);
        }
    }

    function stopVideo() {
        if (videoStream) {
            videoStream.getTracks().forEach((track) => {
                if (track.readyState === "live") {
                    track.stop();
                }
            });
        }
    }

    async function getDevices() {
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log(devices);
        const cols = [];
        devices.forEach((device) => {
            if (device.kind === "videoinput") {
                cols.push({
                    label: device.label,
                    deviceId: device.deviceId
                });
            }
        });

        setColumns(cols);
    }
    useEffect(() => {
        getDevices();
        return () => {
            stopVideo();
        };
    }, []);
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                <Button
                    onClick={() => {
                        stopVideo();
                    }}
                >
                    Stop
                </Button>
                <List
                    dataSource={columns}
                    renderItem={(item) => (
                        <List.Item
                            onClick={() => {
                                console.log(item);
                                startCamera(item.deviceId);
                            }}
                        >
                            <Button type="primary"> {item.label}</Button>
                        </List.Item>
                    )}
                />
                <Button onClick={() => { onGrabFrameButtonClick() }}>Take Photo</Button>
            </div>
            <div style={{ display: "flex" }}>
                <video ref={videoRef} style={{width:'50%'}} autoPlay muted />
                <canvas ref={canvaRef} style={{ border: "1px solid red", height: "480px", width:'50%' }}></canvas>
            </div>
        </div>
    );
}
