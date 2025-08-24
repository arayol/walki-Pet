// No arquivo client/src/hooks/useIntegratedBookingPayment.tsx
// Substitua a parte de criação das walks (linha 85-95 aproximadamente):

// Criar walks individuais via PostgreSQL
console.log('🔍 Criando walks via PostgreSQL:', walkData);

const walkPromises = walkData.map(async (walk) => {
  // Garantir que todos os campos obrigatórios estão presentes
  const walkPayload = {
    id: crypto.randomUUID(),
    walker_id: selectedPlan.walker_id,
    client_id: clientId,
    service_plan_id: selectedPlan.id,
    scheduled_date: walk.scheduled_date, // Já é string ISO
    scheduled_time: walk.scheduled_time,
    duration_minutes: 60,
    status: 'scheduled' as const,
    pickup_location: null,
    dropoff_location: null,
    special_instructions: null
  };

  console.log('🔍 Payload para walk individual:', walkPayload);

  const response = await fetch(`${API_BASE_URL}/api/walks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(walkPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Erro na resposta do servidor:', errorText);
    throw new Error(`Failed to create walk: ${response.status} ${errorText}`);
  }

  const createdWalk = await response.json();
  console.log('✅ Walk criada:', createdWalk);
  return createdWalk;
});

const walks = await Promise.all(walkPromises);