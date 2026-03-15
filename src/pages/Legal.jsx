import React from 'react';
import { Link } from 'react-router-dom';

const Legal = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-body text-slate-800 py-10 px-4 md:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 shadow-sm border border-slate-200 rounded-2xl">

                <div className="mb-12 border-b border-slate-200 pb-6">
                    <Link to="/" className="text-sm text-slate-500 hover:text-primary mb-4 inline-block font-bold transition-colors">
                        &larr; Retour à l'accueil
                    </Link>
                    <h1 className="text-3xl font-title font-bold text-darker uppercase tracking-wide">Mentions Légales & CGV</h1>
                    <p className="text-sm text-slate-500 mt-2">Dernière mise à jour : 02/02/2026</p>
                </div>

                <div className="space-y-12 text-sm md:text-base leading-relaxed text-justify">

                    {/* SECTION 1 : MENTIONS LÉGALES */}
                    <section>
                        <h2 className="text-xl font-title font-bold uppercase mb-4 text-primary">1. Mentions Légales</h2>
                        <p className="mb-4">
                            Conformément aux dispositions des articles 6-III et 19 de la loi n°2004-575 du 21 juin 2004 pour la Confiance dans l'économie numérique (LCEN), il est porté à la connaissance des utilisateurs et visiteurs du site <strong>miss-delice.com</strong> (ci-après le "Site") les présentes mentions légales.
                        </p>

                        <div className="mb-6 bg-slate-50 p-5 rounded-xl border border-slate-100">
                            <h3 className="font-bold mb-3 text-darker">A. ÉDITEUR DU SITE (LA BOUTIQUE)</h3>
                            <p>
                                L'édition du Site et l'exploitation de la boutique sont assurées par :<br/>
                                <strong>Nom de la société :</strong> [NOM EXACT DE LA SOCIETE, ex: SASU MISS DELICE]<br/>
                                <strong>Capital social :</strong> [MONTANT] euros<br/>
                                <strong>Siège social :</strong> 6 place Jean Jaurès, 26250 Livron-sur-Drôme<br/>
                                <strong>Immatriculation :</strong> RCS de [VILLE DU TRIBUNAL] sous le numéro SIRET [NUMERO SIRET]<br/>
                                <strong>TVA Intracommunautaire :</strong> [NUMERO DE TVA ou "Non applicable, article 293 B du CGI"]<br/>
                            </p>
                            <p className="mt-3">
                                <strong>Directeur de la publication :</strong> Laurie Lafleur<br/>
                                <strong>Contact téléphonique :</strong> [NUMÉRO DE TÉLÉPHONE DE LA BOUTIQUE]<br/>
                                <strong>Adresse e-mail :</strong> [ADRESSE EMAIL DE CONTACT]
                            </p>
                        </div>

                        <div className="mb-6 bg-slate-50 p-5 rounded-xl border border-slate-100">
                            <h3 className="font-bold mb-3 text-darker">B. CRÉATION ET HÉBERGEMENT</h3>
                            <p>
                                <strong>Création et développement :</strong> Laurie Lafleur
                            </p>
                            <p className="mt-2">
                                <strong>Hébergeur :</strong> Le site est hébergé par la société Vercel Inc.<br/>
                                <strong>Siège social de l'hébergeur :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.<br/>
                                <strong>Contact hébergeur :</strong> privacy@vercel.com
                            </p>
                        </div>
                    </section>

                    {/* SECTION 2 : DONNÉES PERSONNELLES (RGPD) */}
                    <section>
                        <h2 className="text-xl font-title font-bold uppercase mb-4 text-primary">2. Données Personnelles (RGPD)</h2>
                        <p className="mb-4">
                            Dans le cadre de la prise de commande en ligne (Click & Collect ou Livraison), l'Éditeur est amené à collecter des données personnelles (Nom, Téléphone, Email, Adresse postale).
                            Ces données sont strictement nécessaires au traitement et à la préparation des commandes. Elles ne sont en aucun cas vendues ou cédées à des tiers.
                        </p>
                        <p className="mb-4">
                            Conformément à la loi "Informatique et Libertés" n°78-17 du 6 janvier 1978 modifiée et au Règlement Européen 2016/679 (RGPD), l'Utilisateur dispose d'un droit d'accès, de rectification, de portabilité, d'effacement de ses données, ou d'une limitation du traitement.
                        </p>
                        <p>
                            Pour exercer ces droits, l'Utilisateur peut contacter le responsable du traitement à l'adresse e-mail suivante : <strong>[ADRESSE EMAIL]</strong>.
                        </p>
                    </section>

                    {/* SECTION 3 : CGV */}
                    <section className="border-t border-slate-200 pt-8 mt-8">
                        <h2 className="text-xl font-title font-bold uppercase mb-6 text-primary">3. Conditions Générales de Vente (CGV)</h2>

                        <div className="mb-5">
                            <h3 className="font-bold mb-2 text-darker">3.1. OBJET</h3>
                            <p>Les présentes CGV régissent les ventes de denrées alimentaires (crêpes, churros, gaufres, boissons, etc.) effectuées via le site miss-delice.com pour un retrait en boutique (Click & Collect) ou une livraison de proximité.</p>
                        </div>

                        <div className="mb-5">
                            <h3 className="font-bold mb-2 text-darker">3.2. PRIX ET PAIEMENT</h3>
                            <p>Les prix affichés sur le site sont indiqués en euros (€) toutes taxes comprises (TTC). Miss Délice se réserve le droit de modifier ses prix à tout moment. Le paiement des commandes s'effectue exclusivement lors de la réception de la commande (au comptoir de la boutique ou lors de la livraison), par les moyens de paiement acceptés sur place.</p>
                        </div>

                        <div className="mb-5">
                            <h3 className="font-bold mb-2 text-darker">3.3. COMMANDES ET REMISE DES PRODUITS</h3>
                            <p><strong>Retrait sur place :</strong> Les commandes sont préparées pour l'heure de retrait choisie par le client lors de la validation. En cas de retard du client, la qualité des produits chauds ne pourra être garantie.</p>
                            <p className="mt-2"><strong>Livraison :</strong> L'option de livraison proposée sur le Site est systématiquement soumise à validation téléphonique préalable par notre équipe. Si nous sommes dans l'incapacité d'assurer la livraison, la commande devra être récupérée sur place ou annulée.</p>
                        </div>

                        <div className="mb-5">
                            <h3 className="font-bold mb-2 text-darker text-red-600">3.4. ABSENCE DE DROIT DE RÉTRACTATION</h3>
                            <p>
                                Conformément à l'article L.221-28 4° du Code de la consommation, le droit de rétractation ne s'applique pas aux contrats de fourniture de biens susceptibles de se détériorer ou de se périmer rapidement.
                                S'agissant de produits alimentaires frais préparés sur commande, <strong>aucune commande validée et en cours de préparation ne pourra être annulée ou remboursée.</strong>
                            </p>
                        </div>

                        <div className="mb-5">
                            <h3 className="font-bold mb-2 text-darker">3.5. ALLERGÈNES ET SANTÉ</h3>
                            <p>Les informations concernant la présence d'allergènes à déclaration obligatoire (arachides, gluten, lait, œufs, fruits à coque, etc.) dans nos préparations sont tenues à la disposition des clients en boutique. En cas d'allergie sévère, le client est tenu de nous en informer avant toute commande.</p>
                        </div>

                        <div className="mb-5 bg-orange-50 p-4 rounded-lg border border-orange-100">
                            <h3 className="font-bold mb-2 text-darker">3.6. MÉDIATION DE LA CONSOMMATION</h3>
                            <p>
                                Conformément aux articles L.616-1 et R.616-1 du Code de la consommation, nous proposons un dispositif de médiation de la consommation.
                                En cas de litige, vous pouvez déposer votre réclamation auprès de notre médiateur :
                                <br/><strong>[NOM DU MÉDIATEUR CHOISI PAR LA GÉRANTE, ex: SAS Médiation Solution]</strong>
                                <br/>Site web : https://executive-education.ut-capitole.fr/accueil/formez-vous/diplome-duniversite-de-mediation-droit-et-pratiques-de-la-mediation-en-matiere-civile-commerciale-et-sociale-formation-continue
                            </p>
                        </div>
                    </section>

                    {/* SECTION 4 : PROPRIÉTÉ INTELLECTUELLE */}
                    <section>
                        <h2 className="text-xl font-title font-bold uppercase mb-4 text-primary">4. Propriété Intellectuelle</h2>
                        <p>
                            Toute utilisation, reproduction, diffusion, commercialisation ou modification de tout ou partie du Site (textes, images, logos, design), sans autorisation expresse et préalable de l'Éditeur est strictement prohibée et pourra entraîner des actions et poursuites judiciaires telles que prévues par le Code de la propriété intellectuelle.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default Legal;