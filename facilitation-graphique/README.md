# Moteur de facilitation graphique

Petit moteur JavaScript, sans dépendance, qui dessine des visuels de facilitation graphique en SVG : capitales tracées trait par trait (cinq variations), cadres, bulles, liens, personnages, pictos, et quelques structures toutes faites (étapes, cycle, matrice, carte mentale).

## Fichiers

- `moteur-fg-v1.min.js` : la version compacte, à charger dans une page.
- `moteur-fg-v1.js` : la même version, lisible.

## Utilisation

```html
<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>Mon visuel</title></head><body>
<script>
const VISUEL = {
  titre: "Mon *visuel*",
  grille: [32, 18],
  elements: [
    { t: "cadre", id: "a", x: 2, y: 5, w: 7, h: 3, texte: "Un acteur", ombre: true },
    { t: "cadre", id: "b", x: 14, y: 5, w: 7, h: 3, forme: "nuage", texte: "Une idée" },
    { t: "lien", de: "a", vers: "b", texte: "un lien" }
  ]
};
</script>
<script src="https://cdn.jsdelivr.net/gh/ThomasFlo/agents@main/facilitation-graphique/moteur-fg-v1.min.js"></script>
<script>FG.dessine(VISUEL);</script>
</body></html>
```

La page affiche le dessin et trois boutons : GRILLE (repères pour recopier à la main), PNG et SVG.

## Versions

Un fichier publié n'est jamais modifié : une évolution du moteur donne un nouveau fichier (`moteur-fg-v2.min.js`), pour que les visuels existants continuent de s'afficher.
