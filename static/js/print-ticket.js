/**
 * Impression d'un ticket dans un iframe autonome, isole du reste de la page.
 *
 * Objectif : window.print() sur la page complete oblige a masquer tout le
 * reste (tableaux, navbar, modales Bootstrap...) via CSS, ce qui peut faire
 * gonfler artificiellement le nombre de pages calcule par le navigateur et
 * dupliquer le ticket sur chaque page (notamment a cause des modales en
 * position:fixed). En imprimant depuis un iframe qui ne contient QUE le
 * ticket, ce risque disparait completement : il n'y a rien d'autre a cacher.
 */
function imprimerTicket(html, cssHref) {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-9999px';
    iframe.style.top = '0';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.border = '0';

    // srcdoc declenche un seul evenement load fiable, une fois le HTML et sa
    // feuille de style charges. document.write() sur un iframe fraichement
    // attache peut declencher onload deux fois (document vide initial, puis
    // contenu ecrit), et provoquer une impression prematuree/vide.
    iframe.onload = function () {
        let retire = false;
        const retirerIframe = function () {
            if (retire) return;
            retire = true;
            iframe.remove();
        };

        // afterprint se declenche une fois la boite de dialogue fermee par
        // l'utilisateur : c'est le signal fiable pour nettoyer, quelle que
        // soit la taille du lot (window.print() n'est pas garanti bloquant
        // sur tous les navigateurs, surtout pour un gros lot de billets qui
        // met plus de temps a etre mis en page). Le setTimeout n'est qu'un
        // filet de securite si l'evenement ne se declenche pas.
        iframe.contentWindow.onafterprint = retirerIframe;
        setTimeout(retirerIframe, 60000);

        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    };

    iframe.srcdoc =
        '<!DOCTYPE html><html><head><meta charset="utf-8">' +
        '<link rel="stylesheet" href="' + cssHref + '">' +
        '</head><body><div id="ticketsContainer">' + html + '</div></body></html>';

    document.body.appendChild(iframe);
}
