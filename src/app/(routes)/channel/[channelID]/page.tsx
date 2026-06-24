'use client';
import VideoThumbnail from '@/app/_component/Molecule/VideoThumbnail/VideoThumbnail';
import fetchChannelData, { channelData } from '@/app/_util/fetchChannelData';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './channel.module.css';
import BackButton from '@/app/_component/Atom/BackButton';

export default function ChannelPage({ params }: { params: { channelID: string } }) {
    // get the channel id from the url
    const channelID = params.channelID;
    const { data: session } = useSession();
    const [channelData, setChannelData] = useState<channelData[]>([]);    
    const [error, setError] = useState("");
    const [nextPageToken, setNextPageToken] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const isLoadingRef = useRef(false);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const loadChannelVideos = useCallback(async (pageToken?: string, replace = false) => {
        if (!channelID || !session || isLoadingRef.current) {
            return;
        }

        isLoadingRef.current = true;
        setIsLoading(true);

        try {
            const page = await fetchChannelData(session, channelID, 24, pageToken);
            setChannelData(currentVideos => {
                if (replace) {
                    return page.items;
                }

                const seenIds = new Set(currentVideos.map(video => video.id.videoId));
                const newVideos = page.items.filter(video => !seenIds.has(video.id.videoId));
                return [...currentVideos, ...newVideos];
            });
            setNextPageToken(page.nextPageToken);
            setError("");
        } catch (channelError) {
            setError(channelError instanceof Error ? channelError.message : "Could not load channel videos.");
            if (replace) {
                setChannelData([]);
            }
        } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
        }
    }, [channelID, session]);

    useEffect(() => {
        if(channelID && session){
            setChannelData([]);
            setNextPageToken(undefined);
            loadChannelVideos(undefined, true);
        }
    },[channelID, loadChannelVideos, session]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || !nextPageToken) {
            return;
        }

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0]?.isIntersecting) {
                    loadChannelVideos(nextPageToken);
                }
            },
            { rootMargin: "500px 0px" },
        );

        observer.observe(sentinel);

        return () => {
            observer.disconnect();
        };
    }, [loadChannelVideos, nextPageToken]);

    return (
        <>
        <BackButton/>
        <div className={styles.channelPage}>
            {error && <p className={styles.message}>{error}</p>}
            {channelData?.map((video) => (
                <VideoThumbnail key={video.id.videoId} video={video} />
            ))}
            <div className={styles.loadSentinel} ref={sentinelRef}>
                {isLoading && <span>Loading more videos...</span>}
                {!isLoading && !nextPageToken && channelData.length > 0 && <span>All videos loaded</span>}
            </div>
        </div>
        </>
    );
}
