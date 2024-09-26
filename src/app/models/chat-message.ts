export interface ChatMessage {
  type?: string;
  content?: string;
  sender?: string;
  receiver?: string;
  sessionId?: string;
  sentAt?: string;
  groupId?: string;
  chatGroup?: string;
}
