import React from "react";


export default function ProfilePic({
  src,
  username,
  size,
  border,
  href,
  ...props
}) {
  return (
    <span {...props} onClick={() => console.log(`Clicked on ${username}`)}>
      <img
        alt={`${username}'s profile pic`}
        data-testid="user-avatar"
        draggable="false"
        src={src}
        style={{
          width: size,
          height: size,
          borderRadius: size,
          border: border && "2px solid white",
          cursor: "pointer",
        }}
      ></img>
    </span>
  );
}