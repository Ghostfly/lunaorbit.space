import { Storage } from '@stacks/storage';
import { userSession } from './auth';

const storage = new Storage({ userSession });
// const blockStackUsername = '1CvACptXN5K9nJbTQHpWf5sA4MXGEQv3h9';

console.warn('Storage ready', storage);