/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // On garde l'ADN mais on mature les tons
                'primary': '#38BDF8',   // Sky-400 : Un bleu un peu plus lumineux
                'primary-dark': '#0284C7',

                // NOUVEAU : La couleur clé pour le fond "Gourmand"
                'cream': '#FDFBF7', // Un blanc cassé très chaud (presque vanille)
                'paper': '#ffffff', // Pour les cartes

                'accent': '#F59E0B',
                'accent-red': '#FB7185', // Rose-400 : Plus doux que le rouge vif, plus "bonbon"

                'dark': '#334155',      // Slate-700 : Plus doux que le noir
                'darker': '#0F172A',    // Slate-900 : Pour les titres
            },
            fontFamily: {
                // Fredoka est plus moderne et géométrique que Baloo, tout en restant ronde
                'title': ['"Fredoka"', 'sans-serif'],
                'body': ['"Quicksand"', 'sans-serif'], // Quicksand est super lisible et friendly
            },
            backgroundImage: {
                'pattern-dots': "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
            }
        },
    },
    plugins: [],
}