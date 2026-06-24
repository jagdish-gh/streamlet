'use client';
import VideoThumbnail from '@/app/_component/Molecule/VideoThumbnail/VideoThumbnail';
import fetchChannelData, { channelData } from '@/app/_util/fetchChannelData';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import styles from './channel.module.css';
import BackButton from '@/app/_component/Atom/BackButton';

export default function ChannelPage({ params }: { params: { channelID: string } }) {
    // get the channel id from the url
    const channelID = params.channelID;
    const { data: session } = useSession();
    const [channelData, setChannelData] = useState<channelData[]>([]);    
    const [error, setError] = useState("");
    useEffect(() => {
        if(channelID && session){
            fetchChannelData(session,channelID,50)
            .then(channelData => {
                setChannelData(channelData);
                setError("");
              })
            .catch(channelError => {
                setError(channelError instanceof Error ? channelError.message : "Could not load channel videos.");
                setChannelData([]);
            });
        }
    },[channelID,session]);
    return (
        <>
        <BackButton/>
        <div className={styles.channelPage}>
            {error && <p className={styles.message}>{error}</p>}
            {channelData?.map((video) => (
                <VideoThumbnail key={video.id.videoId} video={video} />
            ))}
        </div>
        </>
    );
}
