import React, { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { VideoPlayer } from "./VideoPlayer";
import ControlPanel from "./ControlPanel";

const APP_ID = "acba5a44ee7a42bc8f40039839c45ad5";
const TOKEN = "007eJxTYEj5umnK54Bgx5b7t75tzlo2oU4n1XKOhtS+8Ncb/Kc6rt2pwGCWZpKYYmxmmZRklmRikppoYWmZkmxibmmRbG5sZJmcGumwKbUhkJHhWGsGIyMDBIL4LAy5iZl5DAwA9pkhYQ==";
const CHANNEL = "main"

const clinet = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8'
})  



export const VideoCall = (props) => {
    const {recipientName , contactId, userId} = props
    const [users, setUsers] = useState([])
    const [localTracks, setLocalTracks] = useState([])

    const handleUserJoined = async(user, mediaType) => {
        await clinet.subscribe(user, mediaType)
        if (mediaType === 'video') {
            setUsers((previousUsers) => [...previousUsers, user])
            
        }

        if (mediaType === 'audio') {
            user.audioTrack.play()
        }
        
    }
    
    const handleUserLeft = (user) => {
        setUsers((previousUsers) => 
        previousUsers.filter((u) => u.uid !== user.uid))
    }
    
    useEffect(() => {
        clinet.on('user-published', handleUserJoined)
        clinet.on('user-left', handleUserLeft)
    
        clinet
        .join(APP_ID, CHANNEL, TOKEN, null)
        .then((uid) => 
        Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid]) 
        ).then( ([tracks, uid]) => {
            const [audioTrack, videoTrack] = tracks
            setLocalTracks(tracks)
            setUsers((previousUsers)=>[
                ...previousUsers,
                {
                    uid : userId,
                    videoTrack,
                }
            ])
            clinet.publish(tracks)

            return  () => {
                for(let localTrack of localTracks){
                    localTrack.stop()
                    localTrack.close()
                }
                clinet.off('user-published', handleUserJoined)
                clinet.off('user-left', handleUserLeft)
                clinet.unpublish(tracks).then(()=> clinet.leave())
            }

        })
    }, [])

    const leaveCall = () => {
        clinet.off('user-left', handleUserLeft)
        clinet.unpublish(tracks).then(() => clinet.leave())
        
      };
    
  return (
    <div style={{
        display:'flex',
        justifyContent:'center'
    }}>VideoRoom
        <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(2, 300px)',
            }}
        >
            {users.map((user) => (
                    <VideoPlayer key={user.uid} user={user}/>      
                )
            )}

        <ControlPanel // Include the ControlPanel component
          leaveCall={leaveCall}
          localAudioTrack={localTracks[0]}
          localVideoTrack={localTracks[1]}
        />
         </div> 
    </div>
  )
}
