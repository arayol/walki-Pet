
export const calculateDistance = (cep1: string, cep2: string): number => {
  // Remover formatação dos CEPs
  const cleanCep1 = cep1.replace(/\D/g, '');
  const cleanCep2 = cep2.replace(/\D/g, '');
  
  console.log(`🔍 Comparing CEPs: ${cleanCep1} vs ${cleanCep2}`);
  
  // Se os CEPs são exatamente iguais, distância = 0
  if (cleanCep1 === cleanCep2) {
    console.log(`✅ Exact CEP match: ${cleanCep1} = ${cleanCep2}`);
    return 0;
  }
  
  // Calcular distância baseada na similaridade dos CEPs
  // Primeiros 2 dígitos = região (diferença x 50km)
  // Primeiros 5 dígitos = área (diferença x 2km)
  const prefix1_2 = parseInt(cleanCep1.substring(0, 2));
  const prefix2_2 = parseInt(cleanCep2.substring(0, 2));
  const prefix1_5 = parseInt(cleanCep1.substring(0, 5));
  const prefix2_5 = parseInt(cleanCep2.substring(0, 5));
  
  // Se os primeiros 5 dígitos são iguais, distância pequena
  if (prefix1_5 === prefix2_5) {
    const distance = Math.abs(parseInt(cleanCep1.substring(5)) - parseInt(cleanCep2.substring(5))) * 0.1;
    console.log(`📏 Same area (first 5 digits): distance = ${distance}km`);
    return distance;
  }
  
  // Se os primeiros 2 dígitos são iguais, distância média
  if (prefix1_2 === prefix2_2) {
    const distance = Math.abs(prefix1_5 - prefix2_5) * 2;
    console.log(`📏 Same region (first 2 digits): distance = ${distance}km`);
    return distance;
  }
  
  // Regiões diferentes, distância grande
  const distance = Math.abs(prefix1_2 - prefix2_2) * 50;
  console.log(`📏 Different regions: distance = ${distance}km`);
  return distance;
};
