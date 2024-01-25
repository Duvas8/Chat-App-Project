import React, { useEffect, useRef } from 'react'

export const VideoPlayer = ({user}) => {
    const videoRef = useRef()

    useEffect(()=>{
        user.videoTrack.play(videoRef.current)
    }, [])
  return (
    <div>
        Uid: {user.uid}
        <div
        ref={videoRef}
        style={{width:'300px', height:'200px'}}
        ></div>
    </div>
  )
}

