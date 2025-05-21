const fs = require('fs');
const path = require('path');

// Configurações para a região de Registro
const baseCoordinates = { lat: -24.5, lng: -48.5 };
const radius = 0.2; // Raio de 20 km
const numberOfPoints = 500;

// Função para gerar coordenadas aleatórias dentro de um raio
function getRandomCoordinates(base, radius) {
  const randomAngle = Math.random() * 2 * Math.PI;
  const randomRadius = Math.random() * radius;
  const offsetLat = randomRadius * Math.cos(randomAngle);
  const offsetLng = randomRadius * Math.sin(randomAngle);
  return {
    lat: base.lat + offsetLat,
    lng: base.lng + offsetLng,
  };
}

// Função para gerar intensidade e severidade aleatórias
function getRandomIntensityAndSeverity() {
  const intensity = Math.random();
  let severity;
  if (intensity < 0.1) severity = 'none';
  else if (intensity < 0.3) severity = 'low';
  else if (intensity < 0.6) severity = 'medium';
  else if (intensity < 0.8) severity = 'high';
  else severity = 'severe';
  return { intensity, severity };
}

// Função para gerar uma data aleatória dentro de um intervalo
function getRandomDate(start, end) {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
}

// Gerar os pontos
const points = [];
for (let i = 0; i < numberOfPoints; i++) {
  const { lat, lng } = getRandomCoordinates(baseCoordinates, radius);
  const { intensity, severity } = getRandomIntensityAndSeverity();
  const date = getRandomDate(new Date('2025-01-01'), new Date('2025-12-31'));

  points.push({
    type: 'Feature',
    properties: { intensity, date, severity },
    geometry: { type: 'Point', coordinates: [lng, lat] },
  });
}

// Carregar o arquivo existente
const filePath = path.join(__dirname, '../public/pontos-infeccao.json');
const existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Adicionar os novos pontos
existingData.features.push(...points);

// Salvar o arquivo atualizado
fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

console.log(`${numberOfPoints} pontos de infecção adicionados à região de Registro.`);
