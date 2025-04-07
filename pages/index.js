import fs from 'fs';
import path from 'path';

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'data', 'sneakers.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const sneakers = JSON.parse(fileContents);

  return {
    props: {
      sneakers
    },
    revalidate: 3600 // revaliduj každú hodinu (pre istotu)
  };
}

export default function Home({ sneakers }) {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Sneaker Checker 👟</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {sneakers.map((sneaker, i) => (
          <div key={i} style={{
            border: '1px solid #ddd',
            padding: '1rem',
            borderRadius: '10px',
            backgroundColor: sneaker.available ? '#e8ffe8' : '#ffe8e8'
          }}>
            <h3>{sneaker.name}</h3>
            {sneaker.image && <img src={sneaker.image} alt={sneaker.name} style={{ width: '100%', borderRadius: '8px' }} />}
            <p><strong>Cena:</strong> {sneaker.price || 'Neznáma'}</p>
            <p><strong>Stav:</strong> {sneaker.available ? '✅ Dostupné' : '❌ Nedostupné'}</p>
            <a href={sneaker.url} target="_blank" rel="noopener noreferrer">➡️ Pozrieť</a>
          </div>
        ))}
      </div>
    </div>
  );
}
