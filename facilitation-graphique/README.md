# Moteur de facilitation graphique

Petit moteur JavaScript, sans dépendance, qui dessine des visuels de facilitation graphique en SVG : capitales tracées trait par trait (cinq variations), cadres, bulles, liens, personnages, pictos, et quelques structures toutes faites (étapes, cycle, matrice, carte mentale).

## Fichiers

- `moteur-fg-v3.min.js` : la version courante, compacte, à charger dans une page.
- `moteur-fg-v3.js` : la même version, lisible.
- `moteur-fg-v1.*`, `moteur-fg-v2.*` : les versions précédentes, conservées pour les visuels qui les référencent.

La v2 a ajouté la structure « couloirs » (un sujet par ligne, le temps en colonnes), le corps de flèche réglable et une alerte quand un texte a dû être fortement réduit. La v3 permet d'écrire plusieurs textes côte à côte dans une même forme, et ajoute aux couloirs les pictos d'intitulés et les sujets en bande pleine largeur.

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
<script src="https://cdn.jsdelivr.net/gh/ThomasFlo/agents@main/facilitation-graphique/moteur-fg-v3.min.js"></script>
<script>FG.dessine(VISUEL);</script>
</body></html>
```

La page affiche le dessin et trois boutons : GRILLE (repères pour recopier à la main), PNG et SVG.

## Versions

jsDelivr met plusieurs heures à voir un nouveau fichier derrière `@main` : pour un fichier tout juste poussé, remplace `@main` par `@` suivi de l'identifiant du commit.

Un fichier publié n'est jamais modifié : une évolution du moteur donne un nouveau fichier (`moteur-fg-v2.min.js`), pour que les visuels existants continuent de s'afficher.
