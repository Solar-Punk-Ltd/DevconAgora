export const FIRST_SEGMENT_INDEX = '0000000000000000';

// Consensus ID is used for the Graffiti feed, that is handling user registration
export const CONSENSUS_ID = 'SwarmStream';

// Chat events, used together with getChatActions
export const EVENTS = {
    LOADING_INIT_USERS: 'loadingInitUsers',
    LOADING_USERS: 'loadingUsers',
    LOADING_REGISTRATION: 'loadingRegistration',
    LOAD_MESSAGE: 'loadMessage',
};

export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;

export const HEX_RADIX = 16;

export const ETH_ADDRESS_LENGTH = 42;

// These are used for removing the inactive users from the message fetch loop
export const REMOVE_INACTIVE_USERS_INTERVAL = 1 * MINUTE;
export const IDLE_TIME = 1 * MINUTE;                                            // User will be removed from readMessage loop after this time, until rejoin

export const MESSAGE_CHECK_INTERVAL = 300;                                      // User-side message check interval
export const USER_UPDATE_INTERVAL = 8 * SECOND;                                 // User-side user update interval

export const MAX_TIMEOUT = 1200;                                                // Max timeout in ms
export const INCREASE_LIMIT = 400;                                              // When to increase max parallel request count (avg request time in ms)
export const DECREASE_LIMIT = 800;                                              // When to decrease max parallel request count (avg request time in ms)

export const FETCH_INTERVAL_INCREASE_LIMIT = 1000;                              // Lower the frequency of message fetch
export const FETCH_INTERVAL_DECREASE_LIMIT = 800;                               // Higher frequency for message fetch
export const MESSAGE_FETCH_MIN = 300;                                           // Lowest message fetch frequency (ms)
export const MESSAGE_FETCH_MAX = 8 * SECOND;                                    // Highest message fetch frequency (ms)
export const F_STEP = 100;                                                      // Message fetch step (ms)