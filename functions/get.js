/**
 * /get — redirection vers le bon store selon l'appareil, avec comptage.
 *
 * Sert de page d'atterrissage aux campagnes vidéo YouTube (boost des Shorts).
 * Deux raisons d'exister plutôt que de mettre un lien store direct dans la pub :
 *
 *  1. UN SEUL LIEN pour les deux plateformes (Google Ads n'accepte qu'une URL
 *     finale par annonce).
 *  2. NE PAS FAUSSER LA MESURE. Une campagne d'acquisition est en cours
 *     (450 €) : son verdict compare les installs payées à la baseline
 *     organique. Les installs venues d'ici arriveraient sans attribution et
 *     gonfleraient cette baseline. Côté Android le referrer taggué permet de
 *     les isoler après coup ; côté iOS rien n'est attribuable — d'où le
 *     comptage des DÉPARTS par OS, qui borne le bruit injecté.
 *
 * Paramètre optionnel : ?c=<campagne> (défaut yt_boost).
 */

const PLAY_ID = 'com.tajweed.quran_tajweed';
const APPSTORE_ID = '6749209998';
const SUPABASE_URL = 'https://pvldiqvtcbwzfndnofqj.supabase.co';
// Clé anon (publique par conception, comme dans l'app) — l'écriture passe par
// un RPC SECURITY DEFINER, la table elle-même est en deny-all.
const SUPABASE_ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2bGRpcXZ0Y2J3emZuZG5vZnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NTk5NDYsImV4cCI6MjA4OTAzNTk0Nn0.kcQQbaSKdy4gbesZlHFbhouUSLD02hajOSnNqzG6ZzQ';

function detecterOs(ua) {
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  // « Android » apparaît aussi dans certains UA de TV/box : on garde large,
  // le pire cas est un renvoi vers le Play Store qui est le bon magasin.
  if (/Android/i.test(ua)) return 'android';
  return 'other';
}

function destination(os, campagne) {
  if (os === 'android') {
    // Le referrer est capté par l'app au premier lancement (Play Install
    // Referrer). utm_medium=video et NON cpc : sans quoi l'app classerait ces
    // installs en « google_ads » et elles pollueraient la cellule du verdict
    // Android. Ici elles restent en organic_play, mais utm_source=yt_boost
    // permet de les retrancher de la baseline en SQL.
    const referrer = encodeURIComponent(
      `utm_source=yt_boost&utm_medium=video&utm_campaign=${campagne}`
    );
    return `https://play.google.com/store/apps/details?id=${PLAY_ID}&referrer=${referrer}`;
  }
  if (os === 'ios') {
    // ct = campaign token d'App Store Analytics (visible dans App Store
    // Connect → Acquisition). Sans provider token il peut être ignoré par
    // Apple ; le comptage des départs ci-dessous reste la mesure fiable.
    return `https://apps.apple.com/app/id${APPSTORE_ID}?ct=${campagne}&mt=8`;
  }
  return 'https://hamil-al-quran.com/';
}

async function compter(os, pays, campagne, referer) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/rpc/acq_redirect_track`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${SUPABASE_ANON}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_os: os,
        p_country: pays,
        p_campaign: campagne,
        p_referer: referer,
      }),
    });
  } catch (_) {
    // Le comptage ne doit JAMAIS empêcher la redirection : on avale l'erreur.
  }
}

export async function onRequestGet(context) {
  const { request, waitUntil } = context;
  const ua = request.headers.get('user-agent') || '';
  const pays = request.headers.get('cf-ipcountry') || '';
  const referer = request.headers.get('referer') || '';
  const url = new URL(request.url);
  const campagne = (url.searchParams.get('c') || 'yt_boost').slice(0, 40);

  const os = detecterOs(ua);
  // waitUntil : la redirection part immédiatement, le comptage finit après.
  waitUntil(compter(os, pays, campagne, referer));

  return new Response(null, {
    status: 302,
    headers: {
      Location: destination(os, campagne),
      // Jamais de cache : chaque visite doit être comptée et re-routée selon
      // l'appareil du visiteur.
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
