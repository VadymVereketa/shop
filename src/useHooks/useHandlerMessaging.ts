import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import {useDispatch} from 'react-redux';
import IDataMessage, {TitleTopics, TypeTopics} from '../typings/TypeTopic';
import loadRemoteConfig from '../utils/loadRemoteConfig';

enum TypeHandlerMessaging {
  background,
  openApp,
  message,
}

interface IOptions {
  type: TypeHandlerMessaging;
  payload: FirebaseMessagingTypes.RemoteMessage;
  dispatch?: any;
}
const useHandlerMessaging = () => {
  const dispatch = useDispatch();

  return (
    type: TypeHandlerMessaging,
    payload: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    switchHandlerMessaging({type, payload, dispatch});
  };
};

const switchHandlerMessaging = ({payload, type, dispatch}: IOptions) => {
  const data: IDataMessage = payload.data as any;

  if (data.topic === TitleTopics.system) {
    HandlersTopic.handlersSystemTopics({payload, dispatch, type});
  } else if (!data.topic) {
    HandlersTopic.handlersWithoutTopics({payload, dispatch, type});
  }
};

class HandlersTopic {
  public static handlersSystemTopics({payload, dispatch}: IOptions) {
    const data: IDataMessage = payload.data as any;
    if (data.type === TypeTopics.config) {
      HandlersSystemTopic.handlerMessagingConfig(dispatch);
    }
  }
  public static handlersWithoutTopics({payload, dispatch, type}: IOptions) {
    const data: IDataMessage = payload.data as any;
  }
}

class HandlersSystemTopic {
  public static async handlerMessagingConfig(dispatch?: any) {
    return await loadRemoteConfig(dispatch, true);
  }
}

class HandlersWithoutTopic {}

export {switchHandlerMessaging, TypeHandlerMessaging};
export default useHandlerMessaging;
