import { AppConfig, UserSession, showConnect, UserData, FinishedData } from '@stacks/connect';
import { Person } from '@stacks/profile';

const appConfig = new AppConfig(['store_write', 'publish_data']);

export const userSession = new UserSession({ appConfig });

export function authenticate(cancel: () => void, finished: (payload: FinishedData) => void): void {
  showConnect({
    manifestPath: 'http://localhost:3000/manifest.json',
    appDetails: {
      name: 'Luna Orbit',
      icon: 'https://lunaorbit.ghostfly.dev/assets/apple-touch-icon.png',
    },
    onCancel:cancel,
    onFinish: finished,
    redirectTo: '/',
    userSession: userSession,
  });
}

export function getUserData(): UserData {
  return userSession.loadUserData();
}

export function getPerson(): Person {
  return new Person(getUserData().profile);
}