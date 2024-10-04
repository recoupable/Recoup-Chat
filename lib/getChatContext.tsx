import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const getChatContext = async (client: SupabaseClient<Database>) => {
    const context = []

    const { data: chats } = await client
        .from('chats')
        .select('name')
        .limit(50);

    if (chats?.length && chats[0]) {
        const columns = Object.keys(chats[0]);
        const rows = chats.map((chat) => Object.values(chat));

        const chatContext = `The following is the data about chats in the format (${columns.join(', ')})
  ${rows.join('\n')}`;
        context.push(chatContext);
    }

    const { data: messages } = await client
        .from('chat_messages')
        .select('content')
        .limit(50);

    if (messages?.length && messages[0]) {
        const columns = Object.keys(messages[0]);
        const rows = messages.map((message) => Object.values(message));

        const chatContext = `The following is the data about chat messages in the format (${columns.join(', ')})
  ${rows.join('\n')}`;
        context.push(chatContext);
    }

    return context.join('\n');
}


export default getChatContext