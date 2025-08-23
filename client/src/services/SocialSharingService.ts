// Service para compartilhamento social (Regra 7: Responsabilidade única)
import { InvitationUrl } from "@/value-objects/InvitationUrl";

export class SocialSharingService {
  private readonly defaultMessage: string;

  constructor() {
    this.defaultMessage = "Você foi convidado para se cadastrar como cliente. Clique no link:";
  }

  public shareToWhatsApp(invitationUrl: InvitationUrl): void {
    const message = `${this.defaultMessage} ${invitationUrl.toString()}`;
    const encodedMessage = encodeURIComponent(message);
    this.openExternalWindow(`https://wa.me/?text=${encodedMessage}`);
  }

  public shareToFacebook(invitationUrl: InvitationUrl): void {
    const encodedUrl = encodeURIComponent(invitationUrl.toString());
    this.openExternalWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`);
  }

  public shareToEmail(invitationUrl: InvitationUrl): void {
    const subject = encodeURIComponent('Convite para Cadastro - PetWalker');
    const body = encodeURIComponent(`${this.defaultMessage} ${invitationUrl.toString()}`);
    this.openExternalWindow(`mailto:?subject=${subject}&body=${body}`);
  }

  private openExternalWindow(url: string): void {
    window.open(url, '_blank');
  }
}