// No arquivo server/routes/walks.ts, ajuste o endpoint POST:

app.post('/api/walks', async (req, res) => {
  try {
    console.log('📝 [API] Recebendo dados para criar walk:', req.body);
    
    const {
      id,
      walker_id,
      client_id,
      service_plan_id,
      scheduled_date,
      scheduled_time,
      duration_minutes,
      status,
      pickup_location,
      dropoff_location,
      special_instructions
    } = req.body;

    // Validação de campos obrigatórios
    if (!walker_id || !client_id || !service_plan_id || !scheduled_date || !scheduled_time) {
      console.error('❌ [API] Campos obrigatórios faltando:', {
        walker_id: !!walker_id,
        client_id: !!client_id,
        service_plan_id: !!service_plan_id,
        scheduled_date: !!scheduled_date,
        scheduled_time: !!scheduled_time
      });
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['walker_id', 'client_id', 'service_plan_id', 'scheduled_date', 'scheduled_time']
      });
    }

    // Validar formato da data
    const dateObj = new Date(scheduled_date);
    if (isNaN(dateObj.getTime())) {
      console.error('❌ [API] Data inválida:', scheduled_date);
      return res.status(400).json({ error: 'Invalid scheduled_date format' });
    }

    const walkData = {
      id: id || crypto.randomUUID(),
      walker_id,
      client_id,
      service_plan_id,
      scheduled_date: dateObj,
      scheduled_time,
      duration_minutes: duration_minutes || 60,
      status: status || 'scheduled',
      pickup_location: pickup_location || null,
      dropoff_location: dropoff_location || null,
      special_instructions: special_instructions || null
    };

    console.log('📝 [API] Dados processados:', walkData);

    const walk = await storage.createWalk(walkData);
    
    console.log('✅ [API] Walk criada com sucesso:', walk);
    res.json(walk);
  } catch (error: any) {
    console.error('❌ [API] Erro ao criar walk:', error);
    console.error('❌ [API] Stack trace:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});