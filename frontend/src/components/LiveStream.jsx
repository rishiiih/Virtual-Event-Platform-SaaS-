import React, { useState } from 'react';
import {
  AgoraRTCProvider,
  useRTCClient,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
  RemoteUser,
  LocalVideoTrack
} from 'agora-rtc-react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiX, FiUsers } from 'react-icons/fi';

/**
 * Controls Bar Component
 */
const ControlsBar = ({ 
  onLeave, 
  isOrganizer, 
  audioEnabled, 
  videoEnabled, 
  onToggleAudio, 
  onToggleVideo 
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
      <div className="flex items-center justify-center gap-4">
        {/* Audio Toggle (Only for host) */}
        {isOrganizer && (
          <button
            onClick={onToggleAudio}
            className={`p-4 rounded-full transition-all ${
              audioEnabled
                ? 'bg-white/20 hover:bg-white/30'
                : 'bg-red-500 hover:bg-red-600'
            }`}
            title={audioEnabled ? 'Mute' : 'Unmute'}
          >
            {audioEnabled ? (
              <FiMic className="text-white" size={24} />
            ) : (
              <FiMicOff className="text-white" size={24} />
            )}
          </button>
        )}

        {/* Video Toggle (Only for host) */}
        {isOrganizer && (
          <button
            onClick={onToggleVideo}
            className={`p-4 rounded-full transition-all ${
              videoEnabled
                ? 'bg-white/20 hover:bg-white/30'
                : 'bg-red-500 hover:bg-red-600'
            }`}
            title={videoEnabled ? 'Stop Video' : 'Start Video'}
          >
            {videoEnabled ? (
              <FiVideo className="text-white" size={24} />
            ) : (
              <FiVideoOff className="text-white" size={24} />
            )}
          </button>
        )}

        {/* Leave Button */}
        <button
          onClick={onLeave}
          className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-all"
          title="Leave Stream"
        >
          <FiX className="text-white" size={24} />
        </button>
      </div>
    </div>
  );
};

/**
 * Video Room Component (Broadcasting)
 */
const VideoRoom = ({ channelName, token, appId, isOrganizer, onLeave }) => {
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: 'vp8', mode: 'live' })
  );

  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  // Join channel with role
  useJoin({
    appid: appId,
    channel: channelName,
    token: token,
    uid: null, // Auto-assign
  }, isOrganizer); // Only join if organizer or attendee role is set

  // Local tracks (only for host/organizer)
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(isOrganizer && audioEnabled);
  const { localCameraTrack } = useLocalCameraTrack(isOrganizer && videoEnabled);

  // Publish tracks (only host publishes)
  usePublish(isOrganizer ? [localMicrophoneTrack, localCameraTrack] : []);

  // Get remote users (for audience viewing host)
  const remoteUsers = useRemoteUsers();

  // Toggle functions (only for host)
  const handleToggleAudio = () => {
    if (isOrganizer) {
      setAudioEnabled(!audioEnabled);
    }
  };

  const handleToggleVideo = () => {
    if (isOrganizer) {
      setVideoEnabled(!videoEnabled);
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-primary to-accent rounded-xl overflow-hidden">
      {/* Video Display */}
      <div className="absolute inset-0">
        {isOrganizer ? (
          /* Host View - Show own camera */
          <div className="w-full h-full">
            {localCameraTrack && (
              <LocalVideoTrack
                track={localCameraTrack}
                play={true}
                className="w-full h-full object-cover"
              />
            )}
            {!videoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#774C60] to-[#B75D69]">
                <div className="text-center">
                  <FiVideoOff className="text-white mx-auto mb-4" size={64} />
                  <p className="text-white text-xl">Camera Off</p>
                </div>
              </div>
            )}
            {/* Viewer count badge */}
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white font-semibold">LIVE</span>
              <FiUsers className="text-white ml-2" />
              <span className="text-white font-semibold">{remoteUsers.length}</span>
            </div>
          </div>
        ) : (
          /* Audience View - Watch host */
          <div className="w-full h-full">
            {remoteUsers.length > 0 ? (
              <RemoteUser
                user={remoteUsers[0]}
                playVideo={true}
                playAudio={true}
                className="w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary to-accent">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
                  <p className="text-xl">Waiting for host to start streaming...</p>
                </div>
              </div>
            )}
            {/* Live indicator */}
            <div className="absolute top-4 right-4 bg-red-500 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 animate-pulse">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span className="text-white font-semibold">LIVE</span>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <ControlsBar
        onLeave={onLeave}
        isOrganizer={isOrganizer}
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        onToggleAudio={handleToggleAudio}
        onToggleVideo={handleToggleVideo}
      />
    </div>
  );
};

/**
 * Main LiveStream Component
 */
const LiveStream = ({ channelName, token, appId, onLeave, isOrganizer = false }) => {
  const client = AgoraRTC.createClient({ codec: 'vp8', mode: 'live' });

  // Set client role based on user type
  React.useEffect(() => {
    if (client) {
      client.setClientRole(isOrganizer ? 'host' : 'audience');
    }
  }, [client, isOrganizer]);

  return (
    <AgoraRTCProvider client={client}>
      <VideoRoom
        channelName={channelName}
        token={token}
        appId={appId}
        isOrganizer={isOrganizer}
        onLeave={onLeave}
      />
    </AgoraRTCProvider>
  );
};

export default LiveStream;
