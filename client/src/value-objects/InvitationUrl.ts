// Value Object para encapsular URL de convite (Regra 3: Encapsular tipos primitivos)
export class InvitationUrl {
  private readonly baseUrl: string;
  private readonly walkerSlug: string;

  constructor(baseUrl: string, walkerSlug: string) {
    this.validateInputs(baseUrl, walkerSlug);
    this.baseUrl = baseUrl;
    this.walkerSlug = walkerSlug;
  }

  private validateInputs(baseUrl: string, walkerSlug: string): void {
    if (!baseUrl) {
      throw new Error("Base URL is required");
    }
    if (!walkerSlug) {
      throw new Error("Walker slug is required");
    }
  }

  public toString(): string {
    return `${this.baseUrl}/walker/${this.walkerSlug}/cadastro`;
  }

  public toProfileUrl(): string {
    return `${this.baseUrl}/profile/${this.walkerSlug}`;
  }
}