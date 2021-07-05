enum TitleTopics {
  system = 'system',
}

enum TypeTopics {
  config = 'config',
}

interface IDataMessage {
  type: TypeTopics;
  topic: TitleTopics;
  payload: string;
  badge: string;
}

export {TitleTopics, TypeTopics};
export default IDataMessage;
