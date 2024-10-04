import 'server-only';

import { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { ChatSettingsSchema } from './chat-settings.schema';
import { Database } from '../database.types';
import getChatContext from '../getChatContext';
export function createChatMessagesService(client: SupabaseClient<Database>) {
  return new ChatMessagesService(client);
}

class ChatMessagesService {
  constructor(private readonly client: SupabaseClient<Database>) { }

  async getMessages(params: { chatReferenceId: string; page: number }) {
    const perPage = 35;
    const startOffset = params.page * perPage;
    const endOffset = startOffset + perPage;
    const { data, error } = await this.client
      .from('chat_messages')
      .select(
        `
        id,
        role,
        content,
        createdAt: created_at,
        chat: chat_id !inner (reference_id)
      `,
      )
      .eq('chat.reference_id', params.chatReferenceId)
      .range(startOffset, endOffset);

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
    return data;
  }

  async createChat(params: {
    accountId: string;
    chatReferenceId: string;
    name: string;

    messages: Array<{
      content: string;
      role: 'user' | 'assistant';
    }>;
  }) {
    const { data, error } = await this.client.from('chats').insert({
      reference_id: params.chatReferenceId,
      account_id: params.accountId,
      name: params.name,
    });

    if (error) {
      console.error(error, `Error creating chat`);

      throw error;
    }

    return data;
  }

  async insertMessage(params: {
    accountId: string;
    chatId: number;

    messages: Array<{
      content: string;
      role: 'user' | 'assistant';
    }>;
  }) {
    const { data, error } = await this.client.from('chat_messages').insert(
      params.messages.map((message) => ({
        chat_id: params.chatId,
        account_id: params.accountId,
        content: message.content,
        role: message.role,
      })),
    );

    if (error) {
      console.error('Error inserting message:', error);

      throw error;
    }
    return data;
  }

  async getRemainingCredits(params: { accountId: string }) {
    const { data, error } = await this.client
      .from('credits_usage')
      .select('remaining_credits')
      .eq('account_id', params.accountId)
      .single();

    if (error) {
      throw error;
    }

    return data.remaining_credits;
  }

  async getChatIdByReferenceId(referenceId: string) {
    const { data, error } = await this.client
      .from('chats')
      .select('id')
      .eq('reference_id', referenceId)
      .single();

    if (error) {
      throw error;
    }

    return data.id;
  }

  async getChats(accountSlug: string) {
    const { data: chats, error } = await this.client
      .from('chats')
      .select('*, account_id !inner (slug)')
      .eq('account_id.slug', accountSlug)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return chats;
  }

  async getChatSettings(chatReferenceId: string) {
    const { data, error } = await this.client
      .from('chats')
      .select('settings')
      .eq('reference_id', chatReferenceId)
      .single();

    if (error) {
      throw error;
    }

    const settings = (data.settings ?? {}) as Partial<
      z.infer<typeof ChatSettingsSchema>
    >;

    let systemMessage = settings.systemMessage;

    if (!systemMessage) {
      const context = await this.fetchRelevantContext();

      systemMessage = `You are a helpful assistant
Here is some relevant data to help you answer:
${context}

Please use this information to provide accurate and relevant responses and don't mention the data source in your response.`;
    }

    return {
      maxTokens: settings.maxTokens ?? 500,
      systemMessage,
      model: settings.model ?? 'gpt-3.5-turbo',
      temperature: settings.temperature ?? 0.7,
    };
  }

  private async fetchRelevantContext(): Promise<string> {
    try {
      const context = getChatContext(this.client)
      
      return context
    } catch (error) {
      console.error('Error reading or parsing JSON files:', error);
      return '{}';
    }
  }

  async updateChat(
    params: {
      chatReferenceId: string;
    } & Database['public']['Tables']['chats']['Update'],
  ) {
    const { chatReferenceId, ...updateParams } = params;

    const { error } = await this.client
      .from('chats')
      .update(updateParams)
      .eq('reference_id', chatReferenceId);

    if (error) {
      console.error(error, `Error updating chat`);

      throw error;
    }
  }

  async deleteChat(params: { chatReferenceId: string }) {
    const { error } = await this.client
      .from('chats')
      .delete()
      .eq('reference_id', params.chatReferenceId);

    if (error) {
      console.error(error, `Error deleting chat`);

      throw error;
    }
  }
}


