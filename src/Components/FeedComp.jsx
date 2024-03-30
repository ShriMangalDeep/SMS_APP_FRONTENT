import React, { useRef } from "react";
import ProfilePic from './profile_pic';

const FeedComp = (props) => {
    const mainData = props.data;
    const feedPostPhotosRef = useRef(null);

    const scrollLeft = () => {
        feedPostPhotosRef.current.scrollBy({
            left: -100,
            behavior: 'smooth'
        });
    };

    const scrollRight = () => {
        feedPostPhotosRef.current.scrollBy({
            left: 100,
            behavior: 'smooth'
        });
    };

    return (
        <div className='feed-body'>
            <div className='feed-container'>
                <div className="feed-post">
                    <div className="feed-post-header">
                        <ProfilePic src={"https://picsum.photos/id/260/200/200"} size={63} username={"Bengals"}></ProfilePic>
                        <h2>{capitalize(mainData.productName)}</h2>
                    </div>
                    <div className="feed-post-photos" ref={feedPostPhotosRef}>
                        {mainData.productMediaURLs.map((media, index) => (
                            <div key={index} className="photos">
                                {media.mediaType === 'image' ? (
                                    <img src={URL.createObjectURL(media.mediaURL)} alt={`Image ${index}`} />
                                ) : (
                                    <video autoPlay loop controls>
                                        <source src={URL.createObjectURL(media.mediaURL)} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </div>
                        ))}
                    </div>
                    <button className="scroll-left" onClick={scrollLeft}>{'<'}</button>
                    <button className="scroll-right" onClick={scrollRight}>{'>'}</button>
                    <div className="feed-post-description"><h3>{mainData.productDescription}</h3></div>
                </div>
            </div>
        </div>
    );
}

function capitalize(str) {
    if (!str || str.trim() === '') {
        return '';
    }
    const words = str.split(' ');
    const capitalizedWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    const capitalizedString = capitalizedWords.join(' ');
    return capitalizedString;
}

export default FeedComp;
