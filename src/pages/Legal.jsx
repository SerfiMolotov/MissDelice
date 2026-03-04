import React from 'react';
import { Link } from 'react-router-dom';

const Legal = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 py-10 px-4 md:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 shadow-sm border border-slate-200">

                <div className="mb-12 border-b border-slate-200 pb-6">
                    <Link to="/" className="text-sm text-slate-500 hover:text-black mb-4 inline-block">
                        &larr; Retour au site
                    </Link>
                    <h1 className="text-3xl font-bold uppercase tracking-wide">Mentions Légales & CGV</h1>
                    <p className="text-sm text-slate-500 mt-2">En vigueur au 02/02/2026</p>
                </div>

                <div className="space-y-10 text-sm md:text-base leading-relaxed text-justify">

                    <section>
                        <h2 className="text-lg font-bold uppercase mb-4 text-black">1. Mentions Légales</h2>
                        <p className="mb-4">
                            Conformément aux dispositions de la loi n°2004-575 du 21 juin 2004 pour la Confiance en l’économie numérique, il est porté à la connaissance des utilisateurs et visiteurs, ci-après l' "Utilisateur", du site <strong>missdelice.com</strong>, ci-après le "Site", les présentes mentions légales.
                        </p>
                        <p className="mb-4">
                            La connexion et la navigation sur le Site par l’Utilisateur implique acceptation intégrale et sans réserve des présentes mentions légales. Ces dernières sont accessibles sur le Site à la rubrique "Mentions légales".
                        </p>

                        <div className="mb-4">
                            <h3 className="font-bold underline mb-2">ÉDITION DU SITE</h3>
                            <p>
                                L'édition du Site est assurée par la société Miss Délice, SAS au capital de 20 000 euros, immatriculée au Registre du Commerce et des Sociétés de _______________ sous le numéro _______________ dont le siège social est situé au _______________.
                            </p>
                            <ul className="mt-2 pl-4 list-disc">
                                <li>Numéro de téléphone : _______________</li>
                                <li>Adresse e-mail : _______________</li>
                                <li>N° de TVA intracommunautaire : _______________</li>
                                <li>Directeur de la publication : _______________</li>
                            </ul>
                            <p className="mt-2 italic">ci-après l'"Editeur".</p>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-bold underline mb-2">HÉBERGEUR</h3>
                            <p>
                                L'hébergeur du Site est la société OVH, dont le siège social est situé au 6 place Jean Jaurès 26250 Livron-sur-Drôme.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold underline mb-2">ACCÈS AU SITE</h3>
                            <p>
                                Le Site est normalement accessible, à tout moment, à l'Utilisateur. Toutefois, l'Editeur pourra, à tout moment, suspendre, limiter ou interrompre le Site afin de procéder, notamment, à des mises à jour ou des modifications de son contenu. L'Editeur ne pourra en aucun cas être tenu responsable des conséquences éventuelles de cette indisponibilité sur les activités de l'Utilisateur.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold uppercase mb-4 text-black">2. Collecte des données</h2>
                        <p className="mb-4">
                            Le Site assure à l'Utilisateur une collecte et un traitement des données personnelles dans le respect de la vie privée conformément à la loi n°78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers aux libertés et dans le respect de la règlementation applicable en matière de traitement des données à caractère personnel conformément au règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 (ci-après, ensemble, la "Règlementation applicable en matière de protection des Données à caractère personnel").
                        </p>
                        <p className="mb-4">
                            En vertu de la Règlementation applicable en matière de protection des Données à caractère personnel, l'Utilisateur dispose d'un droit d'accès, de rectification, de suppression et d'opposition de ses données personnelles. L'Utilisateur peut exercer ce droit :
                        </p>
                        <ul className="list-disc pl-5">
                            <li>par mail à l'adresse email _______________</li>
                            <li>depuis le formulaire de contact.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold uppercase mb-4 text-black">3. Propriété Intellectuelle</h2>
                        <p>
                            Toute utilisation, reproduction, diffusion, commercialisation, modification de toute ou partie du Site, sans autorisation expresse de l’Editeur est prohibée et pourra entraîner des actions et poursuites judiciaires telles que prévues par la règlementation en vigueur.
                        </p>
                    </section>

                    <section className="border-t border-slate-200 pt-8 mt-8">
                        <h2 className="text-lg font-bold uppercase mb-4 text-black">4. Conditions Générales de Vente (CGV)</h2>

                        <div className="mb-4">
                            <h3 className="font-bold underline mb-2">PRIX ET PAIEMENT</h3>
                            <p>Les prix sont indiqués en euros (€) toutes taxes comprises. Le paiement s'effectue selon les modalités proposées lors de la validation de la commande (en ligne ou au comptoir).</p>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-bold underline mb-2">RETRAIT DES PRODUITS</h3>
                            <p>Les produits sont à retirer exclusivement en boutique à l'adresse du siège social aux horaires d'ouverture indiqués.</p>
                        </div>

                        <div className="bg-slate-50 p-4 border border-slate-200">
                            <h3 className="font-bold underline mb-2">ABSENCE DE DROIT DE RÉTRACTATION</h3>
                            <p>
                                Conformément à l'article L.221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les contrats de fourniture de biens susceptibles de se détériorer ou de se périmer rapidement (produits alimentaires frais). En conséquence, toute commande validée sur le Site est ferme et définitive.
                            </p>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default Legal;