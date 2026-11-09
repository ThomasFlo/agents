/* MOTEUR FG v2 - facilitation graphique : capitales tracees trait par trait, cadres, liens, personnages, pictos.
   Usage : FG.dessine(VISUEL). Unite = 1 carreau de la grille. Ne pas modifier ce bloc. */
var FG = (function () {
  "use strict";
  var U = 50, S = 1, K = 1, T0 = .6, out, warn, box, chk, paper, ACC;
  var COL = { noir: "#1b1b1b", orange: "#f26a1b", bleu: "#1789c4", vert: "#3d9a4a", rouge: "#d63a2f", violet: "#7b4fa3", gris: "#8a8a8a",
    beige: "#e9dcc6", jaune: "#ffe37a", rose: "#f9c6cf", ciel: "#c5e6f6", menthe: "#cdecca", blanc: "#ffffff", ombre: "#d3ccc0" };
  /* police : [epaisseur du trait / hauteur, decalage du trait double (0 = pas de doublage)] */
  var PO = { basique: [.1, 0], grasse: [.1, .9], extra: [.175, 0], enrichie: [.07, 2.8], fine: [.045, 0] };
  /* lettres : "largeur trait trait..." ; point = 2 caracteres base 36 (x de 0 a 8, y de 0 en haut a c=12 sur la ligne de base)
     ~ = courbe ouverte, o = courbe fermee, e = ellipse, sinon ligne brisee. Le premier trait est celui qu'on double (grasse / enrichie). */
  var GL = {
    A: "6 0c30 306c 1858", B: "6 000c ~00505606 ~06666c0c", C: "6 ~6250000c5c6a", D: "6 000c ~00606c0c", E: "5 50000c5c 0646",
    F: "5 50000c 0646", G: "6 ~6250000c6c67 6737", H: "6 000c 606c 0666", I: "4 202c 0040 0c4c", J: "6 ~50565c0c09 2060",
    K: "6 000c 6007 256c", L: "5 000c5c", M: "8 0c00 0047808c", N: "6 0c00 006c60", O: "6 o00606c0c", P: "6 000c ~00606707",
    Q: "6 o00606c0c 496d", R: "6 000c ~00606707 276c", S: "6 ~62500006666c1c0a", T: "6 303c 0060", U: "6 ~00060c6c6660",
    V: "6 003c 3c60", W: "8 002c 2c456c80", X: "6 006c 600c", Y: "6 0036 6036 363c", Z: "6 600c 0060 0c6c",
    0: "5 o00505c0c", 1: "4 303c 0330", 2: "6 ~021060650c 0c6c", 3: "6 ~0110606626 ~26666c1c0b", 4: "6 404c 400868",
    5: "6 0005 0050 ~05646c1c0a", 6: "6 ~50030c6c660609", 7: "6 602c 0060", 8: "6 o10505616 o06666c0c", 9: "6 ~1c696000066663",
    ".": "2 1c", ",": "2 1b0e", ":": "2 15 1b", ";": "2 15 1b0e", "!": "2 1018 1c", "?": "5 ~021050552629 2c", "'": "2 1013",
    '"': "3 0003 2023", "-": "4 0747", "–": "6 0767", "—": "6 0767", _: "6 0c6c", "/": "5 500c", "(": "3 ~30063c", ")": "3 ~00360c",
    "[": "3 30000c3c", "]": "3 00303c0c", "+": "6 1757 3539", "=": "6 1555 1959", "%": "6 600c o00303303 o39696c3c",
    "&": "6 ~6c13104043080c4c67", "€": "6 ~6150000c5c6b 0545 0848", "<": "5 52075c", ">": "5 02570c", "*": "5 1359 5319 0646",
    "#": "6 201c 504c 0464 0868", "→": "8 0787 54875a", "←": "8 0787 34073a", "°": "3 o00303303"
  };
  var MK = { "́": "6 2240", "̀": "6 2042", "̂": "6 123052", "̈": "6 11 51", "̃": "6 1151", "̧": "6 ~3c4d3e2e" };
  /* pictos sur une grille 12 x 12 */
  var PI = {
    ampoule: "c e31919739 4989 5b7b 0414 b4c4 1021 b0a1", cible: "c e00c0cc0c e33939939 66", etoile: "c 6084c497ab692b37044460", coche: "c 164ab1",
    croix: "c 11bb b11b", attention: "c 60cb0b60 6468 6a", horloge: "c e00c0cc0c 626696", coeur: "c ~6b05005063 ~6bc5c07063",
    drapeau: "c 202c 20a326", loupe: "c e00808808 77bb", nuage: "c ~2b0b06363181a5c5cbab 2bab", soleil: "c e33939939 6061 6b6c 0616 b6c6 1122 b1a2 1b2a bbaa",
    eclair: "c 7026664ca56570", maison: "c 0660c6 262caca6 5c58787c", document: "c 1080b3bc1c10 8083b3 3676 3989", cadenas: "c 25b5bc2c25 ~45408085 69",
    montagne: "c 0c446792cc 9290 90b192", graphique: "c 010bcb 295677b2", calendrier: "c 12b2bc1c12 15b5 3034 9094", ordinateur: "c 01c1c90901 696c 3c9c",
    base: "c e10b1b414 122a b2ba ~1a1cbcba", fusee: "c o60959a3a35 3a1c 9abc 5a6c7a", bulle: "c 11b1b8683b481811", oeil: "c ~0660c6 ~066cc6 e44848844",
    sourire: "c e00c0cc0c 44 84 ~385a7a98", triste: "c e00c0cc0c 44 84 ~3a58789a", euro: "c e00c0cc0c ~9373333979 2565 2767"
  };
  var GC = {}, SUM = 275391146;
  /* controle d'integrite des tables de lettres et de pictos */
  function sum() {
    var h = 5, s = "", k, i;
    [GL, MK, PI].forEach(function (o) { for (k in o) s += k + o[k]; });
    for (i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) % 1000000007;
    return h;
  }

  function col(c, d) { return COL[c] || c || d; }
  function R(a) { S = S * 16807 % 2147483647; return (S / 1073741823.5 - 1) * a * K; }
  function r1(v) { return Math.round(v * 10) / 10; }
  function f(p) { return r1(p[0]) + " " + r1(p[1]); }
  function mid(a, b) { return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; }
  function P(d, c, sw, fill, ex) { return '<path d="' + d + '" stroke="' + c + '" stroke-width="' + r1(sw) + '" fill="' + (fill || "none") + '"' + (ex || "") + "/>"; }
  function parse(def) {
    if (GC[def]) return GC[def];
    var a = def.split(" "), g = { w: parseInt(a[0], 36), s: [] }, i, j, t, k, p;
    for (i = 1; i < a.length; i++) {
      t = a[i]; k = "l";
      if (t[0] == "~" || t[0] == "o" || t[0] == "e") { k = t[0]; t = t.slice(1); }
      p = [];
      for (j = 0; j < t.length; j += 2) p.push([parseInt(t[j], 36), parseInt(t[j + 1], 36)]);
      g.s.push({ k: k, p: p });
    }
    return GC[def] = g;
  }
  /* trace d'un trait : ligne brisee, courbe ouverte ou courbe fermee (lissage par les milieux) */
  function pd(k, p) {
    var n = p.length, d, i;
    if (k == "l") { d = "M" + f(p[0]); for (i = 1; i < n; i++) d += "L" + f(p[i]); return n < 2 ? d + "l0 .1" : d; }
    if (k == "~") { d = "M" + f(p[0]); for (i = 1; i < n - 2; i++) d += "Q" + f(p[i]) + " " + f(mid(p[i], p[i + 1])); return d + "Q" + f(p[n - 2]) + " " + f(p[n - 1]); }
    d = "M" + f(mid(p[n - 1], p[0]));
    for (i = 0; i < n; i++) {
      var a = mid(p[(i + n - 1) % n], p[i]), b = mid(p[i], p[(i + 1) % n]), c = p[i];
      d += k == "e" ? "C" + f([a[0] + (c[0] - a[0]) * .55, a[1] + (c[1] - a[1]) * .55]) + " " + f([b[0] + (c[0] - b[0]) * .55, b[1] + (c[1] - b[1]) * .55]) + " " + f(b) : "Q" + f(c) + " " + f(b);
    }
    return d + "Z";
  }
  function ink(g, X, Y, u, c, sw, dbl, yS) {
    var j = u * .13;
    g.s.forEach(function (st, i) {
      var pts = st.p.map(function (p) { return [X + p[0] * u + R(j), Y + (12 - (12 - p[1]) * (yS || 1)) * u + R(j)]; });
      out.push(P(pd(st.k, pts), c, sw));
      if (dbl && !i) {
        var lf = st.p[0][0] > g.w / 2;
        out.push(P(pd(st.k, pts.map(function (p, n) { var fx = st.p[n][0] / g.w; return [p[0] + dbl * (lf ? -fx : 1 - fx), p[1]]; })), c, sw));
      }
    });
  }
  function gl(ch) { var b = ch.normalize("NFD"); return [GL[b[0]], b]; }
  function ls(H, p) { return H * (.12 + p[0] * .85); }
  function glyph(ch, X, Y, H, p, c) {
    var q = gl(ch), b = q[1], m = b.slice(1), u = H / 12, sw = H * p[0], g, i, dy;
    if (!q[0]) return H * .3;
    g = parse(q[0]); dy = R(.016) * H;
    ink(g, X, Y + dy, u, c, sw, /[A-Z0-9]/.test(b[0]) ? sw * p[1] : 0, /[̀-̈]/.test(m) ? .8 : 1);
    for (i = 0; i < m.length; i++) if (MK[m[i]]) ink(parse(MK[m[i]]), X + (g.w - 6) * u / 2, Y + dy, u, c, sw * .9);
    return g.w * u;
  }
  function ww(s, H, p) {
    var n = 0, i, g;
    for (i = 0; i < s.length; i++) { g = gl(s[i])[0]; n += (g ? parseInt(g[0], 36) / 12 : .3) * H; }
    return n + (s.length - 1) * ls(H, p);
  }
  /* mise en lignes : inter-lettrage et interlignage serres, inter-mots plus large et regulier */
  function lay(s, w, H, p) {
    var L = [], y = 0, W = 0, sp = H * .55, LH = H * 1.34, em = 0;
    s.split("\n").forEach(function (par) {
      par = par.trim(); if (!par) return;
      var bu = /^[-•]\s+/.test(par), ind = bu ? H * .95 : 0, x = ind, cur;
      if (bu) par = par.replace(/^[-•]\s+/, "");
      if (L.length) y += H * .3;
      cur = { y: y, it: [], b: bu };
      par.split(/\s+/).forEach(function (wd) {
        var e = em, m, v;
        if (wd.length > 1 && wd[0] == "*") { wd = wd.slice(1); e = em = 1; }
        m = wd.match(/^(.+)\*([.,;:!?)]*)$/); if (m) { wd = m[1] + m[2]; em = 0; }
        if (!wd) return;
        v = ww(wd, H, p);
        if (x > ind && x + v > w) { cur.w = x - sp; W = Math.max(W, cur.w); L.push(cur); y += LH; x = ind; cur = { y: y, it: [] }; }
        cur.it.push({ s: wd, x: x, e: e }); x += v + sp;
      });
      cur.w = x - sp; W = Math.max(W, cur.w); L.push(cur); y += LH;
    });
    return { l: L, w: W, h: L.length ? y - LH + H : 0 };
  }
  function txt(s, x, y, w, h, o) {
    s = String(s == null ? "" : s).toUpperCase().replace(/Œ/g, "OE").replace(/Æ/g, "AE").replace(/[«»“”]/g, '"').replace(/[’‘]/g, "'").replace(/…/g, "...");
    if (!s.trim() || w <= 0) return 0;
    var H = o.H, p = PO[o.po] || PO.basique, L, ok, al = o.al || (/^\s*[-•]\s/m.test(s) ? "g" : "c"), y0, bx;
    for (;;) { L = lay(s, w, H, p); ok = L.h <= h + 2 && L.w <= w + 2; if (ok || H < o.H * .56) break; H *= .94; }
    if (!ok) warn.push("TEXTE TROP LONG POUR SA PLACE : « " + s.replace(/\s+/g, " ").slice(0, 30) + " »");
    else if (H < o.H * .72) warn.push("TEXTE RÉDUIT, CADRE TROP PETIT : « " + s.replace(/\s+/g, " ").slice(0, 30) + " »");
    y0 = o.va == "h" ? y : y + (h - L.h) / 2;
    bx = x + (al == "g" ? 0 : al == "d" ? w - L.w : (w - L.w) / 2);
    if (o.bg) out.push('<rect x="' + r1(bx - H * .3) + '" y="' + r1(y0 - H * .25) + '" width="' + r1(L.w + H * .6) + '" height="' + r1(L.h + H * .5) + '" fill="' + paper + '"/>');
    L.l.forEach(function (l) {
      var x0 = x + (al == "g" ? 0 : al == "d" ? w - l.w : (w - l.w) / 2);
      if (l.b) out.push(P("M" + f([x0 + H * .3, y0 + l.y + H * .55]) + "l.1 0", o.ca || o.c, H * .32));
      l.it.forEach(function (it) {
        var X = x0 + it.x, i;
        for (i = 0; i < it.s.length; i++) X += glyph(it.s[i], X, y0 + l.y, H, p, it.e ? o.ca : o.c) + ls(H, p);
      });
    });
    return { x: bx, y: y0, w: L.w, h: L.h };
  }

  /* formes : cotes legerement bombes, jonctions nettes */
  function wob(p, cl) {
    var d = "M" + f(p[0]), n = p.length, i, a, b, l;
    for (i = 1; i < (cl ? n + 1 : n); i++) {
      a = p[i - 1]; b = p[i % n]; l = Math.min(Math.hypot(b[0] - a[0], b[1] - a[1]), 400);
      d += "Q" + f([(a[0] + b[0]) / 2 + R(.012) * l, (a[1] + b[1]) / 2 + R(.012) * l]) + " " + f(b);
    }
    return d + (cl ? "Z" : "");
  }
  function ell(cx, cy, rx, ry) {
    var p = [], i, a;
    for (i = 0; i < 8; i++) { a = i * .7854 + .3927; p.push([cx + Math.cos(a) * rx * 1.082 + R(.02) * rx, cy + Math.sin(a) * ry * 1.082 + R(.02) * ry]); }
    return pd("o", p);
  }
  function rr(x, y, w, h, r) {
    var c = [[x, y, 1, 0], [x + w, y, 0, 1], [x + w, y + h, -1, 0], [x, y + h, 0, -1]], p = [], i, a, b;
    for (i = 0; i < 4; i++) { a = c[i]; b = c[(i + 3) % 4]; p.push([a[0] - b[2] * 2 * r, a[1] - b[3] * 2 * r], [a[0] + R(.01) * w, a[1] + R(.01) * h], [a[0] + a[2] * 2 * r, a[1] + a[3] * 2 * r]); }
    return pd("o", p);
  }
  function cloud(x, y, w, h) {
    var n = Math.max(7, Math.round((w + h) / U / 1.1)), d = "", i, cx = x + w / 2, cy = y + h / 2;
    function e(t, k) { return f([cx + Math.cos(t) * w / 2 * k, cy + Math.sin(t) * h / 2 * k]); }
    for (i = 0; i <= n; i++) d += i ? "Q" + e((i - .5) / n * 6.2832, 1.13 + R(.03)) + " " + e(i / n * 6.2832, .86) : "M" + e(0, .86);
    return d + "Z";
  }
  function reg(e, x, y, w, h, o) {
    var b = { x: x, y: y, w: w, h: h, o: o, n: e.id || String(e.texte || e.nom || e.t).replace(/\s+/g, " ").slice(0, 22) };
    if (e.id) box[e.id] = b;
    return b;
  }
  function cadre(e) {
    var x = e.x * U, y = e.y * U, w = e.w * U, h = e.h * U, fo = e.forme || "rect", c = col(e.couleur, COL.noir), sw = U * .065 * (e.ep || 1),
      n = Math.min(h * .45, w * .18), d, ix = U * .34, iy = U * .2, tw = w, th = h, H = (e.taille || T0) * U,
      o = { H: H, po: e.police, c: col(e.encre, COL.noir), ca: ACC, al: e.al, va: e.va },
      fill = e.fond ? col(e.fond) : /aucun|souligne|zone/.test(fo) ? "none" : fo == "postit" ? COL.jaune : paper, ex = "";
    switch (fo) {
      case "ovale": case "cercle": d = ell(x + w / 2, y + h / 2, w / 2, h / 2); ix = w * .13; iy = h * .13; break;
      case "nuage": d = cloud(x, y, w, h); ix = w * .14; iy = h * .16; break;
      case "arrondi": case "zone": d = rr(x, y, w, h, Math.min(w, h, U * 3) * .13); break;
      case "bulleronde": th = h * .78; d = rr(x, y, w, th, Math.min(w, th) * .2); ix = w * .08; break;
      case "bulle": th = h * .78; d = wob([[x, y], [x + w, y], [x + w, y + th], [x + w * .34, y + th], [x + w * .16, y + h], [x + w * .19, y + th], [x, y + th]], 1); break;
      case "bandeau": d = wob([[x, y], [x + w, y], [x + w - n, y + h / 2], [x + w, y + h], [x, y + h], [x + n, y + h / 2]], 1); ix = n + U * .1; break;
      case "chevron": d = wob([[x, y], [x + w - n, y], [x + w, y + h / 2], [x + w - n, y + h], [x, y + h], [x + n, y + h / 2]], 1); ix = n + U * .25; break;
      case "etiquette": d = wob([[x, y], [x + w - n, y], [x + w, y + h / 2], [x + w - n, y + h], [x, y + h]], 1); tw = w - n * .6; break;
      case "fleche": n *= 1.3; iy = (1 - (e.corps || .56)) / 2; d = wob([[x, y + h * iy], [x + w - n, y + h * iy], [x + w - n, y], [x + w, y + h / 2], [x + w - n, y + h], [x + w - n, y + h * (1 - iy)], [x, y + h * (1 - iy)]], 1); tw = w - n * .7; iy = h * (iy + .04); break;
      case "aucun": break;
      case "souligne": d = wob([[x, y + h], [x + w, y + h]]); break;
      default: d = wob([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], 1);
    }
    if (fo == "panneau") out.push(P(wob([[x + w / 2 - U * .12, y + h], [x + w / 2 - U * .12, y + h + U]]) + wob([[x + w / 2 + U * .12, y + h], [x + w / 2 + U * .12, y + h + U]]), c, sw));
    if (fo == "zone" || e.pointille) ex = ' stroke-dasharray="' + r1(sw * 2.5) + " " + r1(sw * 3.2) + '"';
    if (d) {
      if (e.ombre || fo == "postit" && e.ombre !== false) out.push('<path d="' + d + '" fill="' + COL.ombre + '" transform="translate(' + -U * .16 + " " + U * .16 + ')"/>');
      out.push(P(d, c, fo == "postit" ? sw * .45 : sw, fill, ex));
      if (fo == "bulleronde") out.push(P("M" + f([x + w * .22, y + th]) + "L" + f([x + w * .34, y + th]), fill, sw * 1.8), P("M" + f([x + w * .2, y + th]) + "L" + f([x + w * .15, y + h]) + "L" + f([x + w * .36, y + th]), c, sw, fill, ex));
    }
    if (fo == "zone") { o.bg = 1; o.al = "g"; o.va = "h"; o.po = e.police || "grasse"; o.c = col(e.encre, c); txt(e.texte, x + U * .55, y - H * .55, w - U * 1.1, H * 2.6, o); }
    else txt(e.texte, x + ix, y + iy, tw - 2 * ix, th - 2 * iy, o);
    if (e.num != null) {
      out.push(P(ell(x + U * .05, y + U * .05, U * .46, U * .46), ACC, sw * .6, ACC));
      txt(e.num, x - U * .45, y - U * .45, U, U, { H: U * .48, po: "grasse", c: paper });
    }
    return reg(e, x, y, w, h, /ovale|cercle|nuage/.test(fo));
  }
  function ref(v) {
    if (Array.isArray(v)) return { x: v[0] * U, y: v[1] * U, w: 0, h: 0, p: 1 };
    if (box[v]) return box[v];
    warn.push("LIEN VERS UN ÉLÉMENT INCONNU : " + v);
  }
  function clip(b, t) {
    var cx = b.x + b.w / 2, cy = b.y + b.h / 2, dx = t[0] - cx, dy = t[1] - cy, g = U * .17, hw = b.w / 2 + g, hh = b.h / 2 + g, k;
    if (b.p || !dx && !dy) return [cx, cy];
    k = b.o ? 1 / Math.hypot(dx / hw, dy / hh) : Math.min(dx ? hw / Math.abs(dx) : 1e9, dy ? hh / Math.abs(dy) : 1e9);
    return [cx + dx * k, cy + dy * k];
  }
  function lien(e) {
    var A = ref(e.de), B = ref(e.vers); if (!A || !B) return;
    var k = e.courbe || 0, c = col(e.couleur, COL.noir), br = e.trait == "branche", sw = U * (br ? .15 : .065) * (e.ep || 1), po = e.pointe || (br ? "aucune" : "fin"),
      bend = function (a, b) { return [(a[0] + b[0]) / 2 - (b[1] - a[1]) * k * .5, (a[1] + b[1]) / 2 + (b[0] - a[0]) * k * .5]; },
      m = bend([A.x + A.w / 2, A.y + A.h / 2], [B.x + B.w / 2, B.y + B.h / 2]), p0 = clip(A, m), p1 = clip(B, m), q;
    m = bend(p0, p1);
    if (e.trait == "ondule" || e.trait == "zigzag") {
      var n = Math.max(6, Math.round(Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) / U / .45)), pts = [], i, t, dx, dy, l, a;
      for (i = 0; i <= n; i++) {
        t = i / n; dx = 2 * (1 - t) * (m[0] - p0[0]) + 2 * t * (p1[0] - m[0]); dy = 2 * (1 - t) * (m[1] - p0[1]) + 2 * t * (p1[1] - m[1]); l = Math.hypot(dx, dy) || 1;
        a = i < 1 || i > n - 2 ? 0 : (i % 2 ? 1 : -1) * U * (e.trait == "zigzag" ? .2 : .32);
        pts.push([(1 - t) * (1 - t) * p0[0] + 2 * t * (1 - t) * m[0] + t * t * p1[0] - dy / l * a, (1 - t) * (1 - t) * p0[1] + 2 * t * (1 - t) * m[1] + t * t * p1[1] + dx / l * a]);
      }
      out.push(P(pd(e.trait == "zigzag" ? "l" : "~", pts), c, sw));
    } else out.push(P("M" + f(p0) + "Q" + f(m) + " " + f(p1), c, sw, 0, e.trait == "pointille" ? ' stroke-dasharray=".1 ' + r1(sw * 2.7) + '"' : ""));
    function head(p) {
      var a = Math.atan2(p[1] - m[1], p[0] - m[0]), s = U * .38 * Math.sqrt(e.ep || 1), h = function (t) { return [p[0] - Math.cos(a + t) * s, p[1] - Math.sin(a + t) * s]; };
      out.push(P("M" + f(h(.5)) + "L" + f(p) + "L" + f(h(-.5)), c, sw));
    }
    if (po == "fin" || po == "deux") head(p1);
    if (po == "deux" || po == "debut") head(p0);
    if (e.texte) { q = [.25 * p0[0] + .5 * m[0] + .25 * p1[0], .25 * p0[1] + .5 * m[1] + .25 * p1[1]]; txt(e.texte, q[0] - U * 3.5, q[1] - U, U * 7, U * 2, { H: (e.taille || T0 * .75) * U, c: col(e.encre, c), ca: ACC, bg: 1 }); }
  }
  function perso(e) {
    var h = (e.h || 3) * U, x = e.x * U, y = e.y * U, w = h * .5, cx = x + w / 2, c = col(e.couleur, COL.noir), hr = h * .13, sw = h * .02 + 1.2,
      y1 = y + 2 * hr + h * .03, yb = y + h * .74, g = e.regard == "g" ? -1 : e.regard == "f" ? 0 : 1, sy = y1 + h * .1, a;
    function L(p) { out.push(P(wob(p), c, sw)); }
    L([[cx - w * .1, yb - 4], [cx - w * .11, y + h], [cx - w * .24, y + h]]);
    L([[cx + w * .1, yb - 4], [cx + w * .11, y + h], [cx + w * .24, y + h]]);
    a = { neutre: [[-.36, .3], [.36, .3]], bras: [[-.52, -.12], [.52, -.12]], pointe: g < 0 ? [[-.66, .02], [.36, .3]] : [[-.36, .3], [.66, .02]], accueil: [[-.56, .2], [.56, .2]] }[e.pose || "neutre"] || [[-.36, .3], [.36, .3]];
    L([[cx - w * .19, sy], [cx + w * a[0][0], y1 + h * a[0][1]]]);
    L([[cx + w * .19, sy], [cx + w * a[1][0], y1 + h * a[1][1]]]);
    out.push(P(pd("o", [[cx - w * .15, y1], [cx + w * .15, y1], [cx + w * .31, yb], [cx - w * .31, yb]]), c, sw, e.fond ? col(e.fond) : paper));
    out.push(P(ell(cx, y + hr, hr, hr), c, sw, paper));
    out.push(P("M" + f([cx + g * hr * .28 - hr * .3, y + hr * .9]) + "l0 .1M" + f([cx + g * hr * .28 + hr * .3, y + hr * .9]) + "l0 .1", c, sw * 1.5));
    if (e.texte) txt(e.texte, cx - w * 1.6, y + h + U * .2, w * 3.2, U * 2, { H: (e.taille || T0 * .75) * U, c: col(e.encre, COL.noir), ca: ACC, va: "h" });
    return reg(e, x, y, w, h);
  }
  function picto(e) {
    var s = (e.h || 2) * U, x = e.x * U, y = e.y * U, g = PI[e.nom];
    if (e.formes) g = { w: 12, s: e.formes.map(function (q) {
      var k = q[0], a = q.slice(1), p = [], i, r;
      if (k == "rect") return { k: "l", p: [[a[0], a[1]], [a[0] + a[2], a[1]], [a[0] + a[2], a[1] + a[3]], [a[0], a[1] + a[3]], [a[0], a[1]]] };
      if (k == "cercle") { r = a[3] == null ? a[2] : a[3]; return { k: "e", p: [[a[0] - a[2], a[1] - r], [a[0] + a[2], a[1] - r], [a[0] + a[2], a[1] + r], [a[0] - a[2], a[1] + r]] }; }
      for (i = 0; i + 1 < a.length; i += 2) p.push([a[i], a[i + 1]]);
      if (k == "tri") p.push(p[0]);
      return { k: k == "courbe" ? "~" : "l", p: p };
    }) };
    else if (!g) { warn.push("PICTO INCONNU : " + e.nom); return; }
    else g = parse(g);
    ink(g, x, y, s / 12, col(e.couleur, COL.noir), s * .03 + 1.5);
    if (e.texte) txt(e.texte, x - s, y + s + U * .2, s * 3, U * 2, { H: (e.taille || T0 * .75) * U, c: col(e.encre, COL.noir), ca: ACC, va: "h" });
    return reg(e, x, y, s, s);
  }
  /* structures toutes faites, developpees en cadres et liens */
  function mix(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }
  function expand(e, E, i) {
    var id = e.id || "s" + i, it = e.items || [], n = it.length, st = { forme: e.forme, fond: e.fond, couleur: e.couleur, ombre: e.ombre, taille: e.taille, police: e.police, encre: e.encre, al: e.al, va: e.va },
      x = e.x, y = e.y, w = e.w, h = e.h, j, k, v, o;
    function item(s, extra) { return mix(mix({ t: "cadre" }, st), mix(typeof s == "string" ? { texte: s } : s, extra)); }
    if (e.t == "etapes") {
      v = e.sens == "v"; k = st.forme == "chevron" ? (v ? .3 : -.25) : v ? 1 : 1.3; o = ((v ? h : w) - k * (n - 1)) / n;
      for (j = 0; j < n; j++) {
        E.push(item(it[j], { id: id + "_" + j, x: v ? x : x + j * (o + k), y: v ? y + j * (o + k) : y, w: v ? w : o, h: v ? o : h, num: e.num === false ? null : j + 1 }));
        if (j && st.forme != "chevron") E.push({ t: "lien", de: id + "_" + (j - 1), vers: id + "_" + j, couleur: e.lien, ep: 1.3 });
      }
    } else if (e.t == "cycle") {
      k = e.bw || Math.min(w * .3, 7); o = e.bh || Math.min(h * .24, 3);
      for (j = 0; j < n; j++) {
        v = j / n * 6.2832 - 1.5708;
        E.push(item(it[j], { id: id + "_" + j, x: x + (w - k) / 2 * (1 + Math.cos(v)), y: y + (h - o) / 2 * (1 + Math.sin(v)), w: k, h: o }));
      }
      for (j = 0; j < n; j++) E.push({ t: "lien", de: id + "_" + j, vers: id + "_" + (j + 1) % n, courbe: n > 2 ? -.28 : -.5, couleur: e.lien, ep: 1.3 });
    } else if (e.t == "matrice") {
      k = e.cols || 3; o = e.rows || 3;
      if (e.axeX || e.axeY) {
        E.push({ t: "lien", de: [x, y + h], vers: [x + w + .7, y + h], ep: 1.7 }, { t: "lien", de: [x, y + h], vers: [x, y - .7], ep: 1.7 });
        E.push({ t: "cadre", forme: "aucun", texte: e.axeX, x: x + w - 9, y: y + h + .3, w: 9.7, h: 1.2, al: "d", va: "h", police: "grasse", taille: e.taille, encre: e.encre });
        E.push({ t: "cadre", forme: "aucun", texte: e.axeY, x: x + .45, y: y - 1.1, w: 10, h: 1.1, al: "g", police: "grasse", taille: e.taille, encre: e.encre });
      } else E.push({ t: "cadre", x: x, y: y, w: w, h: h, fond: "none", couleur: e.couleur });
      for (j = 1; j < k; j++) E.push({ t: "lien", de: [x + j * w / k, y], vers: [x + j * w / k, y + h], pointe: "aucune", trait: "pointille", couleur: "gris" });
      for (j = 1; j < o; j++) E.push({ t: "lien", de: [x, y + j * h / o], vers: [x + w, y + j * h / o], pointe: "aucune", trait: "pointille", couleur: "gris" });
      (e.cases || []).forEach(function (row, r) {
        row.forEach(function (s, c) { if (s) E.push(item(s, { id: id + "_" + r + "_" + c, forme: "aucun", x: x + c * w / k + .3, y: y + r * h / o + .25, w: w / k - .6, h: h / o - .5, al: "g", va: "h", police: e.police || "grasse" })); });
      });
    } else if (e.t == "mindmap") {
      var br = e.branches || [], nb = br.length, nr = Math.ceil(nb / 2), cw = Math.min(w * .2, 7), ch = Math.min(h * .2, 3.2), cx = x + w / 2,
        pal = ["orange", "bleu", "vert", "rouge", "violet", "noir"], side = (w - cw) / 2 - w * .05, bw = side * .38, lw = side * .62;
      E.push({ t: "cadre", id: id, forme: e.forme || "nuage", texte: e.centre, x: cx - cw / 2, y: y + (h - ch) / 2, w: cw, h: ch, police: "extra", ombre: e.ombre });
      br.forEach(function (b, bi) {
        var rt = !(bi % 2), cnt = rt ? nr : nb - nr, idx = bi >> 1, sh = h / cnt, cy = y + sh * (idx + .5), c = b.couleur || pal[bi % 6], fe = b.feuilles || [], m = fe.length,
          bh = Math.min(sh * .7, 1.5), bx = rt ? cx + cw / 2 + w * .03 : cx - cw / 2 - w * .03 - bw, lh = Math.min(sh * .92 / (m || 1), 1.9), bid = id + "_" + bi;
        E.push({ t: "cadre", id: bid, forme: "souligne", couleur: c, texte: b.texte, x: bx, y: cy - bh / 2, w: bw, h: bh, police: "grasse", taille: e.taille });
        E.push({ t: "lien", de: id, vers: bid, trait: "branche", couleur: c, courbe: (rt ? 1 : -1) * (cy < y + h / 2 ? -.2 : .2) });
        fe.forEach(function (s, fi) {
          var ly = cy + (fi - m / 2) * lh, lx = rt ? bx + bw + w * .02 : bx - w * .02 - lw;
          E.push({ t: "cadre", id: bid + "_" + fi, forme: "aucun", texte: s, x: lx, y: ly + lh * .06, w: lw, h: lh * .88, al: rt ? "g" : "d", taille: (e.taille || T0) * .8 });
          E.push({ t: "lien", de: [rt ? bx + bw : bx, cy + bh / 2], vers: [rt ? lx - .1 : lx + lw + .1, ly + lh / 2], pointe: "aucune", couleur: c, ep: .7 });
        });
      });
    } else if (e.t == "couloirs") {
      /* un sujet par ligne, le temps en colonnes : chaque sujet est une fleche qui traverse les colonnes */
      var L = e.lignes || [], C = e.colonnes || [], nc = C.length || 1, T = e.taille || T0, lw = Math.min(w * .17, 5.5),
        rw = e.repere || L.some(function (l) { return l.jalon; }) ? Math.min(w * .13, 3.8) : 0, cx0 = x + lw, cw = (w - lw - rw) / nc, xe = cx0 + cw * nc,
        hh = T * 2.9, lh = (h - hh) / (L.length || 1);
      C.forEach(function (s, c) {
        E.push({ t: "cadre", forme: "aucun", texte: s, x: cx0 + c * cw, y: y, w: cw, h: T * 2.1, police: "grasse", taille: T * 1.3, encre: (e.couleurs || [])[c] });
        if (c) {
          E.push({ t: "lien", de: [cx0 + c * cw, y + hh], vers: [cx0 + c * cw, y + h], trait: "pointille", pointe: "aucune", couleur: "gris" });
          if ((e.separateurs || [])[c - 1]) E.push({ t: "texte", sur: true, texte: e.separateurs[c - 1], x: cx0 + c * cw - 3, y: y + T * 1.95, w: 6, h: T * 1.1, taille: T * .62, encre: "gris" });
        }
      });
      if (rw) E.push({ t: "lien", de: [xe + .25, y + T * 1.6], vers: [xe + .25, y + h], pointe: "aucune", couleur: "bleu", ep: 2 });
      if (e.repere) E.push({ t: "cadre", forme: "aucun", texte: e.repere, x: xe + .45, y: y, w: rw - .45, h: T * 2.1, police: "grasse", taille: T, encre: "bleu" });
      L.forEach(function (l, i) {
        var tx = l.textes || [], a = 0, b = nc - 1, ly = y + hh + i * lh + .15, ah, ax, aw, n, c;
        while (a < b && !tx[a]) a++;
        while (b > a && !tx[b]) b--;
        ah = Math.max(1.2, Math.min(lh - .4 - (l.note ? T * 1.05 : 0), T * 4.4 + .7)); ax = cx0 + a * cw + .15; aw = xe - ax; n = Math.min(ah * .45, aw * .18) * 1.3;
        E.push({ t: "cadre", forme: "aucun", texte: l.nom, x: x, y: ly, w: lw - .2, h: ah, police: "grasse", taille: T * 1.3, encre: l.encre || ACC });
        E.push({ t: "cadre", id: id + "_" + i, forme: "fleche", corps: .72, fond: l.fond || "ciel", couleur: l.couleur, x: ax, y: ly, w: aw, h: ah });
        for (c = a; c <= b; c++) if (tx[c]) E.push({ t: "texte", sur: true, texte: tx[c], x: cx0 + c * cw + (c == a ? .15 : 0), y: ly + ah * .14 - .2, w: cw - (c == a ? .15 : 0) - (c == nc - 1 ? n * .8 : 0), h: ah * .72 + .4, taille: T });
        if (l.note) E.push({ t: "texte", sur: true, texte: l.note, x: ax, y: ly + ah - .1, w: aw, h: T * 1.2, al: "g", police: "fine", taille: T * .78 });
        if (l.jalon) E.push({ t: "cadre", id: id + "_" + i + "_j", texte: l.jalon, fond: "jaune", ombre: true, x: xe + .75, y: ly + ah * .16, w: rw - .9, h: ah * .68, police: "grasse", taille: T * .85 });
      });
    } else E.push(e);
  }

  function dessine(V) {
    var g = V.grille || [32, 18], W = g[0] * U, Hh = g[1] * U, t = String(V.titre || ""), i, s = 7, E = [], b, r, a, x, H, gr = "", doc = document;
    for (i = 0; i < t.length; i++) s = (s * 31 + t.charCodeAt(i)) % 2147483646;
    S = (V.graine || s) + 1; K = V.main == null ? 1 : V.main; paper = col(V.papier, "#fffdf7"); ACC = col(V.accent, COL.orange); T0 = V.taille || .6;
    out = []; warn = []; box = {}; chk = [];
    if (sum() != SUM) warn.push("MOTEUR ALT\u00c9R\u00c9 (tables de lettres) : demande \u00e0 l'agent de recopier le moteur \u00e0 l'identique");
    (V.elements || []).forEach(function (e, i) { expand(e, E, i); });
    /* enregistrement des emplacements avant de tracer les liens */
    E.forEach(function (e) { if (e.id && e.x != null) box[e.id] = { x: e.x * U, y: e.y * U, w: (e.t == "perso" ? (e.h || 3) * .5 : e.t == "picto" ? e.h || 2 : e.w) * U, h: (e.h || (e.t == "perso" ? 3 : 2)) * U, o: /ovale|cercle|nuage/.test(e.forme) }; });
    E.forEach(function (e) { if (e.forme == "zone") cadre(mix({ t: "cadre" }, e)); });
    E.forEach(function (e) { if (e.t == "lien") lien(e); });
    if (t) {
      x = (V.titreX == null ? 1 : V.titreX) * U; H = (V.titreTaille || 1.3) * U; a = V.titreAl || "g";
      r = txt(t, x, .7 * U, W - 2 * x, H * 2.5, { H: H, po: V.titrePolice || "extra", c: COL.noir, ca: ACC, al: a, va: "h" });
      if (r) {
        out.push(P(wob([[r.x, r.y + r.h + H * .3], [r.x + r.w, r.y + r.h + H * .3]]), ACC, H * .13));
        b = { x: r.x, y: r.y, w: r.w, h: r.h + H * .4, n: "TITRE" };
        if (V.sous) { r = txt(V.sous, x, b.y + b.h + H * .22, W - 2 * x, H * 1.6, { H: H * .45, c: COL.gris, ca: ACC, al: a, va: "h" }); if (r) b.h = r.y + r.h - b.y; }
        chk.push(b);
      }
    }
    E.forEach(function (e) {
      var q;
      if (e.forme == "zone" || e.t == "lien") return;
      if (e.t == "perso") q = perso(e); else if (e.t == "picto") q = picto(e);
      else if (e.t == "cadre" || e.t == "texte") q = cadre(e.t == "texte" ? mix({ forme: "aucun" }, e) : e);
      else warn.push("TYPE INCONNU : " + e.t);
      if (q && e.fond != "none" && !e.sur) chk.push(q);
    });
    /* controles : chevauchements et debordements */
    chk.forEach(function (p, i) {
      if (p.x < -2 || p.y < -2 || p.x + p.w > W + 2 || p.y + p.h > Hh + 2) warn.push("HORS DU SUPPORT : " + p.n);
      chk.slice(i + 1).forEach(function (q) {
        var ox = Math.min(p.x + p.w, q.x + q.w) - Math.max(p.x, q.x), oy = Math.min(p.y + p.h, q.y + q.h) - Math.max(p.y, q.y);
        if (ox > 4 && oy > 4 && ox * oy > .06 * Math.min(p.w * p.h, q.w * q.h)) warn.push("CHEVAUCHEMENT : " + p.n + " / " + q.n);
      });
    });
    for (i = 0; i <= g[0]; i++) gr += '<path d="M' + i * U + " 0V" + Hh + '" stroke="#3b9bd6" stroke-width="' + (i % 5 ? .6 : 1.6) + '"/>' + (i % 5 || !i ? "" : '<text x="' + (i * U + 4) + '" y="15">' + i + "</text>");
    for (i = 0; i <= g[1]; i++) gr += '<path d="M0 ' + i * U + "H" + W + '" stroke="#3b9bd6" stroke-width="' + (i % 5 ? .6 : 1.6) + '"/>' + (i % 5 || !i ? "" : '<text x="4" y="' + (i * U - 5) + '">' + i + "</text>");
    s = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + Hh + '" viewBox="0 0 ' + W + " " + Hh + '" stroke-linecap="round" stroke-linejoin="round" style="width:100%;height:auto;display:block;background:' + paper + '"><rect width="' + W + '" height="' + Hh + '" fill="' + paper + '"/>' + out.join("") +
      '<g id="fgq" opacity=".55" font-family="sans-serif" font-size="14" fill="#1b6fa8" style="display:' + (V.maquette ? "inline" : "none") + '">' + gr + "</g></svg>";
    /* page : barre d'outils, alertes, dessin */
    doc.body.style.cssText = "margin:0;background:#e8e4dc;font:13px system-ui,sans-serif;color:#222";
    doc.body.innerHTML = '<div style="padding:8px 12px;display:flex;gap:8px;flex-wrap:wrap;align-items:center"><button id="fg1">GRILLE</button><button id="fg2">PNG</button><button id="fg3">SVG</button><span>' + g[0] + " × " + g[1] + " carreaux" + (V.cm ? " — 1 carreau = " + V.cm + " cm sur le support réel" : "") + '</span></div><div id="fgw" style="padding:0 12px 8px;color:#b3261e;font-weight:600;white-space:pre-line"></div><div id="fgs" style="margin:0 12px 12px;box-shadow:0 1px 6px rgba(0,0,0,.25)">' + s + '</div><div id="fgn" style="padding:0 12px"></div><img id="fgi" alt="" style="display:none;max-width:calc(100% - 24px);margin:8px 12px">';
    if (warn.length) doc.getElementById("fgw").textContent = "À CORRIGER (copie ces lignes à l'agent) :\n" + warn.join("\n");
    function dl(u, n) { var l = doc.createElement("a"); l.href = u; l.download = n; doc.body.appendChild(l); l.click(); l.remove(); }
    function save(png) {
      var u = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(doc.querySelector("#fgs svg"))), n = (t || "visuel").toLowerCase().replace(/[^a-z0-9à-ÿ]+/g, "-").replace(/^-|-$/g, ""), im;
      if (!png) return dl(u, n + ".svg");
      im = new Image();
      im.onload = function () {
        var c = doc.createElement("canvas"), o; c.width = W * 2; c.height = Hh * 2; c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        o = c.toDataURL("image/png"); dl(o, n + ".png"); doc.getElementById("fgi").src = o; doc.getElementById("fgi").style.display = "block";
        doc.getElementById("fgn").textContent = "Si rien ne se télécharge : clic droit sur l'image ci-dessous > Copier l'image ou Enregistrer l'image sous.";
      };
      im.src = u;
    }
    doc.getElementById("fg1").onclick = function () { var q = doc.getElementById("fgq"); q.style.display = q.style.display == "none" ? "inline" : "none"; };
    doc.getElementById("fg2").onclick = function () { save(1); };
    doc.getElementById("fg3").onclick = function () { save(0); };
    return warn;
  }
  return {
    somme: sum,
    dessine: function (V) {
      try { return dessine(V); }
      catch (e) { document.body.innerHTML = '<pre style="color:#b3261e;padding:12px;white-space:pre-wrap">ERREUR DU MOTEUR (copie ce message à l\'agent) :\n' + String(e && e.stack || e).replace(/</g, "&lt;") + "</pre>"; return [String(e)]; }
    }
  };
})();
