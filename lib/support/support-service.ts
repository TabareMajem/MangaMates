import { sendEmail } from '@/lib/email/mailer';
import { AppError, ErrorCode } from '@/lib/error/error-handler';
import { supabase } from '@/lib/supabase';

export interface SupportTicket {
  id: string;
  userId: string;
  type: 'bug' | 'feature' | 'billing' | 'other';
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export class SupportService {
  async createTicket(
    userId: string,
    data: Omit<SupportTicket, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ) {
    try {
      const { data: ticket, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: userId,
          ...data,
          status: 'open'
        })
        .select()
        .single();

      if (error) throw error;

      // Send confirmation email to user
      await this.sendTicketConfirmation(ticket);

      // Notify support team
      await this.notifySupport(ticket);

      return ticket;
    } catch (error) {
      throw new AppError(
        'Failed to create support ticket',
        ErrorCode.DATABASE_ERROR,
        500,
        error
      );
    }
  }

  async updateTicket(ticketId: string, update: Partial<SupportTicket>) {
    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .update(update)
      .eq('id', ticketId)
      .select()
      .single();

    if (error) {
      throw new AppError(
        'Failed to update ticket',
        ErrorCode.DATABASE_ERROR,
        500,
        error
      );
    }

    // Notify user of update
    await this.sendTicketUpdate(ticket);

    return ticket;
  }

  private async sendTicketConfirmation(ticket: SupportTicket) {
    await sendEmail({
      to: ticket.email,
      template: 'support-ticket-created',
      data: {
        ticketId: ticket.id,
        title: ticket.title,
        priority: ticket.priority
      }
    });
  }

  private async notifySupport(ticket: SupportTicket) {
    await sendEmail({
      to: process.env.SUPPORT_EMAIL!,
      template: 'new-support-ticket',
      data: {
        ticketId: ticket.id,
        userId: ticket.userId,
        type: ticket.type,
        priority: ticket.priority,
        title: ticket.title,
        description: ticket.description
      }
    });
  }
}
