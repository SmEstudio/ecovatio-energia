/**
 * ==============================================================================
 * EcoVatio - Configuración Centralizada de Google AdSense
 * ==============================================================================
 * Instrucciones de Activación:
 * 1. Para mostrar anuncios reales en producción:
 *    - Asigna `enabled: true`
 *    - Introduce tu Publisher ID en `client` (ejemplo: 'ca-pub-XXXXXXXXXXXXXXX')
 *    - Asigna los IDs de los bloques creados en Google AdSense
 * 2. Si `enabled: true`, el sitio web muestra elegantes bloques de diseño
 *    rotulados con 'PUBLICIDAD', cumpliendo las directrices de aprobación de Google.
 */

const ADS_CONFIG = {
  client: "ca-pub-7959072629123030",
  enabled: true,
  slots: {
    header: "2000000001",
    inArticle: "2000000002",
    sidebar: "2000000003",
    footer: "2000000004"
  }
};

function initAdSense() {
  const adContainers = document.querySelectorAll('.ad-box[data-ad-slot]');

  if (!ADS_CONFIG.enabled || ADS_CONFIG.client.includes('XXXXXXXX')) {
    adContainers.forEach(container => {
      const slotType = container.getAttribute('data-ad-slot');
      let sizeText = "Banner Responsivo";
      if (slotType === 'header') sizeText = "Banner Superior (728x90 / Responsivo)";
      if (slotType === 'sidebar') sizeText = "Banner Lateral (300x250 / 300x600)";
      if (slotType === 'inArticle') sizeText = "Anuncio en Artículo (Nativo In-Feed)";
      if (slotType === 'footer') sizeText = "Banner Inferior (970x90 / Responsivo)";

      container.innerHTML = `
        <div class="ad-placeholder-text">
          <strong>Espacio Publicitario AdSense</strong><br>
          <small>${sizeText}</small><br>
          <span style="font-size: 0.72rem; color: #94a3b8; margin-top: 4px; display: inline-block;">
            Configurar en js/ads-config.js
          </span>
        </div>
      `;
    });
    return;
  }

  if (!document.getElementById('adsense-script')) {
    const script = document.createElement('script');
    script.id = 'adsense-script';
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CONFIG.client}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }

  adContainers.forEach(container => {
    const slotType = container.getAttribute('data-ad-slot');
    const slotId = ADS_CONFIG.slots[slotType] || '';
    if (!slotId) return;

    container.innerHTML = `
      <ins class="adsbygoogle"
           style="display:block"
           data-ad-client="${ADS_CONFIG.client}"
           data-ad-slot="${slotId}"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    `;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn("AdSense no inicializado:", e);
    }
  });
}

document.addEventListener('DOMContentLoaded', initAdSense);
