// Guard para validação de userId (Regra 3: Encapsular primitivos)
export class UserIdGuard {
  private readonly userId: string;

  constructor(userId: string | undefined) {
    this.validateUserId(userId);
    this.userId = userId!;
  }

  private validateUserId(userId: string | undefined): void {
    if (!userId) {
      throw new Error("User ID is required");
    }
  }

  public getValue(): string {
    return this.userId;
  }
}