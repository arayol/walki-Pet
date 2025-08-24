// No arquivo server/storage.ts, substitua o método createWalk existente por:

async createWalk(walk: InsertWalk): Promise<Walk> {
  try {
    console.log('📝 [Storage] Criando walk com dados:', walk);
    
    // Garantir que as datas sejam objetos Date válidos
    const walkData: InsertWalk = {
      id: walk.id || crypto.randomUUID(),
      walker_id: walk.walker_id,
      client_id: walk.client_id,
      service_plan_id: walk.service_plan_id,
      scheduled_date: walk.scheduled_date instanceof Date 
        ? walk.scheduled_date 
        : new Date(walk.scheduled_date),
      scheduled_time: walk.scheduled_time,
      duration_minutes: walk.duration_minutes || 60,
      status: walk.status || 'scheduled',
      pickup_location: walk.pickup_location || null,
      dropoff_location: walk.dropoff_location || null,
      special_instructions: walk.special_instructions || null,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    // Validar se a data não é inválida
    if (isNaN(walkData.scheduled_date.getTime())) {
      throw new Error('Invalid scheduled_date provided');
    }
    
    console.log('📝 [Storage] Dados processados para walk:', walkData);
    
    const result = await db.insert(schema.walks).values(walkData).returning();
    console.log('✅ [Storage] Walk criada com sucesso:', result[0]);
    
    return result[0];
  } catch (error: any) {
    console.error('❌ [Storage] Erro ao criar walk:', error);
    console.error('❌ [Storage] Stack trace:', error.stack);
    throw new Error(`Failed to create walk: ${error.message}`);
  }
}