import pkg from 'agora-token';
const { RtcTokenBuilder, RtcRole } = pkg;

/**
 * Agora.io Broadcasting Configuration
 * Docs: https://docs.agora.io/en/video-calling/develop/authentication-workflow
 */

const AGORA_APP_ID = process.env.AGORA_APP_ID;
const AGORA_APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

/**
 * Generate RTC token for joining a channel
 * @param {string} channelName - Channel name (unique per event)
 * @param {string} uid - User ID (0 for auto-assign)
 * @param {boolean} isHost - true for broadcaster (organizer), false for audience
 * @returns {string} - RTC token
 */
export const generateAgoraToken = (channelName, uid = 0, isHost = false) => {
  if (!AGORA_APP_ID || !AGORA_APP_CERTIFICATE) {
    console.error('❌ Agora credentials not configured');
    console.error('AGORA_APP_ID:', AGORA_APP_ID);
    console.error('AGORA_APP_CERTIFICATE:', AGORA_APP_CERTIFICATE ? 'Present' : 'Missing');
    throw new Error('Agora credentials missing');
  }

  // Token expiration time (24 hours from now)
  const expirationTimeInSeconds = 86400; // 24 hours
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  // Role: Host (broadcaster) or Audience (viewer)
  const role = isHost ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

  console.log('Generating token for:', { channelName, uid, isHost, role });

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(
      AGORA_APP_ID,
      AGORA_APP_CERTIFICATE,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    console.log(`✅ Generated Agora token for ${isHost ? 'HOST' : 'AUDIENCE'} in channel: ${channelName}`);
    return token;
  } catch (error) {
    console.error('❌ Error generating Agora token:', error);
    throw error;
  }
};

/**
 * Create a unique channel name for an event
 * @param {string} eventId - MongoDB event ID
 * @returns {string} - Channel name
 */
export const createChannelName = (eventId) => {
  return `event_${eventId}`;
};

/**
 * Validate Agora configuration
 * @returns {boolean}
 */
export const validateAgoraConfig = () => {
  const isValid = !!(AGORA_APP_ID && AGORA_APP_CERTIFICATE);
  
  if (!isValid) {
    console.error('❌ Agora configuration missing:');
    console.error('  - AGORA_APP_ID:', AGORA_APP_ID ? '✓' : '✗');
    console.error('  - AGORA_APP_CERTIFICATE:', AGORA_APP_CERTIFICATE ? '✓' : '✗');
  }
  
  return isValid;
};
