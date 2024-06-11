import { SocketIoConfig } from 'ngx-socket-io';
import { environment } from './src/environment/environment';

export const socketIoConfig: SocketIoConfig = {
  url: `${environment.serverBaseUrl}:${environment.port}`,
};
