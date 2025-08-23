import { google, calendar_v3 } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export class GoogleCalendarService {
  
  /**
   * Gera URL de autorização para o Google OAuth
   */
  static generateAuthUrl(userId: string): string {
    const scopes = [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar.readonly'
    ];

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: userId, // Usamos o userId como state para identificar o usuário no callback
      prompt: 'consent'
    });
  }

  /**
   * Troca o código de autorização pelos tokens
   */
  static async exchangeCodeForTokens(code: string) {
    try {
      const { tokens } = await oauth2Client.getToken(code);
      return tokens;
    } catch (error) {
      console.error('Erro ao trocar código pelos tokens:', error);
      throw new Error('Falha na autenticação com Google');
    }
  }

  /**
   * Configura os tokens no cliente OAuth
   */
  static setCredentials(accessToken: string, refreshToken?: string) {
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    return oauth2Client;
  }

  /**
   * Cria evento no Google Calendar
   */
  static async createEvent(
    accessToken: string,
    refreshToken: string,
    eventData: {
      summary: string;
      description?: string;
      start: { dateTime: string; timeZone: string };
      end: { dateTime: string; timeZone: string };
      location?: string;
    }
  ) {
    try {
      const auth = this.setCredentials(accessToken, refreshToken);
      const calendar = google.calendar({ version: 'v3', auth });

      const event = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: eventData.summary,
          description: eventData.description,
          start: eventData.start,
          end: eventData.end,
          location: eventData.location,
        },
      });

      return event.data;
    } catch (error) {
      console.error('Erro ao criar evento no Google Calendar:', error);
      throw new Error('Falha ao criar evento no Google Calendar');
    }
  }

  /**
   * Sincroniza agendamentos para o Google Calendar
   */
  static async syncWalksToCalendar(
    accessToken: string,
    refreshToken: string,
    walks: any[]
  ) {
    try {
      const auth = this.setCredentials(accessToken, refreshToken);
      const calendar = google.calendar({ version: 'v3', auth });

      const syncedEvents = [];

      for (const walk of walks) {
        // Verificar se o evento já existe (usando um identificador único)
        const existingEvents = await calendar.events.list({
          calendarId: 'primary',
          q: `Passeio - ${walk.clients?.pet_name || 'Pet'} - ${walk.id}`,
          timeMin: new Date().toISOString(),
        });

        if (existingEvents.data.items && existingEvents.data.items.length > 0) {
          // Evento já existe, pular
          continue;
        }

        // Criar novo evento
        const startTime = new Date(walk.scheduled_at);
        const endTime = new Date(startTime.getTime() + (walk.duration * 60 * 1000));

        const eventData = {
          summary: `Passeio - ${walk.clients?.pet_name || 'Pet'}`,
          description: `
Passeio agendado com ${walk.clients?.profiles?.name || walk.clients?.client_name || 'Cliente'}

🐕 Pet: ${walk.clients?.pet_name || 'Pet'}
⏰ Duração: ${walk.duration} minutos
💰 Valor: R$ ${walk.price?.toFixed(2) || '0,00'}
${walk.notes ? `📝 Observações: ${walk.notes}` : ''}

Agendamento ID: ${walk.id}
          `.trim(),
          start: {
            dateTime: startTime.toISOString(),
            timeZone: 'America/Sao_Paulo',
          },
          end: {
            dateTime: endTime.toISOString(),
            timeZone: 'America/Sao_Paulo',
          },
          location: walk.clients?.address || undefined,
        };

        const event = await this.createEvent(accessToken, refreshToken, eventData);
        syncedEvents.push(event);
      }

      return {
        success: true,
        syncedCount: syncedEvents.length,
        events: syncedEvents
      };
    } catch (error) {
      console.error('Erro ao sincronizar com Google Calendar:', error);
      throw new Error('Falha na sincronização com Google Calendar');
    }
  }

  /**
   * Lista eventos do Google Calendar
   */
  static async listEvents(
    accessToken: string,
    refreshToken: string,
    startDate?: Date,
    endDate?: Date
  ) {
    try {
      const auth = this.setCredentials(accessToken, refreshToken);
      const calendar = google.calendar({ version: 'v3', auth });

      const events = await calendar.events.list({
        calendarId: 'primary',
        timeMin: startDate?.toISOString() || new Date().toISOString(),
        timeMax: endDate?.toISOString(),
        maxResults: 250,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return events.data.items || [];
    } catch (error) {
      console.error('Erro ao listar eventos do Google Calendar:', error);
      throw new Error('Falha ao listar eventos do Google Calendar');
    }
  }

  /**
   * Verifica se os tokens são válidos
   */
  static async validateTokens(accessToken: string, refreshToken?: string): Promise<boolean> {
    try {
      const auth = this.setCredentials(accessToken, refreshToken);
      const calendar = google.calendar({ version: 'v3', auth });
      
      // Tenta fazer uma chamada simples para verificar se os tokens são válidos
      await calendar.calendarList.list();
      return true;
    } catch (error) {
      console.error('Tokens inválidos:', error);
      return false;
    }
  }
}