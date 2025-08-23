// Service para gerenciar convites de clientes (Regra 7: Entidades pequenas)
import { InvitationUrl } from "@/value-objects/InvitationUrl";

export class ClientInvitationService {
  private readonly currentOrigin: string;

  constructor() {
    this.currentOrigin = window.location.origin;
  }

  public createInvitationUrl(walkerSlug: string): InvitationUrl {
    return new InvitationUrl(this.currentOrigin, walkerSlug);
  }

  public async copyToClipboard(invitationUrl: InvitationUrl): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(invitationUrl.toString());
      return true;
    } catch (error) {
      return false;
    }
  }
}